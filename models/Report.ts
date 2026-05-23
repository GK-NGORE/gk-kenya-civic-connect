import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    governmentSection: {
      type: String,
      enum: [
        "presidency",
        "cabinet",
        "parliament",
        "senate",
        "courts",
        "tribunals",
        "county-governments",
        "county-assemblies",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [String],
    videos: [String],
    attachments: [
      {
        url: String,
        filename: String,
        mimetype: String,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["submitted", "reviewing", "resolved", "rejected"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Report || mongoose.model("Report", reportSchema);
