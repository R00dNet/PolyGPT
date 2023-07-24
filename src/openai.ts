import { WrapLibrary } from "./wrap";

import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
  ChatCompletionRequestMessageFunctionCall,
  Configuration,
  OpenAIApi
} from "openai";
import {
  InvokeOptions,
  PolywrapClient
} from "@polywrap/client-js";
import axios from "axios";

export {
  ChatCompletionResponseMessage as OpenAIResponse,
  ChatCompletionRequestMessageFunctionCall as OpenAIFunctionCall
};

export class OpenAI {
  private _configuration: Configuration;
  private _api: OpenAIApi;

  constructor(
    private _apiKey: string,
    private _defaultModel: string
  ) {
    this._configuration = new Configuration({
      apiKey: this._apiKey
    });
    this._api = new OpenAIApi(this._configuration);
  }

  createChatCompletion(options: {
    messages: ChatCompletionRequestMessage[];
    model?: string;
    functions?: any;
    temperature?: number
    max_tokens?: number
  }) {
    return this._api.createChatCompletion({
      messages: options.messages,
      model: options.model || this._defaultModel,
      functions: options.functions,
      function_call: options.functions ? "auto" : undefined,
      temperature: options.temperature || 0,
      max_tokens: options.max_tokens
    });
  }
}

export const functionDescriptions = [
  {
    name: "InvokeWrap",
    description: `A function to invoke or execute any wrap method. 
                  It receives an option object with a uri, method and optional args
                  For example
                  Function = InvokeWrap
                  Arguments = Options {
                    uri: <URI Here>,
                    method: <Method Name>,
                    args: <Args if necessary>
                  }`,
    parameters: {
      type: "object",
      properties: {
        options: {
          type: "object",
          description:
            `The options to invoke a wrap method, including the URI, METHOD, ARGS,
            where ARGS is optional, and both Uri and Method are required`,
        },
      },
      required: ["options"],
    },
  },
  {
    name: "LoadWrap",
    description: `A function to fetch the graphql schema for method analysis and introspection. 
                  It receives a wrap name.
                  For example
                  Function = LoadWrap
                  Arguments = Options {
                    name: <Wrap Name Here>
                  }`,
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            `The name of the wrap to load`,
        },
      },
      required: ["options"],
    },
  },
];

export const functions = (
  library: WrapLibrary.Reader,
  client: PolywrapClient
) => ({
  InvokeWrap: async (options: InvokeOptions) => {
    try {
      const result = await client.invoke(options);
      return result.ok
        ? {
          ok: true,
          result: result.value,
        }
        : {
          ok: false,
          error: result.error?.toString() ?? "",
        };
    } catch (e: any) {
      return {
        ok: false,
        error: e,
      };
    }
  },
  LoadWrap: async ({ name }: { name: string }) => {
    try {
      const wrapInfo = await library.getWrap(name);
      const { data: wrapSchemaString } = await axios.get<string>(wrapInfo.abi);

      return {
        ok: true,
        result: wrapSchemaString,
      }
    } catch (e: any) {
      return {
        ok: false,
        error: e,
      };
    }
  },
});