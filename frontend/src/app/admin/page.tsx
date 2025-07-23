"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/auth';

interface DashboardStats {
  users: {
    count: number;
    growth: number;
  };
  events: {
    count: number;
    growth: number;
  };
  revenue: {
    amount: number;
    growth: number;
  };
}

interface Activity {
  type: string;
  email: string;
  timestamp: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authorized = isAdmin();
      setIsAuthorized(authorized);
      if (!authorized) {
        router.push('/login');
      } else {
        fetchDashboardData();
      }
    };
    checkAuth();
  }, [router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      // Fetch statistics
      const statsResponse = await fetch(`${backendUrl}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!statsResponse.ok) {
        const errorData = await statsResponse.json();
        throw new Error(errorData.error || 'Failed to fetch statistics');
      }
      const statsData = await statsResponse.json();
      setStats(statsData);
      
      // Fetch recent activity
      const activityResponse = await fetch(`${backendUrl}/api/admin/recent-activity`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!activityResponse.ok) {
        const errorData = await activityResponse.json();
        throw new Error(errorData.error || 'Failed to fetch recent activity');
      }
      const activityData = await activityResponse.json();
      setActivities(activityData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    }
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    return date.toLocaleDateString();
  };

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-gray-100 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800">Loading...</h1>
          <p className="mt-4 text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-100 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-800">Access Denied</h1>
          <p className="mt-4 text-red-600">You are not authorized to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Cards */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">Users</h2>
            {loading || !stats ? (
              <p className="mt-2 text-3xl font-bold text-gray-400">Loading...</p>
            ) : (
              <>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.users.count.toLocaleString()}</p>
                <p className="mt-1 text-sm ${stats.users.growth >= 0 ? 'text-green-600' : 'text-red-600'}">
                  {stats.users.growth >= 0 ? '+' : ''}{stats.users.growth}% from last month
                </p>
              </>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">Events</h2>
            {loading || !stats ? (
              <p className="mt-2 text-3xl font-bold text-gray-400">Loading...</p>
            ) : (
              <>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.events.count.toLocaleString()}</p>
                <p className="mt-1 text-sm ${stats.events.growth >= 0 ? 'text-green-600' : 'text-red-600'}">
                  {stats.events.growth >= 0 ? '+' : ''}{stats.events.growth}% from last month
                </p>
              </>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800">Revenue</h2>
            {loading || !stats ? (
              <p className="mt-2 text-3xl font-bold text-gray-400">Loading...</p>
            ) : (
              <>
                <p className="mt-2 text-3xl font-bold text-gray-900">${stats.revenue.amount.toLocaleString()}</p>
                <p className="mt-1 text-sm ${stats.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}">
                  {stats.revenue.growth >= 0 ? '+' : ''}{stats.revenue.growth}% from last month
                </p>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            {loading || activities.length === 0 ? (
              <p className="text-gray-500">Loading activities...</p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-sm text-gray-600">User registered</p>
                    <p className="font-medium">{activity.email}</p>
                    <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button 
                onClick={() => router.push('/admin/events')}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Add New Event
              </button>
              <button 
                onClick={() => router.push('/admin/users')}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Manage Users
              </button>
              <button 
                onClick={() => router.push('/admin/reports')}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
              >
                View Reports
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 