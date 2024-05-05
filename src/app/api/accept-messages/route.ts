import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User as UserNextAuth } from "next-auth";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();

  //   Get session and user stored inside session
  const session = await getServerSession(authOptions);
  const user: UserNextAuth = session?.user as UserNextAuth;

  //   Send error response if there is no session or no user in session
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      { status: 401 }
    );
  }

  //   Get userId and acceptMessages
  const userId = user._id;
  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true }
    );

    // Check if user exists and updated
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message:
            "user not exists or failed to change user accept message status",
        },
        { status: 401 }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "user accept messages status changed",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("failed to change user accept messages status");
    return Response.json(
      {
        success: false,
        message: "failed to change user accept messages status",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();

  //   Get session and user stored inside session
  const session = await getServerSession(authOptions);
  const user: UserNextAuth = session?.user as UserNextAuth;

  //   Send error response if there is no session or no user in session
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      { status: 401 }
    );
  }

  //   Get userId and user
  const userId = user._id;
  try {
    const foundUser = await User.findById(userId);

    // Check if user exists
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    } else {
      return Response.json(
        {
          success: true,
          isAcceptingMessages: foundUser.isAcceptingMessages,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("error while getting user accept messages status");
    return Response.json(
      {
        success: false,
        message: "error while getting user accept messages status",
      },
      { status: 500 }
    );
  }
}
