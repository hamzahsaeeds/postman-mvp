export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface AuthConfig {
  type: "none" | "bearer" | "basic" | "apikey";
  token?: string;
  username?: string;
  password?: string;
  keyName?: string;
  keyValue?: string;
  keyLocation?: "header" | "query";
}

export interface RequestConfig {
  method: string;
  url: string;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  data?: any;
  auth?: {
    username: string;
    password: string;
  };
}

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export type TabType = "params" | "auth" | "headers" | "body";
