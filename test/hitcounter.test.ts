import * as cdk from "aws-cdk-lib";

import { Capture, Template } from "aws-cdk-lib/assertions";

import { HitCounter } from "../lib/hitcounter";
import { Lambda } from "../lib/lambda";

test("hits dynamodb table created", () => {
  const stack = new cdk.Stack();
  const lambda = new Lambda(stack, "TestLambda", {
    handler: "sayHello",
  });

  new HitCounter(stack, "TestHitCounter", {
    downstream: lambda.nodejsFunction,
  });

  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::DynamoDB::Table", 1);
});

test("hits dynamodb table created with encryption", () => {
  const stack = new cdk.Stack();
  const lambda = new Lambda(stack, "TestLambda", {
    handler: "sayHello",
  });

  new HitCounter(stack, "TestHitCounter", {
    downstream: lambda.nodejsFunction,
  });

  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::DynamoDB::Table", {
    SSESpecification: {
      SSEEnabled: true,
    },
  });
});

test("hits lambda function has environment variables", () => {
  const stack = new cdk.Stack();
  const lambda = new Lambda(stack, "TestLambda", {
    handler: "sayHello",
  });

  new HitCounter(stack, "TestHitCounter", {
    downstream: lambda.nodejsFunction,
  });

  const template = Template.fromStack(stack);
  const capture = new Capture();
  template.hasResourceProperties("AWS::Lambda::Function", {
    Handler: "index.countHit",
    Environment: capture,
  });

  expect(capture.asObject()).toHaveProperty(
    "Variables.DOWNSTREAM_FUNCTION_NAME.Ref",
    "TestLambdaTestLambdaFunction4F0E72F3"
  );
  expect(capture.asObject()).toHaveProperty(
    "Variables.HITS_TABLE_NAME.Ref",
    "TestHitCounterHits7D92E6DA"
  );
});
