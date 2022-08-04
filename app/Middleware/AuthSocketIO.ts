import ApiToken from "App/Models/ApiToken";
import User from "App/Models/User";
import { Socket } from "socket.io";
const crypto = require('crypto');

const SocketErrors = {
  BadCredentials: 'E_BAD_CREDENTIALS',
  MissingParameter: 'E_MISSING_PARAMETER'
}
function urlDecode(encoded) {
  return Buffer.from(encoded, 'base64').toString('utf-8');
}

async function generateHash(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function parseToken(token) {
  const parts = token.split('.');
  /**
   * Ensure the token has two parts
   */
  if (parts.length !== 2) {
    throw new Error('E_INVALID_API_TOKEN');
  }

  /**
   * Ensure the first part is a base64 encode id
   */
  const tokenId = urlDecode(parts[0]);

  if (!tokenId) {
    throw new Error('E_INVALID_API_TOKEN');
  }

  const parsedToken = await generateHash(parts[1]);
  return {
    token: parsedToken,
    tokenId,
  };
}

async function checkToken(token: string): Promise<User> {
  const parsedToken = await parseToken(token);
  const apiToken = await ApiToken.query()
    .select('userId')
    .where('id', parsedToken.tokenId)
    .andWhere('token', parsedToken.token)
    .andWhere('type', 'api')
    .preload('user')
    .first();

  if (!apiToken) {
    throw new Error('E_INVALID_API_TOKEN');
  }
  return apiToken.user as User;
}

async function authenticate(socket: Socket): Promise<User> {
  const token = socket.handshake?.query?.token;
  if (!token || typeof token !== 'string') {
    throw new Error(SocketErrors.MissingParameter);
  }
  try {
    const user = await checkToken(token);
    return user;
  } catch (error) {
    throw new Error(SocketErrors.BadCredentials);
  }
}

export default authenticate;