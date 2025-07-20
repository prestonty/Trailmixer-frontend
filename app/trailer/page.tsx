"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import OrderList from "@/components/ui/orderlist";
import Loading from "@/components/ui/loading";
import Uploader from "@/components/ui/uploader";
import ClipBlock from "@/components/ui/clipblock";
import { useLayoutEffect } from "react";

import { orderFilesByPosition } from "@/lib/utils";
import axios from "axios";

const options = { multi: true, mimeTypes: ["video/mp4", "video/quicktime"] };

interface vid {
  id: string;
  url: string;
  file: File;
  name: string;
  position: number;
}

interface video {
  name: string;
  start: number;
  end: number;
  timelineStart: number;
  file: File;
}

interface audio {
  name: string;
  start: number;
  end: number;
  timelineStart: number;
  file: File;
}

export default function Trailer() {
  const searchParams = useSearchParams();

  const loadingStates = {
    NOT_STARTED: 0,
    LOADING: 1,
    DONE: 2,
  } as const;
  type LoadingState = (typeof loadingStates)[keyof typeof loadingStates];

  const [uploadLoading, setUploadLoading] = useState<LoadingState>(
    loadingStates.NOT_STARTED
  );
  const [processLoading, setProcessLoading] = useState<LoadingState>(
    loadingStates.NOT_STARTED
  );

  const [previewLoading, setPreviewLoading] = useState<LoadingState>(
    loadingStates.NOT_STARTED
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [uploadLoading, processLoading, previewLoading]);

  const [title, setTitle] = useState("");
  const [vibe, setVibe] = useState("");
  const [videoLength, setVideoLength] = useState(30);
  const [fileType, setFileType] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<vid[]>([]);
  const [jobId, setJobId] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");

  // Cleanup video URL when component unmounts
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // Auto-download video if job_id is in URL params
  useEffect(() => {
    const urlJobId = searchParams.get("job_id");
    if (urlJobId && !jobId && !videoUrl) {
      console.log("Auto-downloading video for job:", urlJobId);
      setJobId(urlJobId);
      setUploadLoading(loadingStates.DONE);
      setProcessLoading(loadingStates.LOADING);

      // Auto-download the video
      const autoDownloadVideo = async () => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/video/download/${urlJobId}`,
            {}, // POST body (empty in this case)
            {
              responseType: "blob",
            }
          );

          const videoUrl = URL.createObjectURL(response.data);
          setVideoUrl(videoUrl);
          setProcessLoading(loadingStates.DONE);

          console.log("Video auto-downloaded successfully");
        } catch (err) {
          console.error("Error auto-downloading video:", err);
          setProcessLoading(loadingStates.NOT_STARTED);
          setUploadLoading(loadingStates.NOT_STARTED);
        }
      };

      autoDownloadVideo();
    }
  }, [searchParams, jobId, videoUrl, loadingStates]);

  // Video Editor
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState(0);

  // Mock Data (delete later)
  const mockVideoFiles: video[] = [
    {
      name: "Video 1",
      start: 0, // clip trimmed start (seconds in video file)
      end: 10, // clip trimmed end (seconds in video file)
      timelineStart: 0, // position on timeline in seconds
      file: new File([], "video1.mp4"),
    },
    // {
    //   name: "Video 2",
    //   start: 0,
    //   end: 15,
    //   timelineStart: 12,
    //   file: new File([], "video2.mp4"),
    // },
  ];

  const mockAudioFiles: audio[] = [
    {
      name: "Audio 1",
      start: 0,
      end: 10,
      timelineStart: 0,
      file: new File([], "audio1.mp3"),
    },
    {
      name: "Audio 2",
      start: 2,
      end: 6,
      timelineStart: 14,
      file: new File([], "audio2.mp3"),
    },
    {
      name: "Audio 3",
      start: 10,
      end: 16,
      timelineStart: 20,
      file: new File([], "audio3.mp3"),
    },
  ];

  const [audioFiles, setAudioFiles] = useState<audio[]>(mockAudioFiles);
  const [videoFiles, setVideoFiles] = useState<video[]>([]);

  function handleClipDragEnd(
    type: "audio" | "video",
    index: number,
    finalX: number
  ) {
    if (type === "audio") {
      setAudioFiles((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          timelineStart: (finalX * videoLength) / parentWidth,
        };
        return updated;
      });
    } else {
      setVideoFiles((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          timelineStart: (finalX * videoLength) / parentWidth,
        };
        return updated;
      });
    }
  }

  function handleClipResize(
    type: "audio" | "video",
    index: number,
    deltaLeftPx: number,
    deltaRightPx: number,
    blockWidthPx: number,
    clipDuration: number
  ) {
    // Convert delta px to time:
    const pxPerSecond = blockWidthPx / clipDuration;

    let deltaStartSec = deltaLeftPx / pxPerSecond;
    let deltaEndSec = deltaRightPx / pxPerSecond;

    // Get original values
    const clips = type === "audio" ? audioFiles : videoFiles;
    const clip = clips[index];
    const minDuration = 0.1; // or whatever your minimum allowed is

    // Calculate new proposed start/end
    let newStart = clip.start + deltaStartSec;
    let newEnd = clip.end + deltaEndSec;

    // Clamp: don't let start go below zero
    if (newStart < 0) {
      deltaStartSec -= newStart; // remove overflow
      newStart = 0;
    }
    // Clamp: don't let duration go below min
    if (newEnd - newStart < minDuration) {
      // Shrinking right
      deltaEndSec += minDuration - (newEnd - newStart);
      newEnd = newStart + minDuration;
    }

    if (type === "audio") {
      setAudioFiles((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...clip,
          start: newStart,
          end: newEnd,
        };
        return updated;
      });
    } else {
      setVideoFiles((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...clip,
          start: newStart,
          end: newEnd,
        };
        return updated;
      });
    }
  }

  useLayoutEffect(() => {
    if (
      uploadLoading === loadingStates.DONE &&
      processLoading === loadingStates.NOT_STARTED &&
      parentRef.current
    ) {
      const rect = parentRef.current.getBoundingClientRect();
      setParentWidth(rect.width);
    }

    const resizeObserver = new ResizeObserver(() => {
      if (parentRef.current) {
        const rect = parentRef.current.getBoundingClientRect();
        setParentWidth(rect.width);
      }
    });

    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const downloadProcessedVideo = async () => {
    if (!jobId) {
      console.error("No job ID available for video download");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/video/download/${jobId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to download video: ${response.statusText}`);
      }

      // Create blob URL from the response
      const blob = await response.blob();
      const videoUrl = URL.createObjectURL(blob);
      setVideoUrl(videoUrl);

      console.log("Video downloaded successfully");
    } catch (err) {
      console.error("Error downloading video:", err);
    }
  };

  const sendUploadedVideos = async () => {
    // sort for each
    const filesToOrder = uploadedFiles.map((item) => ({
      file: item.file,
      position: item.position,
    }));

    const sortedFiles = orderFilesByPosition(filesToOrder);
    const formData = new FormData();
    sortedFiles.forEach((file) => {
      formData.append("video_files", file);
    });

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/video/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("1. Make Upload API call");
      console.log(res.data);

      const { job_id, music_path_files } = res.data;

      // Store job_id for later video download
      setJobId(job_id);

      // Process music_path_files and add to audioFiles
      if (music_path_files) {
        const processedAudioFiles: audio[] = Object.entries(
          music_path_files
        ).map(([filepath, audioData]: [string, any]) => {
          // Extract filename from filepath to use as name
          const filename =
            filepath.split("/").pop() || filepath.split("\\").pop() || filepath;

          return {
            name: filename,
            start: 0, // audio clip always starts at 0
            end: audioData.end || 30, // fallback to 30 seconds if end time not provided
            timelineStart: audioData.start, // Initialize at timeline start, user can drag to reposition
            file: new File([], filepath), // Create a placeholder File object with the filepath as name
          };
        });

        setAudioFiles(processedAudioFiles);
        console.log("Processed audio files:", processedAudioFiles);
      }

      // Automatically fetch and display the processed video
      try {
        console.log("Fetching processed video for job:", job_id);
        const videoResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/video/download/${job_id}`,
          {
            method: "GET",
          }
        );

        if (videoResponse.ok) {
          const blob = await videoResponse.blob();
          const videoUrl = URL.createObjectURL(blob);
          setVideoUrl(videoUrl);
          console.log("Video downloaded and ready for display");
        } else {
          console.warn("Failed to fetch video:", videoResponse.statusText);
        }
      } catch (videoErr) {
        console.error("Error downloading video:", videoErr);
      }

      // Set loading to done after successful API call
      setUploadLoading(loadingStates.DONE);
    } catch (err) {
      console.error("Axios POST error:", err);
      console.log("Error sending POST");
      // Reset loading state on error
      setUploadLoading(loadingStates.NOT_STARTED);
    }
  };

  return (
    <div className="font-sans bg-slate-950 text-white min-h-screen p-8 sm:p-20 grid grid-rows-[auto_1fr_auto] gap-16">
      <header className="text-center">
        {uploadLoading === loadingStates.NOT_STARTED && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold mb-2">Upload your Content</h1>
            <p className="text-xl font-semibold mb-2 text-slate-400">
              We will use this to create your trailer!
            </p>
          </motion.div>
        )}

        {uploadLoading === loadingStates.DONE &&
          processLoading === loadingStates.NOT_STARTED && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h1 className="text-4xl font-bold mb-2">Trailer Editor</h1>
              <p className="text-xl font-semibold mb-2 text-slate-400">
                Move around audio clips and change their lengths!
              </p>
            </motion.div>
          )}

        {uploadLoading === loadingStates.DONE &&
          processLoading === loadingStates.DONE && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h1 className="text-4xl font-bold mb-2">Trailer Downloader</h1>
              <p className="text-xl font-semibold mb-2 text-slate-400">
                Here's the finished product!
              </p>
            </motion.div>
          )}
      </header>

      <main className="flex justify-center items-center h-full w-full">
        {/* Uploader */}
        {uploadLoading === loadingStates.NOT_STARTED && (
          <div className="w-full flex justify-center">
            <Card className="bg-slate-100 border-slate-700 py-10 w-1/2">
              <div className=" flex flex-col justify-between h-fit">
                <CardContent className="flex flex-col justify-center px-8 gap-x-6">
                  <form className="grid grid-cols-2 gap-x-6 gap-y-8">
                    {/* Title */}
                    <div className="flex flex-col gap-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="title"
                        required
                      />
                    </div>

                    {/* Vibe */}
                    <div className="flex flex-col gap-y-2">
                      <Label htmlFor="vibe">Vibe</Label>
                      <Input
                        id="vibe"
                        name="vibe"
                        placeholder="how should the audience feel..."
                        required
                      />
                    </div>

                    {/* Maximum Video Length */}
                    <div className="flex flex-col gap-y-2">
                      <Label htmlFor="videoLength">
                        Maximum Video Length (seconds)
                      </Label>
                      <Input
                        id="videoLength"
                        name="videoLength"
                        type="number"
                        placeholder="30"
                        defaultValue={30}
                        min={10}
                      />
                    </div>

                    {/* File Type */}
                    <div className="flex flex-col gap-y-2 w-full">
                      <Label htmlFor="fileType">File Type</Label>
                      <Select name="fileType" required>
                        <SelectTrigger id="fileType" className="w-full">
                          <SelectValue placeholder="Select file type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="mp4">MP4</SelectItem>
                            <SelectItem value="mov">MOV</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </form>

                  <div className="w-full flex justify-center mt-15 mb-10">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-fit"
                    >
                      <Uploader
                        onComplete={(vids) => {
                          setUploadedFiles(vids);
                          console.log("Saved uploaded file URLs:", vids);
                        }}
                      />
                    </motion.div>
                  </div>

                  <OrderList
                    vids={uploadedFiles}
                    onChange={(updated) => setUploadedFiles(updated)}
                  />

                  <div className="w-full flex justify-end mt-12">
                    <Button
                      className="w-fit p-6 text-lg"
                      onClick={() => {
                        setUploadLoading(loadingStates.LOADING);
                        setUploadLoading(loadingStates.DONE);
                        sendUploadedVideos();
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        )}

        {/* Editor */}
        {uploadLoading === loadingStates.DONE &&
          processLoading === loadingStates.NOT_STARTED &&
          previewLoading === loadingStates.NOT_STARTED && (
            <div className="w-full flex flex-col items-center justify-center">
              <Card className="bg-slate-100 border-slate-700 py-10 w-9/10">
                <div className=" flex flex-col justify-between h-fit">
                  <CardContent className="flex flex-col justify-center px-8 gap-x-6">
                    {/* Repeat this for as many audio clips there are */}

                    <div
                      ref={parentRef}
                      className="relative w-full h-fit bg-green-100"
                    ></div>

                    <div
                      ref={parentRef}
                      className="relative w-full h-fit bg-blue-100"
                    >
                      {parentWidth > 0 &&
                        audioFiles.map((audioItem, index) => {
                          const clipDuration = audioItem.end - audioItem.start; // duration in seconds
                          const blockWidthPx =
                            (clipDuration / videoLength) * parentWidth; // Total pixels of block parent is pixels, videoLength is total timeline length
                          const initialX =
                            (audioItem.timelineStart / videoLength) *
                            parentWidth; // calculate start time in pixels

                          return (
                            <ClipBlock
                              key={index}
                              initialX={initialX}
                              initialWidth={blockWidthPx} // Need to calculate using end - start then convert based on the parent size
                              parentWidth={parentWidth}
                              clipName={audioItem.name}
                              isAudio={true}
                              onDragEnd={(finalX) =>
                                handleClipDragEnd("audio", index, finalX)
                              }
                              onResizeEnd={(deltaLeftPx, deltaRightPx) =>
                                handleClipResize(
                                  "audio",
                                  index,
                                  deltaLeftPx,
                                  deltaRightPx,
                                  blockWidthPx,
                                  clipDuration
                                )
                              }
                              clipStart={audioItem.start}
                              clipDuration={clipDuration}
                              blockWidthPx={blockWidthPx}
                            ></ClipBlock>
                          );
                        })}
                    </div>
                  </CardContent>
                </div>
              </Card>

              <div className="h-fit w-[320px] flex flex-col gap-4 p-10">
                <Button
                  variant="secondary"
                  className="w-full p-6 text-lg rounded-xl bg-slate-700 hover:bg-slate-600 text-white shadow-md"
                  onClick={() => {
                    // setPreviewLoading(loadingStates.LOADING); // actual value
                    setPreviewLoading(loadingStates.DONE); // temporary
                  }}
                >
                  Preview Trailer
                </Button>
                <Button
                  className="w-full p-6 text-lg mt-10"
                  variant="secondary"
                  onClick={() => {
                    setProcessLoading(loadingStates.LOADING); // actual value
                    setProcessLoading(loadingStates.DONE); // temporary
                  }}
                >
                  Finish
                </Button>
              </div>
            </div>
          )}

        {/* Preview Player */}
        {uploadLoading === loadingStates.DONE &&
          previewLoading === loadingStates.DONE && (
            <div className="w-full flex flex-col items-center justify-center">
              <Card className="bg-slate-100 border-slate-700 py-10 w-1/2">
                <div className=" flex flex-col justify-between h-fit">
                  <CardContent className="flex flex-col justify-center px-8 gap-x-6">
                    <div className="flex flex-col gap-y-4">
                      <div className="h-[20rem] w-full flex justify-center">
                        {videoUrl ? (
                          <video
                            src={videoUrl}
                            controls
                            className="w-full h-full rounded-lg"
                            style={{ maxHeight: "20rem" }}
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-600">
                            Loading video...
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
              <div className="h-fit w-[320px] flex flex-col gap-4 p-10">
                <Button
                  variant="secondary"
                  className="w-full p-6 text-lg rounded-xl bg-slate-700 hover:bg-slate-600 text-white shadow-md"
                  onClick={() => {
                    setPreviewLoading(loadingStates.NOT_STARTED);
                  }}
                >
                  Go back to Trailer Editor
                </Button>

                <Button
                  className="w-full p-6 text-lg mt-10"
                  variant="secondary"
                  onClick={() => {
                    setPreviewLoading(loadingStates.NOT_STARTED);
                    setProcessLoading(loadingStates.DONE);
                  }}
                >
                  Finish
                </Button>
              </div>
            </div>
          )}

        {/* Video Downloader */}
        {uploadLoading === loadingStates.DONE &&
          processLoading === loadingStates.DONE && (
            <div className="w-full flex flex-col items-center justify-center">
              <Card className="bg-slate-100 border-slate-700 py-10 w-1/2">
                <div className=" flex flex-col justify-between h-fit">
                  <CardContent className="flex flex-col justify-center px-8 gap-x-6">
                    <div className="flex flex-col gap-y-4">
                      <div className="h-[20rem] w-full flex justify-center">
                        {videoUrl ? (
                          <video
                            src={videoUrl}
                            controls
                            className="w-full h-full rounded-lg"
                            style={{ maxHeight: "20rem" }}
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-600">
                            Loading video...
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
              <div className="h-fit w-fit flex flex-col gap-6 p-10">
                <Button
                  variant="secondary"
                  className="w-full p-6 text-lg text-white bg-blue-500 hover:bg-blue-600"
                  onClick={() => {
                    if (videoUrl && jobId) {
                      const link = document.createElement("a");
                      link.href = videoUrl;
                      link.download = `processed_trailer_${jobId}.mp4`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                  disabled={!videoUrl}
                >
                  Download
                </Button>

                <Button
                  variant="secondary"
                  className="w-fit p-6 text-lg rounded-xl bg-slate-700 hover:bg-slate-600 text-white shadow-md"
                  onClick={() => {
                    setUploadLoading(loadingStates.NOT_STARTED);
                    setProcessLoading(loadingStates.NOT_STARTED);
                  }}
                >
                  Make Another Trailer!
                </Button>
              </div>
            </div>
          )}

        {(uploadLoading === loadingStates.LOADING ||
          processLoading === loadingStates.LOADING ||
          previewLoading === loadingStates.LOADING) && <Loading />}
      </main>

      <footer className="text-center text-slate-600 text-sm">
        © 2025 TrailMixer. All rights reserved.
      </footer>
    </div>
  );
}
