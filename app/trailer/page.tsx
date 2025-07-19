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

import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";

import { useState, useEffect } from "react";
import Loading from "@/components/ui/loading";

const uploader = Uploader({
  apiKey: "free", // Get production API keys from Bytescale
});

const options = { multi: true };

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
  const [analysisLoading, setAnalysisLoading] = useState<LoadingState>(
    loadingStates.NOT_STARTED
  );
  const [processLoading, setProcessLoading] = useState<LoadingState>(
    loadingStates.NOT_STARTED
  );
  const [outputLoading, setOutputLoading] = useState<LoadingState>(
    loadingStates.NOT_STARTED
  );

  return (
    <div className="font-sans bg-slate-950 text-white min-h-screen p-8 sm:p-20 grid grid-rows-[auto_1fr_auto] gap-16">
      <header className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-bold mb-2">Upload your Content Here!</h1>
          <p className="text-xl font-semibold mb-2 text-slate-400">
            No worries if it looks messy, we will fix that up for you!
          </p>
        </motion.div>
      </header>

      <main className="flex justify-center items-center h-full w-full">
        {/* Upload file */}
        {uploadLoading === loadingStates.NOT_STARTED && (
          <div className="w-full flex justify-center">
            <Card className="bg-slate-100 border-slate-700 py-10 w-1/2">
              <div className=" flex flex-col justify-between h-fit">
                <CardContent className="flex flex-col justify-center px-8 gap-x-6">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                    <div className="flex flex-col gap-y-2">
                      <Label>Title</Label>
                      <Input placeholder="title" />
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <Label>Vibe</Label>
                      <Input placeholder="how should the audience feel..." />
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <Label>Maximum Video Length (seconds)</Label>
                      <Input type="" placeholder="30" />
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <Label>File Type</Label>
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select file type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {/* <SelectLabel>Select</SelectLabel> */}
                            <SelectItem value="mp4">MP4</SelectItem>
                            <SelectItem value="mov">MOV</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="w-full flex justify-center my-20">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-fit"
                    >
                      <UploadButton
                        uploader={uploader}
                        options={options}
                        onComplete={(files) => {
                          alert(files.map((x) => x.fileUrl).join("\n"));
                        }}
                      >
                        {({ onClick }) => (
                          <Button className="p-6 text-xl" onClick={onClick}>
                            Upload a file...
                          </Button>
                        )}
                      </UploadButton>
                    </motion.div>
                  </div>

                  <div className="w-full flex justify-end mt-12">
                    <Button
                      className="w-fit p-6 text-lg"
                      onClick={() => {
                        setUploadLoading(loadingStates.LOADING);
                        console.log(uploadLoading);
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

        {uploadLoading === loadingStates.LOADING ||
          analysisLoading === loadingStates.LOADING ||
          processLoading === loadingStates.LOADING ||
          (outputLoading === loadingStates.LOADING && <Loading />)}
      </main>

      <footer className="text-center text-slate-600 text-sm">
        © 2025 TrailMixer. All rights reserved.
      </footer>
    </div>
  );
}
