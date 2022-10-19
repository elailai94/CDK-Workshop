import * as cdk from "aws-cdk-lib";

import { Lambda } from "./lambda";

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Lambda(this, "SayHelloLambda");
  }
}
