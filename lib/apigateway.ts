import * as apigateway from "@aws-cdk/aws-apigatewayv2-alpha";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";

import { Construct } from "constructs";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

interface Route {
  handler: lambda.IFunction;
  path: string;
}

interface APIGatewayProps {
  routes: Route[];
}

class APIGateway extends Construct {
  public readonly httpAPI: apigateway.HttpApi;

  constructor(scope: Construct, id: string, props?: APIGatewayProps) {
    super(scope, id);

    this.httpAPI = new apigateway.HttpApi(this, "HelloAPI", {
      apiName: "hello-api",
      corsPreflight: {
        allowMethods: [apigateway.CorsHttpMethod.GET],
        allowOrigins: ["*"],
        maxAge: cdk.Duration.days(10),
      },
      createDefaultStage: true,
    });

    for (const { handler, path } of props?.routes ?? []) {
      const integration = new HttpLambdaIntegration(
        "HttpLambdaIntegration",
        handler
      );

      this.httpAPI.addRoutes({
        integration,
        methods: [apigateway.HttpMethod.GET],
        path,
      });
    }

    new cdk.CfnOutput(this, "APIEndpoint", {
      exportName: "APIEndpoint",
      value: this.httpAPI.url!,
    });
  }
}

export { APIGateway };
