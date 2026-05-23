import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Report from "@/models/Report";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    const query = section ? { governmentSection: section } : {};

    const reports = await Report.find(query)
      .populate("author", "username profileImage")
      .populate("comments.author", "username profileImage")
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
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

    const {
      governmentSection,
      title,
      description,
      images,
      videos,
      attachments,
    } = await request.json();

    if (!governmentSection || !title || !description) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const report = await Report.create({
      author: session.user.id,
      governmentSection,
      title,
      description,
      images: images || [],
      videos: videos || [],
      attachments: attachments || [],
      status: "submitted",
    });

    const populatedReport = await report.populate(
      "author",
      "username profileImage"
    );

    return NextResponse.json(populatedReport, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
