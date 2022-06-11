import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export const prisma = new PrismaClient();

export type Context = {
  prisma: PrismaClient;
  request: Request;
  response: Response;
  userId?: string;
  tokenVersion?: number;
};

export function context({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Context {
  return {
    prisma,
    request: req,
    response: res,
    userId: "",
  };
}
