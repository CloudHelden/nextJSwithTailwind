'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profilePicture: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      fetchProfile();
    }
  }, [user, loading]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfileData({
          name: data.user.name || '',
          email: data.user.email || '',
          profilePicture: data.user.profilePicture || null
        });
        if (data.user.profilePicture) {
          setPreviewImage(data.user.profilePicture);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage('Bild ist zu groß. Maximal 5MB erlaubt.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setProfileData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          profilePicture: profileData.profilePicture
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profil erfolgreich aktualisiert!');
        setIsEditing(false);
        // Update the preview with saved data
        if (data.user.profilePicture) {
          setPreviewImage(data.user.profilePicture);
        }
      } else {
        setMessage(data.error || 'Fehler beim Aktualisieren des Profils');
      }
    } catch (error) {
      setMessage('Netzwerkfehler');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage('');
    // Reset to original data
    fetchProfile();
  };

  const removeImage = () => {
    setPreviewImage(null);
    setProfileData(prev => ({
      ...prev,
      profilePicture: null
    }));
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Mein Profil
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                {isEditing && (
                  <button
                    onClick={removeImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    title="Bild entfernen"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {isEditing && (
                <div>
                  <label className="block">
                    <span className="sr-only">Profilbild auswählen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        dark:file:bg-blue-900 dark:file:text-blue-200
                        dark:hover:file:bg-blue-800"
                    />
                  </label>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF bis zu 5MB
                  </p>
                </div>
              )}
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 dark:text-white">{profileData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  E-Mail
                </label>
                <p className="mt-1 text-gray-900 dark:text-white">{profileData.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  E-Mail kann nicht geändert werden
                </p>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-md ${
                message.includes('erfolgreich')
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400'
              }`}>
                {message}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Profil bearbeiten
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Speichern...' : 'Speichern'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Navigation back to dashboard */}
        <div className="mt-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Zurück zum Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}