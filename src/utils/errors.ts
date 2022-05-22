import { ApolloError } from "apollo-server-errors";

export class TokenError extends ApolloError {
  constructor(message: string) {
    super(message, "TOKEN_EXPIRED");

    Object.defineProperty(this, "name", { value: "TOKEN_EXPIRED_ERROR" });
  }
}
