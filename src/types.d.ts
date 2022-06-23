import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export type Context = {
  prisma: PrismaClient;
  request: Request;
  response: Response;
  userId?: string;
  tokenVersion?: number;
};

export type AccessTokenPayload = {
  user: string;
};

export type RefreshTokenPayload = AccessTokenPayload & {
  tokenVersion: number;
};

export type ICookie = {
  access: string;
  refresh: string;
};

export type VoteParams = {
  communityId: string;
  postId: string;
};

export type EligibilityParams = {
  data: VoteParams & { userId: string };
  context: Context;
};
