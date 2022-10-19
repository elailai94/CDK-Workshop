import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";

import { Construct } from "constructs";

interface LambdaProps {}

class Lambda extends Construct {
  public readonly nodejsFunction: lambda.NodejsFunction;

  constructor(scope: Construct, id: string, _props?: LambdaProps) {
    super(scope, id);

    this.nodejsFunction = new lambda.NodejsFunction(this, "SayHelloFunction", {
      architecture: Architecture.X86_64,
      bundling: {
        externalModules: ["aws-sdk"],
      },
      entry: path.join(__dirname, "..", "lambda", "index.ts"),
      handler: "sayHello",
      runtime: Runtime.NODEJS_16_X,
    });
  }
}

export { Lambda };
