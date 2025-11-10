"use client";

import React from "react";

const NotFoundPage = () => {
  return (
    <div className="relative w-full h-screen bg-flame overflow-hidden flex items-center justify-center px-4 md:px-8 lg:px-12">
      {/* Full 404 Background */}
      <div className="absolute inset-0 flex items-center justify-center px-4 md:px-8 lg:px-12">
        <span
          className="text-[35vw] sm:text-[40vw] md:text-[42vw] lg:text-[45vw] leading-none font-medium tracking-tighter select-none"
          style={{
            fontFamily: "var(--font-montserrat), sans-serif",
            color: "var(--color-black)",
            fontWeight: 500,
          }}
        >
          404
        </span>
      </div>

      {/* Center Vertical White Bar with FALSENINE (Overlay) */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-12 sm:w-14 md:w-16 h-full bg-white flex items-center justify-center z-10">
        <div className="transform -rotate-90 whitespace-nowrap">
          <span
            className="text-lg sm:text-xl md:text-2xl tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em] font-normal"
            style={{
              fontFamily: "var(--font-falsenine), sans-serif",
              color: "var(--color-night)",
            }}
          >
            FALSENINE
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
