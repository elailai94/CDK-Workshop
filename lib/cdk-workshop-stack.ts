import * as cdk from "aws-cdk-lib";

import { APIGateway } from "./apigateway";
import { HitCounter } from "./hitcounter";
import { Lambda } from "./lambda";
import { TableViewer } from "cdk-dynamo-table-viewer";

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new Lambda(this, "HelloLambda", {
      handler: "sayHello",
    });
    cdk.Tags.of(lambda).add("Module", "Function");

    const hitCounter = new HitCounter(this, "HelloHitCounter", {
      downstream: lambda.nodejsFunction,
    });
    cdk.Tags.of(hitCounter).add("Module", "HitCounter");

    const apiGateway = new APIGateway(this, "HelloAPIGateway", {
      routes: [{ handler: hitCounter.lambda.nodejsFunction, path: "/{proxy+}" }],
    });
    cdk.Tags.of(apiGateway).add("Module", "API");

    const tableViewer = new TableViewer(this, "HelloHitsTableViewer", {
      table: hitCounter.table,
      title: "Hello Hits",
    });
    cdk.Tags.of(tableViewer).add("Module", "TableViewer");
  }
}
