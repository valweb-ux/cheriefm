import React from 'react';
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";

export default function MediaUpload({ onUpload = () => {} }) {
  return (
    <div className="space-y-4">
      <FileUpload 
        onUpload={onUpload}
        accept="image/*,audio/*,video/*"
        multiple={true}
      />
      <div className="flex justify-end">
        <Button type="button" variant="outline">
          Скасувати
        </Button>
      </div>
    </div>
  );
}
