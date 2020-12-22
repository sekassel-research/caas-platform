export interface Config {
  port: number;
  prefix?: string;
  auth?: AuthConfig;
  mongo?: MongoConfig;
}

export interface AuthConfig {
  algorithms?: string[];
  issuer?: string;
  publicKey?: string;
  realm?: string;
  resource?: string;
}

export interface MongoConfig {
  uri?: string;
}
