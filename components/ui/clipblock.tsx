"use client";

import { useEffect, useRef, useState } from "react";
import interact from "interactjs";

interface ClipBlockProps {
  initialX: number;
  initialWidth: number;
  parentWidth: number;
  onDragMove?: (newX: number) => void; // For optional live feedback (usually not needed)
  onDragEnd?: (finalX: number) => void;
  onResizeMove?: (deltaStart: number, deltaEnd: number) => void;
  onResizeEnd?: (finalLeftDelta: number, finalRightDelta: number) => void;
  clipName: string;
  isAudio: boolean;
  clipStart: number; // <-- add this!
  clipDuration: number; // <-- add this!
  blockWidthPx: number;
}

export default function ClipBlock({
  initialX,
  initialWidth,
  parentWidth,
  onDragMove,
  onDragEnd,
  onResizeMove,
  onResizeEnd,
  clipName,
  isAudio,
  clipStart,
  clipDuration,
  blockWidthPx,
}: ClipBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const leftDeltaRef = useRef(0);
  const rightDeltaRef = useRef(0);

  const [x, setX] = useState(initialX);
  const [width, setWidth] = useState(initialWidth);

  useEffect(() => {
    if (!blockRef.current) return;

    const target = blockRef.current;
    const drag = interact(target).draggable({
      lockAxis: "x",
      inertia: false,
      listeners: {
        move(event) {
          const prevX = parseFloat(target.getAttribute("data-x") || "0");
          const newX = prevX + event.dx;
          target.style.transform = `translateX(${newX}px)`;
          target.setAttribute("data-x", String(newX));
          // Only call this if you want *live* feedback (usually skip this!)
          onDragMove?.(newX);
        },
        end(event) {
          const finalX = parseFloat(target.getAttribute("data-x") || "0");
          // Only update state here!
          onDragEnd?.(finalX);
        },
      },
    });

    const resize = interact(target).resizable({
      edges: { top: false, left: true, bottom: false, right: true },
      listeners: {
        start() {
          leftDeltaRef.current = 0;
          rightDeltaRef.current = 0;
        },
        move: function (event) {
          leftDeltaRef.current += event.deltaRect.left;
          rightDeltaRef.current += event.deltaRect.right;

          let { x, y } = event.target.dataset;
          x = (parseFloat(x) || 0) + event.deltaRect.left;
          y = parseFloat(y) || 0;

          const pxPerSecond = blockWidthPx / clipDuration;
          const deltaStartSec = leftDeltaRef.current / pxPerSecond;
          const deltaEndSec = rightDeltaRef.current / pxPerSecond;
          const newStart = clipStart + deltaStartSec;
          const newEnd = clipStart + clipDuration - deltaEndSec;

          // Clamp left edge: don't allow start < 0
          if (newStart < 0) {
            const clampLeftPx = -clipStart * pxPerSecond;
            x = (parseFloat(event.target.dataset.x) || 0) + clampLeftPx;
            leftDeltaRef.current -= event.deltaRect.left - clampLeftPx;
            event.target.style.width = `${
              event.rect.width - (event.deltaRect.left - clampLeftPx)
            }px`;
            event.target.style.transform = `translate(${x}px, 0px)`;
            Object.assign(event.target.dataset, { x, y });
            if (onResizeMove) {
              onResizeMove(clampLeftPx, rightDeltaRef.current);
            }
            return;
          }

          // Clamp right edge: don't allow end < start + minDuration
          const minDuration = 0.1; // seconds
          const minWidthPx = minDuration * pxPerSecond;
          if (newEnd - newStart < minDuration) {
            const clampRightPx =
              (newEnd - minDuration - newStart) * pxPerSecond; // This will be negative, clamp to min width
            rightDeltaRef.current -= event.deltaRect.right - clampRightPx;
            event.target.style.width = `${
              event.rect.width - (event.deltaRect.right - clampRightPx)
            }px`;
            event.target.style.transform = `translate(${x}px, 0px)`;
            Object.assign(event.target.dataset, { x, y });
            if (onResizeMove) {
              onResizeMove(leftDeltaRef.current, clampRightPx);
            }
            return;
          }

          // Normal resize logic
          event.target.style.width = `${event.rect.width}px`;
          event.target.style.transform = `translate(${x}px, 0px)`;
          Object.assign(event.target.dataset, { x, y });
          if (onResizeMove) {
            onResizeMove(leftDeltaRef.current, rightDeltaRef.current);
          }
        },

        end(event) {
          if (onResizeEnd) {
            onResizeEnd(leftDeltaRef.current, rightDeltaRef.current);
          }
        },
      },
    });

    return () => {
      drag?.unset();
      resize?.unset();
    };
  }, [parentWidth, onDragMove, onDragEnd, onResizeMove, onResizeEnd]);

  return (
    <div
      ref={blockRef}
      data-x={x}
      className={`relative top-0 h-16 rounded shadow-md flex items-center pl-2 text-white cursor-ew-resize ${
        isAudio ? "bg-blue-500" : "bg-green-500"
      }`}
      style={{
        width: width,
      }}
    >
      <p className="select-none">{clipName}</p>
    </div>
  );
}
