import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validate_jwt } from "@sarthakkimtani/libjwt";

export async function middleware(request: NextRequest) {
  try {
    if (request.headers.has("authorization")) {
      const header = request.headers.get("authorization");
      const token = header!.split(" ")[1];

      if (!(await validate_jwt("JWT_SECRET", token))) {
        return NextResponse.json({ success: false, message: "Invalid JWT" }, { status: 401 });
      } else {
        return NextResponse.rewrite(new URL("/api/dashboard", request.url));
      }
    }
    return NextResponse.json({ success: false, message: "Missing Auth Header" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Something went wrong!" }, { status: 500 });
  }
}

export const config = {
  matcher: "/api/dashboard",
};
