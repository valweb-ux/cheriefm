import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FileUpload({ onUpload = () => {}, accept = "*/*", multiple = false }) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Перетягніть файли сюди або клікніть для вибору
          </p>
        </div>
        <Input 
          type="file" 
          accept={accept}
          multiple={multiple}
          className="hidden"
          id="file-upload"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onUpload(Array.from(e.target.files));
            }
          }}
        />
        <label htmlFor="file-upload">
          <Button type="button" variant="outline" className="w-full">
            Вибрати файли
          </Button>
        </label>
      </div>
    </div>
  );
}

export default FileUpload;
