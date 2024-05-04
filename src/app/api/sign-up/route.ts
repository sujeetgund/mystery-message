import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerification } from "@/helpers/sendVerification";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Get data from request
    const { username, email, password } = await req.json();
    console.log(username, email, password);

    // Check if user with similar username exists and verified
    const exisitingUserVerifiedByUsername = await User.findOne({
      username,
      isVerified: true,
    });

    if (exisitingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "username is already registered",
        },
        {
          status: 400,
        }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create verify code expiry date
    const verifyCodeExpiry = new Date();
    verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

    // Check if user with similar email exists and verified
    const exisitingUserVerifiedByEmail = await User.findOne({ email });

    if (exisitingUserVerifiedByEmail) {
      if (exisitingUserVerifiedByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "email is already registered",
          },
          {
            status: 400,
          }
        );
      } else {
        exisitingUserVerifiedByEmail.password = hashedPassword;
        exisitingUserVerifiedByEmail.verifyCode = verifyCode;
        exisitingUserVerifiedByEmail.verifyCodeExpiry = verifyCodeExpiry;
        await exisitingUserVerifiedByEmail.save();
      }
    } else {
      // Register new user
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
    }

    // Send verification email
    const emailResponse = await sendVerification(email, username, verifyCode);
    console.log(emailResponse);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "user registered successfully. verify your email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error registering user", error);
    return Response.json(
      {
        success: false,
        message: "error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
