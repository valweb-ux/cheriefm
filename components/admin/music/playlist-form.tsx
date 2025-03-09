import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Імпортуємо нашу спрощену версію TrackSelector
import TrackSelector from './track-selector';

export default function PlaylistForm({ initialData = {}, onSubmit = () => {} }) {
  const [formData, setFormData] = React.useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    tracks: initialData?.tracks || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Назва плейлиста</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Опис</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Треки</CardTitle>
          </CardHeader>
          <CardContent>
            <TrackSelector
              selectedTracks={formData.tracks}
              onTracksChange={(tracks) => setFormData(prev => ({ ...prev, tracks }))}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Скасувати
        </Button>
        <Button type="submit">
          {initialData?.id ? 'Оновити плейлист' : 'Створити плейлист'}
        </Button>
      </div>
    </form>
  );
}
