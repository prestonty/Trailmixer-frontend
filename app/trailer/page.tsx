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

// import { Uploader } from "uploader";
// import { UploadButton } from "react-uploader";

import { useState, useEffect, useRef } from "react";
import OrderList from "@/components/ui/orderlist";
import Loading from "@/components/ui/loading";
import Uploader from "@/components/ui/uploader";
import ClipBlock from "@/components/ui/clipblock";

const options = { multi: true, mimeTypes: ["video/mp4"] };

interface vid {
  id: string;
  url: string;
  name: string;
  position: number;
}

export default function Trailer() {
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

  // Video Editor
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState(0);

  useEffect(() => {
    if (parentRef.current) {
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
                    <div className="flex flex-col gap-y-2">
                      <Label htmlFor="fileType">File Type</Label>
                      <Select name="fileType" required>
                        <SelectTrigger id="fileType" className="w-[180px]">
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

                  <div className="w-full flex justify-center my-20">
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
                        setUploadLoading(loadingStates.LOADING); // actual value
                        setUploadLoading(loadingStates.DONE); // temporary
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
                    <div className="relative w-full h-16 flex flex-col gap-y-4">
                      {/* add blocks here in a vertical col format */}
                      <ClipBlock
                        initialX={0}
                        initialWidth={100}
                        parentWidth={parentWidth}
                        clipName="Testing"
                        isAudio={true}
                      />
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
                      <div className="h-[20rem] w-1/2 flex justify-center">
                        Video display here
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
                    setUploadLoading(loadingStates.DONE);
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
                      <div className="h-[20rem] w-1/2 flex justify-center">
                        Video display here
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
              <div className="h-fit w-fit flex flex-col gap-6 p-10">
                <Button
                  variant="secondary"
                  className="w-full p-6 text-lg text-white bg-blue-500 hover:bg-blue-600"
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
