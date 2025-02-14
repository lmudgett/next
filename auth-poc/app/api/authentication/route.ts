import { ApplicationError } from "./../../../domain/classes/ApplicationError";
import { NextResponse } from "next/server";
import { authenticateUser } from "@/domain/use-case/users";
import { logger } from "@/domain/lib/logger";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "email and password are required" },
      { status: 400 }
    );
  }

  try {
    const { success, token } = await authenticateUser(email, password);
    if (success && token) {
      const response = NextResponse.json({
        message: "Authentication successful.",
      });
      response.cookies.set("auth_token", token, {
        httpOnly: true,
        maxAge: 300,
        secure: true,
        path: "/",
      });
      return response;
    }
    throw new Error("Authentication failed");
  } catch (error: ApplicationError) {
    logger.error("unable to authenticate, details: ", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
