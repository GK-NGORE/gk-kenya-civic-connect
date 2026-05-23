'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PostsList from '@/components/PostsList';
import CreatePostForm from '@/components/CreatePostForm';

export default function PostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main feed */}
          <div className="lg:col-span-2 space-y-4">
            <CreatePostForm />
            <PostsList section="general" />
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 sticky top-20">
              <h3 className="text-lg font-semibold text-primary mb-4">
                Quick Access
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Navigate to the Government Sections page to report issues with specific government bodies.
              </p>
              <a
                href="/government"
                className="block w-full bg-secondary text-white text-center font-semibold py-2 rounded-lg hover:bg-green-600 transition text-sm"
              >
                Go to Government
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
