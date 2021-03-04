export interface Environment {
  production?: boolean;
  port?: number;
  prefix?: string;
  auth?: {
    issuer?: string;
    realm?: string;
    resource?: string;
    publicKey?: string;
  };
  mongo?: {
    user?: string;
    password?: string;
    host?: string;
    port?: string;
    database?: string;
    uri?: string;
  };
  kafka?: {
    clientId?: string;
    host?: string;
    port?: string;
  };
}
