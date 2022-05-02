import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { Context } from "types";

export const prisma = new PrismaClient();

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
