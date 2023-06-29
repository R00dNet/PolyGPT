import { Configuration } from "openai";
import dotenv from "dotenv";

dotenv.config();

export const OPEN_AI_CONFIG = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const WRAPS_LIBRARY_URL = `https://raw.githubusercontent.com/polywrap/agent-wrap-library/master/wraps`