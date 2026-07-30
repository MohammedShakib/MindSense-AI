import React from 'react';
import heroVisual from '../../assets/gemini-hero-optimized.png';

export default function MultimodalVisual() {
  return (
    <div
      className="relative mx-auto mt-8 w-full max-w-[1120px] select-none overflow-visible lg:mt-0 lg:w-[150%] lg:translate-x-24 xl:w-[160%] xl:translate-x-32 2xl:translate-x-40"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.96),transparent_45%),radial-gradient(circle_at_24%_52%,rgba(59,130,246,0.10),transparent_36%),radial-gradient(circle_at_78%_70%,rgba(139,92,246,0.12),transparent_38%)]" />
      <img
        src={heroVisual}
        alt="MindSense AI multimodal wellness assessment dashboard with four signal cards"
        className="block h-auto w-[142%] max-w-none -translate-x-[21%] translate-y-4 scale-[1.18] mix-blend-multiply [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.30)_11%,#000_24%,#000_76%,rgba(0,0,0,0.30)_89%,transparent_100%),linear-gradient(to_bottom,rgba(0,0,0,0)_0%,#000_12%,#000_80%,rgba(0,0,0,0.72)_90%,transparent_100%)] [mask-composite:intersect] sm:w-[136%] sm:-translate-x-[18%] lg:w-full lg:translate-x-0 lg:translate-y-8 lg:scale-[1.36] xl:translate-y-10 xl:scale-[1.44]"
        draggable="false"
      />
    </div>
  );
}
