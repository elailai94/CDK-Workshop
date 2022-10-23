import * as cdk from "aws-cdk-lib";

import { CdkWorkshopStack } from "./cdk-workshop-stack";
import { Construct } from "constructs";

class PipelineStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const stack = new CdkWorkshopStack(this, "CdkWorkshopStack");
    cdk.Tags.of(stack).add("App", "Hello");
    cdk.Tags.of(stack).add("Environment", "Development");
  }
}

export { PipelineStage };
