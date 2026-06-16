import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("Missing url", { status: 400 });

  try {
    const resp = await fetch(url);
    if (!resp.ok) return new NextResponse("Failed to fetch image", { status: 502 });

    const buf = await resp.arrayBuffer();
    const contentType = resp.headers.get("Content-Type") ?? "image/png";

    return new NextResponse(buf, {
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
