import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

function sayHello(
  event: APIGatewayProxyEventV2
): APIGatewayProxyStructuredResultV2 {
  console.log(`request: ${JSON.stringify(event, undefined, 2)}`);

  return {
    body: `Hello CDK! You've hit ${event.rawPath}\n`,
    headers: { "Content-Type": "text/plain" },
    statusCode: 200,
  };
}

export { sayHello };
