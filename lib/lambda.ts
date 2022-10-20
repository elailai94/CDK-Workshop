import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";

import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";

import { Construct } from "constructs";

interface LambdaProps {
  environment?: NodejsFunctionProps["environment"];
  handler: string;
}

class Lambda extends Construct {
  public readonly nodejsFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);

    this.nodejsFunction = new NodejsFunction(this, `${id}Function`, {
      architecture: lambda.Architecture.X86_64,
      bundling: {
        externalModules: ["aws-sdk"],
      },
      entry: path.join(__dirname, "..", "lambda", "index.ts"),
      environment: props.environment,
      handler: props.handler,
      runtime: lambda.Runtime.NODEJS_16_X,
      tracing: lambda.Tracing.ACTIVE,
    });

    new cdk.CfnOutput(this, "FunctionName", {
      exportName: `${id}FunctionName`,
      value: this.nodejsFunction.functionName,
    });
  }
}

export { Lambda };
