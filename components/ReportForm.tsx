'use client';

import { useState } from 'react';
import { FiImage, FiVideo, FiFileText, FiSend } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

interface ReportFormProps {
  governmentSection: string;
  onSubmit: () => void;
}

export default function ReportForm({
  governmentSection,
  onSubmit,
}: ReportFormProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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

    if (!title.trim() || !description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      let uploaded = [];
      if (selectedFiles && selectedFiles.length > 0) {
        uploaded = await uploadFiles(selectedFiles);
      }

      const images = uploaded.filter((f: any) => f.mimetype.startsWith('image/')).map((f: any) => f.url);
      const videos = uploaded.filter((f: any) => f.mimetype.startsWith('video/')).map((f: any) => f.url);
      const attachments = uploaded.filter((f: any) => !f.mimetype.startsWith('image/') && !f.mimetype.startsWith('video/'));

      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          governmentSection,
          title,
          description,
          images,
          videos,
          attachments,
        }),
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        setSelectedFiles(null);
        onSubmit();
        window.location.reload();
      }
    } catch (error) {
      console.error('Error creating report:', error);
      alert('Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Report Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief title of your report"
          className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 focus:ring-2 focus:ring-secondary outline-none text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide detailed information about your concern"
          className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 resize-none focus:ring-2 focus:ring-secondary outline-none text-sm"
          rows={4}
          required
        />
      </div>

      {/* File input */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-gray-600 hover:text-secondary transition px-3 sm:px-4 py-2 rounded hover:bg-gray-100 text-xs sm:text-sm border border-gray-300 cursor-pointer">
          <FiFileText size={18} />
          <span>Attach files</span>
          <input type="file" multiple onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-secondary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold"
      >
        <FiSend size={18} />
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
}
