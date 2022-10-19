import * as CdkWorkshop from "../lib/cdk-workshop-stack";
import * as cdk from "aws-cdk-lib";

import { Template } from "aws-cdk-lib/assertions";

test("say hello lambda function created", () => {
  const app = new cdk.App();
  const stack = new CdkWorkshop.CdkWorkshopStack(app, "MyTestStack");
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::Lambda::Function", {
    Architectures: ["x86_64"],
    Handler: "index.sayHello",
    Runtime: "nodejs16.x",
  });
});
