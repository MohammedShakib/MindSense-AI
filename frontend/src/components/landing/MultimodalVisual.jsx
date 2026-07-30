import React from 'react';
import heroVisual from '../../assets/just laptop.png';

export default function MultimodalVisual() {
  return (
    <div
      className="relative mx-auto mt-8 w-full max-w-[760px] select-none overflow-visible sm:max-w-[860px] lg:mt-0 lg:w-[126%] lg:translate-x-24 xl:w-[136%] xl:translate-x-32 2xl:translate-x-40"
    >
      <img
        src={heroVisual}
        alt="MindSense AI multimodal wellness assessment dashboard with four signal cards"
        className="block h-auto w-full max-w-full translate-y-1 sm:translate-y-2 lg:translate-x-0 lg:translate-y-6 lg:scale-[1.16] xl:translate-y-8 xl:scale-[1.24]"
        draggable="false"
      />
    </div>
  );
}
