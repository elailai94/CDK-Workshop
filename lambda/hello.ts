import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";

async function sayHello(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  console.log(`request: ${JSON.stringify(event, undefined, 2)}`);

  return {
    body: `Good Night, CDK! You've hit ${event.rawPath}\n`,
    headers: { "Content-Type": "text/plain" },
    statusCode: 200,
  };
}

export { sayHello };
