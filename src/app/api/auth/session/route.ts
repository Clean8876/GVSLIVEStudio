import { NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/lib/firebase/session-server";

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host") ?? new URL(request.url).host;
  const protocol = request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "");
  return origin === `${protocol}://${host}`;
}

export async function POST(request: Request) {
  try {
  if (!isSameOrigin(request)) return NextResponse.json({ message: "This request must come from this website." }, { status: 403 });
  const token = /^Bearer (.+)$/.exec(request.headers.get("authorization") ?? "")?.[1];
  const session = await verifyFirebaseToken(token);
  if (!session || !token) return NextResponse.json({ message: "Please sign in again." }, { status: 401 });
  const tokenInfo = await session.user.getIdTokenResult();
  const response = NextResponse.json({ signedIn: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set("gvs_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(tokenInfo.expirationTime),
  });
  return response;
  } catch (error) { return NextResponse.json({ message: "Unable to start your session. Please try again." }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ message: "This request must come from this website." }, { status: 403 });
  const response = NextResponse.json({ signedIn: false }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set("gvs_session", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
