import * as cdk from "aws-cdk-lib";

import { CdkWorkshopStack } from "./cdk-workshop-stack";
import { Construct } from "constructs";

class PipelineStage extends cdk.Stage {
  public readonly apiGatewayURL: cdk.CfnOutput;
  public readonly tableViewerURL: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const stack = new CdkWorkshopStack(this, "CdkWorkshopStack");
    cdk.Tags.of(stack).add("App", "Hello");
    cdk.Tags.of(stack).add("Environment", "Development");

    this.apiGatewayURL = stack.apiGatewayURL;
    this.tableViewerURL = stack.tableViewerURL;
  }
}

export { PipelineStage };
