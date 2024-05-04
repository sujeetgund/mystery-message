import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerification(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Mystery Message | Verify Account",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      success: true,
      message: "verification email sent successfully",
    };
  } catch (error) {
    console.log("error whiles ending verification email", error);
    return {
      success: false,
      message: "error while sending verification email",
    };
  }
}
