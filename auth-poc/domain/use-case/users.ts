import * as userDao from "@/domain/data-access/user";
import { encryptPasswordforStorage } from "@/domain/lib/utils";
import { ENCRYPTION_KEY, SESSION_TIME } from "@/domain/lib/constants";
import Redis from "ioredis";
import { SignJWT } from "jose";

const redis = new Redis();

export async function authenticateUser(
  email: string,
  pw: string
): Promise<{
  success: boolean;
  token?: string;
}> {
  try {
    //see if the user exists
    const existingUser = await userDao.getUser(email);
    if (!existingUser) {
      console.error("User not found");
      return { success: false };
    }

    //encrypt the submitted password to compare whats in the database
    const encryptedPassword = encryptPasswordforStorage(pw);

    if (encryptedPassword === existingUser.pw) {
      const token = await new SignJWT({ email, role: existingUser.role })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("5m")
        .sign(new TextEncoder().encode(ENCRYPTION_KEY));
      console.log("token", token);
      await redis.set(
        `session:${token}`,
        JSON.stringify({ email, role: existingUser.role }),
        "EX",
        SESSION_TIME
      );
      await redis.del("loginAttempts");
      return { success: true, token: token };
    } else {
      const loginAttempts = await redis.get("loginAttempts");
      console.error("login attempts ", loginAttempts);
      if (Number(loginAttempts) > 5) {
        console.error("User locked out");
        //lock the user out after 5 failed attempts
        existingUser.isLocked = true;
        await userDao.updateUser(existingUser);
      }
      await redis.incr("loginAttempts");
      console.error("wrong password");
      return { success: false };
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    return { success: false };
  }
}

export async function addUser(
  fname: string,
  lname: string,
  email: string,
  pw: string
): Promise<void> {
  //check to see if the user exists already
  const existingUser = await userDao.getUser(email);
  if (existingUser) {
    throw new Error("user already exists");
  }

  //encrypt the password
  const encryptedPassword = encryptPasswordforStorage(pw);

  //add the user to the db
  await userDao.addUser({
    fname: fname,
    lname: lname,
    email: email,
    pw: encryptedPassword,
    isLocked: false,
  });
}
