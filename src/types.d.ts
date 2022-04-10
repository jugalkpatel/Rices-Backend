import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export type Context = {
  prisma: PrismaClient;
  request: Request;
  response: Response;
  userId?: string;
};

export type AuthTokenPayload = {
  userId: string;
};
