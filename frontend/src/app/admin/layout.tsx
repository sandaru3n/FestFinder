"use client";

import React from 'react';
import Link from 'next/link';
import { logout } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation - Only Admin Nav, no site header */}
      <nav className="bg-indigo-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-bold">
                Admin Panel
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/users" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                Users
              </Link>
              <Link href="/admin/events" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                Events
              </Link>
              <Link href="/admin/reports" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                Reports
              </Link>
              <button 
                onClick={() => logout()}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 