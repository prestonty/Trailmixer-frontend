"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface Vid {
  id: string;
  url: string;
  file: File;
  name: string;
  position: number;
}

interface UploadButtonProps {
  onComplete: (vids: Vid[]) => void;
}

export default function Uploader({ onComplete }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const vids: Vid[] = Array.from(files).map((file, index) => ({
        id: index.toString(),
        url: URL.createObjectURL(file), // For preview
        file: file,
        name: file.name || `clip_${index}`,
        position: index,
      }));
      onComplete(vids);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        className="p-6 text-xl"
        onClick={() => fileInputRef.current?.click()}
      >
        Upload a file...
      </Button>
    </>
  );
}
