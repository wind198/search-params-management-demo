import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiUrl = new URL("https://api.api-ninjas.com/v1/randomimage");
    // Fetch random image from API Ninjas
    const response = await fetch(apiUrl.toString(), {
      next: {
        revalidate: 60,
      },
      headers: {
        "X-Api-Key": process.env.IMAGE_API_KEY!,
        Accept: "image/jpg",
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error fetching random image:", error);
    return new NextResponse("Error generating placeholder", { status: 500 });
  }
}
