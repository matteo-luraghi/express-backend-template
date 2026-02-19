import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true, // allows standard email/password login
  },
  user: {
    additionalFields: {
      metricSystem: {
        type: "string",
        required: true // else will strip the field from request
      }
    }
  }
});
