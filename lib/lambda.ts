import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";

import { Construct } from "constructs";

interface LambdaProps {
  handler: string;
}

class Lambda extends Construct {
  public readonly nodejsFunction: lambda.NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);

    this.nodejsFunction = new lambda.NodejsFunction(this, "SayHelloFunction", {
      architecture: Architecture.X86_64,
      bundling: {
        externalModules: ["aws-sdk"],
      },
      entry: path.join(__dirname, "..", "lambda", "index.ts"),
      handler: props.handler,
      runtime: Runtime.NODEJS_16_X,
    });

    new cdk.CfnOutput(this, "FunctionName", {
      exportName: "FunctionName",
      value: this.nodejsFunction.functionName,
    });
  }
}

export { Lambda };
