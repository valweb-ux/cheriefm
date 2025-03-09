import React from 'react';
import { PlaylistForm } from '@/components/admin/music/playlist-form';

export default function EditPlaylistPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Редагування плейлиста</h1>
      <PlaylistForm />
    </div>
  );
}
