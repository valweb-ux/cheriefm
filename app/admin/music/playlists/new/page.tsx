import React from 'react';
import { PlaylistForm } from '@/components/admin/music/playlist-form';

export default function NewPlaylistPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Створення нового плейлиста</h1>
      <PlaylistForm />
    </div>
  );
}
