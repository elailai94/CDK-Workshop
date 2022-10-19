import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { DynamoDB, Lambda } from "aws-sdk";

async function countHit(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> {
  console.log(`request: ${JSON.stringify(event, undefined, 2)}`);

  // Create AWS SDK clients
  const dynamoDB = new DynamoDB();
  const lambda = new Lambda();

  // Update DynamoDB entry for "path" by incrementing the hit counter
  await dynamoDB
    .updateItem({
      ExpressionAttributeValues: { ":incr": { N: "1" } },
      Key: { path: { S: event.rawPath } },
      TableName: process.env.HITS_TABLE_NAME!,
      UpdateExpression: "ADD hits :incr",
    })
    .promise();

  // Call downstream function and capture response
  const response = await lambda
    .invoke({
      FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME!,
      Payload: JSON.stringify(event),
    })
    .promise();

  console.log(`downstream response: ${JSON.stringify(response, undefined, 2)}`);

  // Return response back to upstream caller
  return JSON.parse(response.Payload as string);
}

export { countHit };
