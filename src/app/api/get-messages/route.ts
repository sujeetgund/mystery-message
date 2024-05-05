import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User as UserNextAuth } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: UserNextAuth = session?.user as UserNextAuth;

  //   Check if there is session and user inside it
  if (!session || !user) {
    return Response.json({
      success: false,
      message: "not authenticated",
    });
  }

  //   Get useerId from user and typecast it in ObjectId
  const userId = new mongoose.Types.ObjectId(user.id);

  try {
    const userAggregatedWithPipeline = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    // Check if user exists
    if (
      !userAggregatedWithPipeline ||
      userAggregatedWithPipeline.length === 0
    ) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: true,
          messages: userAggregatedWithPipeline[0].messages,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("error while fetching messages");
    return Response.json(
      {
        success: false,
        message: "error while fetching messages",
      },
      { status: 500 }
    );
  }
}
