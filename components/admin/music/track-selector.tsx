import React from 'react';

// Простий компонент-заглушка без зовнішніх залежностей
export default function TrackSelector({ selectedTracks = [], onTracksChange = () => {} }) {
  return (
    <div className="p-4 border rounded-md bg-muted">
      <h3 className="font-medium mb-2">Вибір треків</h3>
      <p className="text-sm text-muted-foreground">
        Компонент вибору треків тимчасово недоступний.
      </p>
    </div>
  );
}
