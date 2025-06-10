import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const sagemaker = new AWS.SageMakerRuntime();

export async function invokePrediction(endpointName: string, inputData: string): Promise<string> {
  const params = {
    EndpointName: endpointName,
    Body: inputData,
    ContentType: 'application/json'
  };

  const response = await sagemaker.invokeEndpoint(params).promise();
  return response.Body?.toString('utf-8') || '';
}
