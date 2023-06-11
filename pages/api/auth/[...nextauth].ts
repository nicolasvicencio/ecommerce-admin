import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next/types";

const adminEmails = ["nicolas.vicencio.or@gmail.com"];
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    //@ts-ignore
    session: ({ session }) => {
      if (!adminEmails.includes(session?.user?.email)) return false;
      return session;
    },
  },
};

export async function isAdminRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authConfig);
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw "This emails doesn't belong to an admin";
  }
}

export default NextAuth(authConfig);
