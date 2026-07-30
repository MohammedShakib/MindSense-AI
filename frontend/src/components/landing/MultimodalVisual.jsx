import React from 'react';
import heroVisual from '../../assets/just laptop.png';

export default function MultimodalVisual() {
  return (
    <div
      className="relative mx-auto mt-8 w-full max-w-[920px] select-none overflow-visible lg:mt-0 lg:w-[126%] lg:translate-x-24 xl:w-[136%] xl:translate-x-32 2xl:translate-x-40"
    >
      <img
        src={heroVisual}
        alt="MindSense AI multimodal wellness assessment dashboard with four signal cards"
        className="block h-auto w-[118%] max-w-none -translate-x-[9%] translate-y-2 sm:w-[112%] sm:-translate-x-[6%] lg:w-full lg:translate-x-0 lg:translate-y-6 lg:scale-[1.16] xl:translate-y-8 xl:scale-[1.24]"
        draggable="false"
      />
    </div>
  );
}
