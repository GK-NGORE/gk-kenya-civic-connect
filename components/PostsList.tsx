'use client';

import { useEffect, useState } from 'react';
import PostCard from './PostCard';

interface Post {
  _id: string;
  author: { _id: string; username: string; profileImage?: string };
  content: string;
  images?: string[];
  videos?: string[];
  likes: string[];
  comments: any[];
  createdAt: string;
  governmentSection: string;
}

export default function PostsList({ section }: { section: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [section]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/posts?section=${section}`,
        { next: { revalidate: 10 } }
      );
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
        No posts yet. Be the first to share your thoughts!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onLike={() => fetchPosts()} />
      ))}
    </div>
  );
}
