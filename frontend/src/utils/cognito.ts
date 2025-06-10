// frontend/src/utils/cognito.ts
import UserPool from '/Users/manassingh/LeanFoundr/frontend/src/cognito/UserPool.js';
import { CognitoUser } from 'amazon-cognito-identity-js';

/**
 * Returns the current logged-in user's username, or null if nobody is signed in.
 * 
 * (CognitoUser.getUsername() typically returns the "username" field that the user registered with. 
 *  If you want email instead, you'd call getSession() & then getUserAttributes().)
 */
export function getCurrentUsername(): string | null {
  const cognitoUser: CognitoUser | null = UserPool.getCurrentUser();
  if (!cognitoUser) {
    return null;
  }

  // This returns the Cognito username. If you instead want the user's email, you would need
  // to call cognitoUser.getSession(...) and then cognitoUser.getUserAttributes(...) asynchronously.
  // For simplicity, we’ll just use getUsername() here.
  return cognitoUser.getUsername();
}
