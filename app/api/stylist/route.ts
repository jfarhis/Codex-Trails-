import { NextResponse } from "next/server";

const demoReply = { message: "I’d build this around a strong neutral base, then add one texture-rich piece. These three all fit your recent saves and work together.", productIds: ["p1", "p2", "p5"] };

export async function POST(request: Request) {
  const { message } = await request.json();
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json(demoReply);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-latest",
        max_tokens: 300,
        system: "You are HAUL's concise, fashion-savvy stylist. User Style DNA: minimal, sporty, 90s, neutral palette. Recommend only product IDs p1-p5. Return strict JSON with keys message and productIds (max 3).",
        messages: [{ role: "user", content: String(message) }]
      })
    });
    if (!response.ok) throw new Error("Anthropic request failed");
    const data = await response.json();
    const raw = data.content?.[0]?.text ?? "";
    return NextResponse.json(JSON.parse(raw.replace(/```json|```/g, "").trim()));
  } catch {
    return NextResponse.json(demoReply);
  }
}
