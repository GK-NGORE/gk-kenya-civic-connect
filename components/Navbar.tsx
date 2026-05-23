'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="w-full px-2 sm:px-4">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/posts" className="font-bold text-lg sm:text-xl text-primary">
            <span className="text-secondary">Kenya</span> Civic
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4 sm:gap-6">
            <Link
              href="/posts"
              className="text-gray-700 hover:text-secondary transition font-medium text-sm sm:text-base"
            >
              Posts
            </Link>
            <Link
              href="/government"
              className="text-gray-700 hover:text-secondary transition font-medium text-sm sm:text-base"
            >
              Government
            </Link>
            <span className="text-gray-600 text-xs sm:text-sm">
              {session?.user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-secondary text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2 text-xs sm:text-sm font-semibold"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-primary"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t bg-gray-50 py-3 space-y-2">
            <Link
              href="/posts"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
            >
              Posts
            </Link>
            <Link
              href="/government"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
            >
              Government
            </Link>
            <div className="px-4 py-2 text-gray-700 text-sm">
              {session?.user?.name}
            </div>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 bg-secondary text-white rounded hover:bg-green-600 transition flex items-center gap-2 text-sm font-semibold"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
