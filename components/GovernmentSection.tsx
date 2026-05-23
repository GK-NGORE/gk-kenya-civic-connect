'use client';

import { useEffect, useState } from 'react';
import { FiHeart, FiMessageCircle, FiMoreVertical } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';

interface Report {
  _id: string;
  author: { _id: string; username: string; profileImage?: string };
  title: string;
  description: string;
  images?: string[];
  videos?: string[];
  attachments?: Array<{ url: string; filename: string }>;
  likes: string[];
  comments: any[];
  status: string;
  createdAt: string;
}

interface GovernmentSectionProps {
  section: string;
}

export default function GovernmentSection({ section }: GovernmentSectionProps) {
  const { data: session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchReports();
  }, [section]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reports?section=${section}`);
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (reportId: string) => {
    const text = commentText[reportId];
    if (!text?.trim()) return;

    try {
      const response = await fetch(`/api/reports/${reportId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        setCommentText({ ...commentText, [reportId]: '' });
        fetchReports();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>No reports yet. Be the first to report an issue!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {reports.map((report) => (
        <div
          key={report._id}
          className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
        >
          {/* Report Header */}
          <div className="p-3 sm:p-4 border-b bg-white">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                  {report.author.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {report.author.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(report.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <span
                className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                  report.status === 'submitted'
                    ? 'bg-yellow-100 text-yellow-800'
                    : report.status === 'reviewing'
                    ? 'bg-blue-100 text-blue-800'
                    : report.status === 'resolved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {report.status}
              </span>
            </div>
          </div>

          {/* Report Content */}
          <div className="p-3 sm:p-4 bg-white">
            <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base break-words">
              {report.title}
            </h3>
            <p className="text-gray-700 text-sm mb-3 break-words">
              {report.description}
            </p>

            {/* Media */}
            {report.images && report.images.length > 0 && (
              <div className="mb-3 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {report.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt="Report media"
                    className="rounded w-full h-24 sm:h-32 object-cover"
                  />
                ))}
              </div>
            )}

            {report.attachments && report.attachments.length > 0 && (
              <div className="mb-3 space-y-2">
                <p className="text-xs sm:text-sm font-semibold text-gray-700">
                  Attachments:
                </p>
                {report.attachments.map((file, idx) => (
                  <a
                    key={idx}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs sm:text-sm text-secondary hover:underline truncate"
                  >
                    📎 {file.filename}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-3 sm:px-4 py-3 bg-gray-50 border-t border-gray-200 flex gap-4 sm:gap-6 text-gray-600 text-xs sm:text-sm">
            <button className="flex items-center gap-1 hover:text-secondary transition">
              <FiHeart size={16} />
              <span>{report.likes.length}</span>
            </button>
            <button className="flex items-center gap-1 hover:text-secondary transition">
              <FiMessageCircle size={16} />
              <span>{report.comments.length}</span>
            </button>
          </div>

          {/* Comments Section */}
          {report.comments.length > 0 && (
            <div className="px-3 sm:px-4 py-3 space-y-2 border-t">
              {report.comments.map((comment, idx) => (
                <div key={idx} className="flex gap-2 text-xs sm:text-sm">
                  <span className="font-semibold text-gray-900 flex-shrink-0">
                    {comment.author.username}:
                  </span>
                  <span className="text-gray-700 break-words">
                    {comment.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          {session && (
            <div className="p-3 sm:p-4 bg-white border-t flex gap-2 sm:gap-3">
              <input
                type="text"
                value={commentText[report._id] || ''}
                onChange={(e) =>
                  setCommentText({ ...commentText, [report._id]: e.target.value })
                }
                placeholder="Add a comment..."
                className="flex-1 border border-gray-300 rounded px-2 sm:px-3 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-secondary outline-none"
              />
              <button
                onClick={() => handleAddComment(report._id)}
                className="bg-secondary text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm font-semibold hover:bg-green-600 transition"
              >
                Post
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
