'use client';

import { useState } from 'react';
import { FiHeart, FiMessageCircle, FiShare2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { useSession } from 'next-auth/react';

interface PostCardProps {
  post: {
    _id: string;
    author: { _id: string; username: string; profileImage?: string };
    content: string;
    images?: string[];
    videos?: string[];
    likes: string[];
    comments: any[];
    createdAt: string;
  };
  onLike: () => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(
    post.likes.includes(session?.user?.id || '')
  );
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
      });
      const data = await response.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
      onLike();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-3 sm:p-6">
      {/* Author */}
      <div className="flex items-center gap-3 mb-3 sm:mb-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
          {post.author.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm sm:text-base">
            {post.author.username}
          </p>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base break-words">
        {post.content}
      </p>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="mb-3 sm:mb-4 grid grid-cols-2 gap-2 sm:gap-3">
          {post.images.map((image, idx) => (
            <img
              key={idx}
              src={image}
              alt="Post"
              className="rounded-lg w-full h-auto object-cover max-h-64"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 sm:gap-6 pt-3 sm:pt-4 border-t text-gray-600 text-xs sm:text-sm">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 sm:gap-2 hover:text-secondary transition ${
            liked ? 'text-secondary' : ''
          }`}
        >
          <FiHeart size={18} fill={liked ? 'currentColor' : 'none'} />
          <span>{likeCount}</span>
        </button>
        <button className="flex items-center gap-1 sm:gap-2 hover:text-secondary transition">
          <FiMessageCircle size={18} />
          <span>{post.comments.length}</span>
        </button>
        <button className="flex items-center gap-1 sm:gap-2 hover:text-secondary transition">
          <FiShare2 size={18} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
