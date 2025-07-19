"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useEffect } from "react";

interface vid {
  id: string;
  url: string;
  name: string;
  position: number;
}

interface OrderListProps {
  vids: vid[];
  onChange?: (newItems: vid[]) => void;
}

export default function OrderList({ vids, onChange }: OrderListProps) {
  const [items, setItems] = useState<vid[]>(vids);

  useEffect(() => {
    console.log("vids updated:", vids);
    setItems(vids);
  }, [vids]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex).map(
        (item, idx) => ({
          ...item,
          position: idx + 1, // Update position field to match 1-based index
        })
      );

      setItems(newItems);

      if (onChange) {
        onChange(newItems);
      }
    }
  };

  return (
    <div className="p-4 w-80 mx-auto text-white text-md">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item, index) => (
            <SortableItem
              key={item.id}
              id={item.id}
              content={`${index + 1}. ${item.name}`}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableItem({ id, content }: { id: string; content: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 mb-2 bg-gray-700 rounded shadow cursor-move"
    >
      {content}
    </div>
  );
}
