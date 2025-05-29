import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-2_BkubuduYa', // Replace with your actual User Pool ID
  ClientId: 'h89n620jvd21lkaeaendmsmv3', // Replace with your App Client ID
};

export default new CognitoUserPool(poolData);
