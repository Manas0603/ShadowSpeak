import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

interface Credentials {
  identifier: string;
  password: string;
}

interface AuthorizedUser extends User {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthorizedUser | null> {
        await dbConnect();

        if (!credentials) {
          throw new Error("Missing credentials");
        }

        const { identifier, password } = credentials as Credentials;

        const user = await UserModel.findOne({
          $or: [{ email: identifier }, { username: identifier }],
        });

        if (!user) {
          throw new Error("No user found with this email/username");
        }

        if (!user.isVerified) {
          throw new Error("Please verify your account before logging in");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        return {
          id: user._id.toString(), 
          _id: user._id.toString(),
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
          isAcceptingMessages: user.isAcceptingMessages,
        };
      },
    }),
  ],

  callbacks:{
    async jwt({token, user}){
        if(user){
            token._id=user._id?.toString()
            token.isVerified=user.isVerified;
            token.isAcceptingMessages=user.isAcceptingMessages;
            token.username=user.username;
        }
        
        return token;       
     },

async session({session, token}){
    if(token){
        session.user._id=token._id;
        session.user.isVerified=token.isVerified;
        session.user.isAcceptingMessages=token.isAcceptingMessages;
        session.user.username=token.username;
    }
    return session;
}
}, 
  session: {
    strategy: 'jwt',
  },
  secret: "OU4X9VnZhIA6LuJd39fyKUxZ4pGO2iGK/u3qkwq5+58=",
  pages: {
    signIn: '/sign-in',
  },
};
