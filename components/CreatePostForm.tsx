'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiImage, FiVideo, FiFileText, FiSend } from 'react-icons/fi';

export default function CreatePostForm() {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const uploadFiles = async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('files', f));
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.files; // [{url, filename, mimetype}]
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    setLoading(true);

    try {
      let uploaded = [];
      if (selectedFiles && selectedFiles.length > 0) {
        uploaded = await uploadFiles(selectedFiles);
      }

      // classify
      const images = uploaded.filter((f: any) => f.mimetype.startsWith('image/')).map((f: any) => f.url);
      const videos = uploaded.filter((f: any) => f.mimetype.startsWith('video/')).map((f: any) => f.url);
      const files = uploaded.filter((f: any) => !f.mimetype.startsWith('image/') && !f.mimetype.startsWith('video/'));

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          images,
          videos,
          files,
          governmentSection: 'general',
        }),
      });

      if (response.ok) {
        setContent('');
        setSelectedFiles(null);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 sm:p-6">
      <div className="flex gap-3 sm:gap-4 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
          {session?.user?.name?.charAt(0).toUpperCase()}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="flex-1 border border-gray-300 rounded-lg p-3 resize-none focus:ring-2 focus:ring-secondary outline-none text-sm sm:text-base"
          rows={3}
        />
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-gray-600 hover:text-secondary transition px-2 sm:px-3 py-1 sm:py-2 rounded hover:bg-gray-100 text-xs sm:text-sm cursor-pointer">
            <FiImage size={18} />
            <span>Attach</span>
            <input type="file" multiple onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!content.trim() || loading}
          className="bg-secondary text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50 flex items-center gap-2 text-xs sm:text-sm font-semibold"
        >
          <FiSend size={16} />
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
}
