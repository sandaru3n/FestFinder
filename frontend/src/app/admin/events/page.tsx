"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/auth';

interface Event {
  _id: string;
  name: string;
  start_date: string;
  venue: {
    name: string;
  };
  status: string;
}

export default function EventsPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const checkAuth = async () => {
      const authorized = isAdmin();
      setIsAuthorized(authorized);
      if (!authorized) {
        router.push('/login');
      } else {
        // Move fetchEvents here
        setLoading(true);
        setError(null);
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No authentication token found');
          let url = `${backendUrl}/api/admin/events?page=${currentPage}&limit=10`;
          if (search) {
            url += `&search=${encodeURIComponent(search)}`;
          }
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch events');
          }
          const data = await response.json();
          setEvents(data.events);
          setTotal(data.total);
          setPages(data.pages);
          setCurrentPage(data.currentPage);
        } catch (err) {
          console.error('Error fetching events:', err);
          setError(err instanceof Error ? err.message : 'Failed to load events');
        } finally {
          setLoading(false);
        }
      }
    };
    checkAuth();
  }, [router, currentPage, search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleAddEvent = () => {
    // In a real implementation, this would open a form for creating a new event
    alert('Add new event functionality would be implemented here');
  };

  const handleEditEvent = (id: string) => {
    // In a real implementation, this would open a form for editing the event
    alert(`Editing event with ID: ${id}`);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      const response = await fetch(`${backendUrl}/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete event');
      }
      // Refresh the event list
      // fetchEvents(); // This line is removed as fetchEvents is now inside useEffect
    } catch (err) {
      console.error('Error deleting event:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete event');
    }
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Event Management</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <div>
          <input 
            type="text" 
            placeholder="Search events..." 
            className="px-4 py-2 border rounded-md w-64"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          onClick={handleAddEvent}
        >
          Add Event
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                  Loading events...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                  No events found.
                </td>
              </tr>
            ) : (
              events.map((event, index) => (
                <tr key={event._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{((currentPage - 1) * 10) + index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{event.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{event.start_date ? new Date(event.start_date).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{event.venue?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{event.status || 'Active'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      onClick={() => handleEditEvent(event._id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteEvent(event._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, total)} of {total} results</div>
        <div className="flex space-x-1">
          <button 
            className="px-3 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map(page => (
            <button 
              key={page}
              className={`px-3 py-1 border rounded text-sm ${page === currentPage ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button 
            className="px-3 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 