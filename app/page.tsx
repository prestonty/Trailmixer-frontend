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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const content = [
    {
      title: "Create Stunning Trailers",
      description:
        "Our software will match the proper background music, sound effects, and stitch together video clips to impress your audience.",
    },
    {
      title: "Fast & Automated",
      description:
        "Upload video clips showcasing your event and we will create all the promotional content for you. Perhaps Hackthe6ix needs a promotional recap video to summarize their successful event...",
    },
    {
      title: "Built-in Video Editor",
      description:
        "Drag around audio clips, add sound effects, and switch out background music all at your control.",
    },
  ];
  return (
    <div className="font-sans bg-slate-950 text-white relative w-full overflow-hidden min-h-screen p-8 sm:p-20 grid grid-rows-[auto_1fr_auto] gap-16">
      {/* Background video container */}
      <div className="absolute inset-0 z-1">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/landing/com-video-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black opacity-70" />
      </div>
      <header className="text-center z-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex gap-x-4 justify-center items-center">
            <Image
              src="/landing/trailmixer-logo-small.png"
              width={100}
              height={100}
              alt="logo"
              className="mb-4"
            />
            <h1 className="text-6xl font-bold mb-2">TrailMixer</h1>
          </div>
          <p className="text-slate-400">
            Your dream software for creating promotional videos for movies,
            events, and beyond!
          </p>
        </motion.div>
      </header>

      <main className="grid grid-cols-1 sm:grid-cols-3 gap-8 z-2">
        {content.map((contentItem, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.2,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2, delay: 0 },
            }}
            whileTap={{
              scale: 0.98,
              transition: { duration: 0.2, delay: 0, ease: "easeOut" },
            }}
            className="h-fit"
          >
            <Card className="bg-slate-800 border-slate-700 py-20">
              <div className=" flex flex-col justify-between h-64">
                <CardHeader className="text-white px-12">
                  <CardTitle className="mb-5 text-2xl">
                    {contentItem.title}
                  </CardTitle>
                  <CardDescription className="text-white text-lg">
                    {contentItem.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center px-12">
                  <Button variant="secondary" className="w-fit px-10">
                    Learn More
                  </Button>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </main>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 1.2 }}
        className="w-full flex justify-center z-2"
      >
        <Button variant="secondary" className="p-8 text-xl">
          <Link href="/trailer">Get Started</Link>
        </Button>
      </motion.div>
      <footer className="text-center text-slate-600 text-sm">
        © 2025 TrailMixer. All rights reserved.
      </footer>
    </div>
  );
}
