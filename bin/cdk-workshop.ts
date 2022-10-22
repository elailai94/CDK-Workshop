#!/usr/bin/env node

import * as cdk from "aws-cdk-lib";

// import { CdkWorkshopStack } from "../lib/cdk-workshop-stack";
import { PipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();
new PipelineStack(app, "PipelineStack");
// const stack = new CdkWorkshopStack(app, "CdkWorkshopStack");

// cdk.Tags.of(stack).add("App", "Hello");
// cdk.Tags.of(stack).add("Environment", "Development");
