import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Get username and code from request body
    const { username, code } = await req.json();

    // Find user with given username
    const user = await User.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 400 }
      );
    }

    // Compare code from user and code stored in database
    const isCodeValid = user.verifyCode === code;
    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "code is invalid",
        },
        { status: 400 }
      );
    }

    // Check if code is expired
    const isCodeExpired = user.verifyCodeExpiry < new Date();
    if (isCodeExpired) {
      return Response.json(
        {
          success: false,
          message: "code is expired, signup again to get new code",
        },
        { status: 400 }
      );
    }

    // If everything's okay, make user verified
    user.isVerified = true;
    await user.save();
    return Response.json(
      {
        success: true,
        message: "user verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error while verifying user");
    return Response.json(
      {
        success: false,
        message: "error while verifying user",
      },
      { status: 500 }
    );
  }
}
