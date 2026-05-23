import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") || "general";

    const posts = await Post.find({
      governmentSection: section,
      isReport: false,
    })
      .populate("author", "username profileImage")
      .populate("comments.author", "username profileImage")
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { content, images, videos, files, governmentSection } =
      await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const post = await Post.create({
      author: session.user.id,
      content,
      images: images || [],
      videos: videos || [],
      files: files || [],
      governmentSection: governmentSection || "general",
      isReport: false,
    });

    const populatedPost = await post.populate(
      "author",
      "username profileImage"
    );

    return NextResponse.json(populatedPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
