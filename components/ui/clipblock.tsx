"use client";

import { useEffect, useRef, useState } from "react";
import interact from "interactjs";

interface ClipBlockProps {
  initialX: number; // Initial horizontal position in pixels
  initialWidth: number; // Initial width in pixels
  parentWidth: number; // Total width of timeline in pixels
  onDragMove?: (newX: number) => void;
  onResizeMove?: (deltaStart: number, deltaEnd: number) => void;
  clipName: string;
  isAudio: boolean;
}

export default function ClipBlock({
  initialX,
  initialWidth,
  parentWidth,
  onDragMove,
  onResizeMove,
  clipName,
  isAudio,
}: ClipBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(initialX);
  const [width, setWidth] = useState(initialWidth);

  useEffect(() => {
    if (!blockRef.current) return;

    let drag: ReturnType<typeof interact> | null = null;

    drag = interact(blockRef.current).draggable({
      lockAxis: "x",
      inertia: false,
      listeners: {
        move(event) {
          const target = blockRef.current!;
          const prevX = parseFloat(target.getAttribute("data-x") || "0");
          const newX = prevX + event.dx;

          target.style.transform = `translateX(${newX}px)`;
          target.setAttribute("data-x", String(newX));

          setX(newX);
          onDragMove?.(newX);
        },
      },
    });

    let resize: ReturnType<typeof interact> | null = null;

    resize = interact(blockRef.current).resizable({
      edges: { top: false, left: true, bottom: false, right: true },
      listeners: {
        move: function (event) {
          let { x, y } = event.target.dataset;

          x = (parseFloat(x) || 0) + event.deltaRect.left;
          y = parseFloat(y) || 0;

          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            transform: `translate(${x}px, 0px)`,
          });

          Object.assign(event.target.dataset, { x, y });

          const deltaLeft = event.deltaRect.left; // px resized from left
          const deltaRight = event.deltaRect.right; // px resized from right

          onResizeMove?.(deltaLeft, deltaRight);
        },
      },
    });

    return () => {
      drag?.unset();
      resize.unset();
    };
  }, [parentWidth, onDragMove, onResizeMove]);

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
