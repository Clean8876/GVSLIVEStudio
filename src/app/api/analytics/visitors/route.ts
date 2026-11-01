import axios from "axios";
import { authenticatedRepository } from "@/lib/firebase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
let cached: { visitors: number; expiresAt: number } | undefined;

export async function GET(request: Request) {
  try {
    if (!(await authenticatedRepository(request))) return Response.json({ message: "Please sign in first." }, { status: 401 });
    const token = process.env.VERCEL_ANALYTICS_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;
    if (!token || !projectId) return Response.json({ message: "Visitor data is unavailable." }, { status: 503 });
    if (cached && cached.expiresAt > Date.now()) return Response.json({ visitors: cached.visitors }, { headers: { "Cache-Control": "no-store" } });
    const params: { projectId: string; teamId?: string } = { projectId };
    if (process.env.VERCEL_TEAM_ID) params.teamId = process.env.VERCEL_TEAM_ID;
    const response = await axios.get<{ data?: { visitors?: unknown } }>("https://api.vercel.com/v1/query/web-analytics/visits/count", {
      params,
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });
    const visitors = response.data.data?.visitors;
    if (typeof visitors !== "number" || !Number.isFinite(visitors) || visitors < 0) throw new Error("Invalid analytics response");
    cached = { visitors, expiresAt: Date.now() + 5 * 60 * 1000 };
    return Response.json({ visitors }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ message: "Visitor data is unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
