import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

// Import types Message
import { Message } from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();

  const { username, content } = await req.json();

  try {
    // Get recipient from database
    const recipient = await User.findOne({ username });

    // Check if recipient exists
    if (!recipient) {
      return Response.json(
        {
          success: false,
          message: "recipient not found",
        },
        { status: 404 }
      );
    }

    // Check if recipient is accepting messages
    if (!recipient.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "recipient is not accepting messages",
        },
        { status: 403 }
      );
    }

    // Draft message
    const newMessage = { content, createdAt: new Date() };

    // Push message to recipient's messages array
    recipient.messages.push(newMessage as Message);
    await recipient.save();

    return Response.json(
      {
        success: true,
        message: "message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("error while sending message", error);
    return Response.json(
      {
        success: false,
        message: "error while sending message",
      },
      { status: 500 }
    );
  }
}
