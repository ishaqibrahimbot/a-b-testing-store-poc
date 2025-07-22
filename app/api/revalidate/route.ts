import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { tags, paths, secret } = await request.json();

    // Verify the secret to prevent unauthorized revalidation
    const revalidationSecret =
      process.env.REVALIDATION_SECRET || "your-secret-key";

    if (secret !== revalidationSecret) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const revalidatedTags: string[] = [];
    const revalidatedPaths: string[] = [];

    // Revalidate specific cache tags
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag);
        revalidatedTags.push(tag);
      }
    }

    // Revalidate specific paths
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path);
        revalidatedPaths.push(path);
      }
    }

    return NextResponse.json({
      success: true,
      revalidatedTags,
      revalidatedPaths,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}

// GET endpoint for manual testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const path = searchParams.get("path");
  const secret = searchParams.get("secret");

  const revalidationSecret =
    process.env.REVALIDATION_SECRET || "your-secret-key";

  if (secret !== revalidationSecret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  if (tag) {
    revalidateTag(tag);
    return NextResponse.json({
      success: true,
      revalidatedTag: tag,
      timestamp: new Date().toISOString(),
    });
  }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({
      success: true,
      revalidatedPath: path,
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json(
    {
      error: "Please provide either a tag or path parameter",
    },
    { status: 400 }
  );
}
