export type OpenAI = {
  apiKey: string;
  proxy: string;
};

export type Env = {
  OPENAI_API_KEY: string;
};

export type ModelSettingsKey =
  | "max_tokens"
  | "temperature"
  | "top_p"
  | "presence_penalty"
  | "frequency_penalty";

export type AIStore = {
  openai: OpenAI;
  modelSettings: Record<ModelSettingsKey, any>;

  updateOpenAI: (openai: OpenAI) => void;
  updateModelSettings: (modelSettings: Record<ModelSettingsKey, any>) => void;
};
