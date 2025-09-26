'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (user) {
      fetchProfilePicture();
    }
  }, [user]);

  const fetchProfilePicture = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfilePicture(data.user.profilePicture);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Laden...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {profilePicture && (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500"
                  onClick={() => router.push('/profile')}
                />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Willkommen, {user.name}!
              </span>
              <button
                onClick={() => router.push('/profile')}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Profil
              </button>
              <button
                onClick={logout}
                className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Benutzerprofil
              </h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">E-Mail</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Benutzer ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono">{user.id}</dd>
                </div>
                {user.registriertAm && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Registriert am</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {new Date(user.registriertAm).toLocaleDateString('de-DE')}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <div className="mt-6 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Geschützter Bereich
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dies ist ein geschützter Bereich. Du kannst auf diese Seite nur zugreifen, wenn du angemeldet bist.
                Die Middleware schützt automatisch alle Routen, die mit /dashboard beginnen.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}