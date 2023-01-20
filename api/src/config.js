import { config } from 'dotenv'

config()

export const PORT = process.env.PORT ?? 4000;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? '';
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? '';
export const GITHUB_AUTHORIZE_URL = process.env.GITHUB_AUTHORIZE_URL ?? '';