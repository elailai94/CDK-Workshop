import * as cdk from "aws-cdk-lib";

import { APIGateway } from "./apigateway";
import { Lambda } from "./lambda";

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new Lambda(this, "HelloLambda");
    cdk.Tags.of(lambda).add("Module", "Function");

    const apiGateway = new APIGateway(this, "HelloAPIGateway", {
      routes: [{ handler: lambda.nodejsFunction, path: "/" }],
    });
    cdk.Tags.of(apiGateway).add("Module", "API");
  }
}
