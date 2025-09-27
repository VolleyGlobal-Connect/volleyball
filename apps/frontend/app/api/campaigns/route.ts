import { db } from "@volleyball/db";
import { NextResponse } from "next/server";

export const runtime = "edge"; // Specify edge runtime for Vercel

export async function GET() {
  try {
    const allCampaigns = await db.query.campaigns.findMany({
      orderBy: (campaigns, { desc }) => [desc(campaigns.createdAt)],
    });
    return NextResponse.json(allCampaigns);
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}