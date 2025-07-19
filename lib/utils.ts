import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface VideoItem {
  file: File; // or more specific type like File, UploadFile, etc.
  position: number;
}

export function orderFilesByPosition(videoItems: VideoItem[]): File[] {
  /**
   * Helper function to order files by their position field.
   *
   * @param videoItems - Array of objects with 'file' and 'position' properties
   * @returns Array of files only, ordered by their position (ascending)
   * @throws Error if positions are missing, duplicate, or negative
   */

  if (!videoItems || videoItems.length === 0) {
    return [];
  }

  // Validate input structure
  for (const item of videoItems) {
    if (!("file" in item)) {
      throw new Error("Each item must have a 'file' property");
    }
    if (!("position" in item)) {
      throw new Error("Each item must have a 'position' property");
    }
    if (typeof item.position !== "number") {
      throw new Error("Position must be a number");
    }
    if (item.position < 0) {
      throw new Error("Position must be non-negative");
    }
  }

  // Check for duplicate positions
  const positions = videoItems.map((item) => item.position);
  const uniquePositions = new Set(positions);
  if (positions.length !== uniquePositions.size) {
    throw new Error("Duplicate positions are not allowed");
  }

  // Sort by position and extract ONLY the files
  const sortedItems = videoItems.sort((a, b) => a.position - b.position);
  return sortedItems.map((item) => item.file);
}
