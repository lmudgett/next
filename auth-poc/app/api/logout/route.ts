import { NextResponse, NextRequest } from "next/server";
import Redis from "ioredis";

const redis = new Redis();

export async function POST(req: NextRequest) {
  const auth_token = req.cookies.get("auth_token");
  const res = NextResponse.json({
    message: "logout successful.",
  });
  if (auth_token) {
    await redis.del(`session:${auth_token}`);

    res.cookies.set("auth_token", "", {
      httpOnly: true,
      maxAge: -1,
      secure: true,
      path: "/",
    });
  }
  return res;
}
