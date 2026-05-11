import { NextRequest, NextResponse } from "next/server";

const resolveBackendBaseUrl = () => {
  const explicitBase =
    process.env.BACKEND_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  if (explicitBase) return explicitBase.replace(/\/+$/, "");
  const uploadUrl = process.env.BACKEND_UPLOAD_URL;
  if (uploadUrl) {
    try { return new URL(uploadUrl).origin; } catch { return null; }
  }
  return null;
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sid: string }> }
) {
  const { sid } = await params;
  if (!sid) return new Response("Recording SID required", { status: 400 });

  const backendBase = resolveBackendBaseUrl();
  if (!backendBase) return new Response("Backend URL not configured", { status: 500 });

  try {
    const response = await fetch(`${backendBase}/api/recordings/${sid}/audio`, {
      cache: "no-store",
    });
    if (!response.ok) return new Response(null, { status: response.status });

    return new Response(response.body, {
      headers: {
        "Content-Type":  "audio/mpeg",
        "Accept-Ranges": "bytes",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch audio.";
    return new Response(message, { status: 502 });
  }
}
