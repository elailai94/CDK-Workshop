import * as cdk from "aws-cdk-lib";
import * as codecommit from "aws-cdk-lib/aws-codecommit";

import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
} from "aws-cdk-lib/pipelines";

import { Construct } from "constructs";
import { PipelineStage } from "./pipeline-stage";

class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repository = new codecommit.Repository(this, "WorkshopRepo", {
      repositoryName: "CDKWorkshop",
    });

    const synth = new CodeBuildStep("SynthStep", {
      commands: [
        "npm install",
        "cd lambda",
        "npm install",
        "cd ..",
        "npm run build",
        "npx cdk synth",
      ],
      input: CodePipelineSource.codeCommit(repository, "main"),
      installCommands: ["npm install -g aws-cdk"],
    });

    const codePipeline = new CodePipeline(this, "CodePipeline", {
      pipelineName: "WorkshopPipeline",
      synth,
    });

    const deploy = new PipelineStage(this, "Deploy");
    const stageDeployment = codePipeline.addStage(deploy);

    stageDeployment.addPost(
      new CodeBuildStep("TestTableViewerURL", {
        commands: ["curl -Ssf $ENDPOINT_URL"],
        envFromCfnOutputs: {
          ENDPOINT_URL: deploy.tableViewerURL,
        },
        projectName: "TestTableViewerURL",
      }),
      new CodeBuildStep("TestAPIGatewayURL", {
        commands: [
          "curl -Ssf $ENDPOINT_URL",
          "curl -Ssf $ENDPOINT_URL/hello",
          "curl -Ssf $ENDPOINT_URL/test",
        ],
        envFromCfnOutputs: {
          ENDPOINT_URL: deploy.apiGatewayURL,
        },
        projectName: "TestAPIGatewayURL",
      })
    );
  }
}

export { PipelineStack };
