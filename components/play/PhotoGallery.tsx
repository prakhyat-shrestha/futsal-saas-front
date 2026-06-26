"use client";

import { useState } from "react";

export function PhotoGallery({ images, badge }: { images: string[]; badge?: string }) {
  const [active, setActive] = useState(0);
  const thumbs = images.slice(1, 4);
  const extraCount = images.length - 4;

  return (
    <div>
      <div className="relative h-96 rounded-2xl overflow-hidden mb-3">
        <img src={images[active]} alt="" className="w-full h-full object-cover" />
        {badge && (
          <span className="absolute top-4 left-4 bg-green-400 text-black text-xs font-dm font-semibold px-3 py-1.5 rounded-full">
            {badge}
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {thumbs.map((src, i) => {
          const imgIndex = i + 1;
          const isLast = i === thumbs.length - 1 && extraCount > 0;
          return (
            <button
              key={src}
              onClick={() => setActive(imgIndex)}
              className="relative h-20 rounded-xl overflow-hidden"
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
              {isLast && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-syne font-semibold text-sm">+{extraCount}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}