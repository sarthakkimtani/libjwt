import { encode_jwt } from "@sarthakkimtani/libjwt";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.email || !body.password) {
      return Response.json({ success: false, message: "Invalid Request Body" }, { status: 400 });
    }
    const userId = crypto.randomBytes(16).toString("hex");
    const jwt = await encode_jwt("JWT_SECRET", { id: userId });
    return Response.json({ success: true, token: jwt });
  } catch (err) {
    return Response.json({ success: false, message: "Something went wrong!" }, { status: 500 });
  }
}
