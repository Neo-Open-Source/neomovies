"use client";
import { ReactNode, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HorizontalSlider({ children, title }: { children: ReactNode; title: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const scrollAmount = 300;
    el.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-lg font-semibold text-warm-900">{title}</h2>
        <div className="hidden gap-1 md:flex">
          <button onClick={() => scroll("left")}
                  className="rounded-md bg-warm-200 p-1 text-warm-700 shadow-sm hover:bg-warm-300">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll("right")}
                  className="rounded-md bg-warm-200 p-1 text-warm-700 shadow-sm hover:bg-warm-300">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden md:gap-4"
      >
        {children}
      </div>
    </section>
  );
}
