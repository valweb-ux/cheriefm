import React from 'react';
import { GenreForm } from '@/components/admin/music/genre-form';

export default function NewGenrePage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Створення нового жанру</h1>
      <GenreForm />
    </div>
  );
}
