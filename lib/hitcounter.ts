import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";

import { Construct } from "constructs";
import { Lambda } from "./lambda";

interface HitCounterProps {
  // The function for which we want to count url hits
  downstream: lambda.IFunction;

  /**
   * The read capacity units for the table
   *
   * Must be greater than 5 and less than 20
   *
   * @default 5
   */
  readCapacity?: number;
}

class HitCounter extends Construct {
  public readonly lambda: Lambda;
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    if (
      props.readCapacity !== undefined &&
      (props.readCapacity < 5 || props.readCapacity > 20)
    ) {
      throw new Error("readCapacity must be greater than 5 and less than 20");
    }

    super(scope, id);

    this.table = new dynamodb.Table(this, "Hits", {
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      partitionKey: { name: "path", type: dynamodb.AttributeType.STRING },
      readCapacity: props.readCapacity ?? 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    cdk.Tags.of(this.table).add("Module", "DynamoDB");

    this.lambda = new Lambda(this, "HitsLambda", {
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: this.table.tableName,
      },
      handler: "countHit",
    });
    cdk.Tags.of(this.lambda).add("Module", "Function");

    // Grant the lambda role read/write permissions to our table
    this.table.grantReadWriteData(this.lambda.nodejsFunction);

    // Grant the lambda role invoke permissions to the downstream function
    props.downstream.grantInvoke(this.lambda.nodejsFunction);
  }
}

export { HitCounter };
