import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(req: Request) {
  await dbConnect();

  try {
    const queryParams = {
      username: new URL(req.url).searchParams.get("username"),
    };

    // Check username validations with zod
    const result = usernameQuerySchema.safeParse(queryParams);
    // console.log(result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "invalid query parameters",
        },
        {
          status: 400,
        }
      );
    }

    // Get username
    const { username } = result.data;

    // Check if verified user already exists in database
    const existingVerifiedUser = await User.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    // If everything's okay just return success response
    return Response.json(
      {
        success: true,
        message: "username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error while checking username uniqueness", error);
    return Response.json(
      {
        success: false,
        message: "error while checking username uniqueness",
      },
      {
        status: 500,
      }
    );
  }
}
