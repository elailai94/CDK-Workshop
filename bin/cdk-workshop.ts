#!/usr/bin/env node

import * as cdk from "aws-cdk-lib";

import { CdkWorkshopStack } from "../lib/cdk-workshop-stack";

const app = new cdk.App();
const stack = new CdkWorkshopStack(app, "CdkWorkshopStack");

cdk.Tags.of(stack).add("App", "Hello");
cdk.Tags.of(stack).add("Environment", "Development");
