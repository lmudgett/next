import { NextRequest, NextResponse } from "next/server";
import { SESSION_TIME } from "@/domain/lib/constants";

export const config = {
  matcher: "/protected",
};

export function middleware(req: NextRequest) {
  const auth_token = req.cookies.get("auth_token");

  try {
    if (!auth_token) {
      console.log("session expired");
      throw new Error("token is empty");
    }
    const res = NextResponse.next();
    res.cookies.set("auth_token", auth_token.value, {
      httpOnly: true,
      maxAge: SESSION_TIME,
      secure: true,
      path: "/",
    });
    console.log("session refreshed");
    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/access_denied", req.url));
  }
}
