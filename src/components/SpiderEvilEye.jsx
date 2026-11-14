import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function SpiderEvilEye() {
  const location = useLocation();
  const spiderRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  // Requirement: NEVER display it inside the Admin Dashboard
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute) return;

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      if (spiderRef.current) {
        const rect = spiderRef.current.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height * 0.65;

        const deltaX = e.clientX - eyeCenterX;
        const deltaY = e.clientY - eyeCenterY;
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(Math.hypot(deltaX, deltaY) / 40, 5); // max 5px radius

        setEyeOffset({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isAdminRoute]);

  if (isAdminRoute) return null;

  // Calculate subtle mouse responsive swing factor
  const mouseFactor = (mousePos.x / (window.innerWidth || 1) - 0.5) * 8;

  const handleClick = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 1200);
  };

  return (
    <div 
      className="fixed top-0 right-14 md:right-28 z-40 pointer-events-auto select-none transition-transform duration-300 ease-out"
      style={{
        transformOrigin: 'top center',
        transform: `rotate(${mouseFactor}deg)`
      }}
      title="NERONOVA SENTINEL - Cyber Evil Eye Spider"
    >
      {/* Spider Hanging Container with CSS Pendulum Swing */}
      <div 
        ref={spiderRef}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex flex-col items-center cursor-pointer animate-spider-swing group"
        style={{ transformOrigin: 'top center' }}
      >
        {/* Thin Cyber Thread hanging from the top */}
        <div className="w-[1.5px] h-20 md:h-28 bg-gradient-to-b from-transparent via-[#FF3030]/80 to-[#E50914] relative">
          <div className="absolute inset-0 bg-[#FF3030] blur-[1px] opacity-75"></div>
          {/* Subtle energy bead traveling down thread */}
          <div className="absolute top-0 w-1.5 h-3 -left-[2px] bg-white rounded-full animate-bounce opacity-80"></div>
        </div>

        {/* Futuristic Red Cyber Spider with Glowing Blue Evil Eye */}
        <div className="relative -mt-1 w-24 h-28 flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(229,9,20,0.6)] group-hover:drop-shadow-[0_0_20px_rgba(255,48,48,0.9)] transition-all duration-300">
          <svg 
            viewBox="0 0 160 180" 
            className="w-full h-full overflow-visible"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Crimson Body Gradient */}
              <linearGradient id="spiderRedBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FF3030" />
                <stop offset="45%" stop-color="#E50914" />
                <stop offset="100%" stop-color="#3d0004" />
              </linearGradient>

              {/* Metallic Plate Gradient */}
              <linearGradient id="spiderPlateMetal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#2a0004" />
                <stop offset="50%" stop-color="#140002" />
                <stop offset="100%" stop-color="#090909" />
              </linearGradient>

              {/* Glowing Evil Eye Gradients */}
              <radialGradient id="evilEyeIris" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="25%" stop-color="#00f0ff" />
                <stop offset="60%" stop-color="#0066ff" />
                <stop offset="90%" stop-color="#001a40" />
                <stop offset="100%" stop-color="#050510" />
              </radialGradient>

              {/* Glow Filter for Evil Eye */}
              <filter id="evilEyeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* SPIDER LEGS (8 Articulated Cyber Robotic Limbs with Neon Red Joints) */}
            <g stroke="#E50914" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300">
              {/* Left Legs */}
              {/* Leg 1 (Front Left) */}
              <path d="M72 55 L35 30 L10 45" className="group-hover:stroke-[#FF3030]" />
              <circle cx="35" cy="30" r="2.5" fill="#FF3030" />
              
              {/* Leg 2 (Mid-Front Left) */}
              <path d="M68 65 L25 55 L5 80" className="group-hover:stroke-[#FF3030]" />
              <circle cx="25" cy="55" r="2.5" fill="#FF3030" />

              {/* Leg 3 (Mid-Back Left) */}
              <path d="M68 80 L22 90 L8 125" className="group-hover:stroke-[#FF3030]" />
              <circle cx="22" cy="90" r="2.5" fill="#FF3030" />

              {/* Leg 4 (Back Left) */}
              <path d="M72 95 L30 120 L15 155" className="group-hover:stroke-[#FF3030]" />
              <circle cx="30" cy="120" r="2.5" fill="#FF3030" />

              {/* Right Legs */}
              {/* Leg 5 (Front Right) */}
              <path d="M88 55 L125 30 L150 45" className="group-hover:stroke-[#FF3030]" />
              <circle cx="125" cy="30" r="2.5" fill="#FF3030" />

              {/* Leg 6 (Mid-Front Right) */}
              <path d="M92 65 L135 55 L155 80" className="group-hover:stroke-[#FF3030]" />
              <circle cx="135" cy="55" r="2.5" fill="#FF3030" />

              {/* Leg 7 (Mid-Back Right) */}
              <path d="M92 80 L138 90 L152 125" className="group-hover:stroke-[#FF3030]" />
              <circle cx="138" cy="90" r="2.5" fill="#FF3030" />

              {/* Leg 8 (Back Right) */}
              <path d="M88 95 L130 120 L145 155" className="group-hover:stroke-[#FF3030]" />
              <circle cx="130" cy="120" r="2.5" fill="#FF3030" />
            </g>

            {/* Pedipalps / Fangs */}
            <path d="M74 38 L68 25 L65 30" stroke="#FF3030" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M86 38 L92 25 L95 30" stroke="#FF3030" strokeWidth="2.5" strokeLinecap="round" />

            {/* CEPHALOTHORAX (Head & Upper Armor) */}
            <polygon 
              points="80,36 94,48 90,66 70,66 66,48" 
              fill="url(#spiderRedBody)" 
              stroke="#FF3030" 
              strokeWidth="1.5"
            />
            {/* Upper Armor Tech Cutouts */}
            <polygon points="80,40 88,48 80,56 72,48" fill="url(#spiderPlateMetal)" stroke="#E50914" strokeWidth="1" />

            {/* ABDOMEN (Armored Cyber Capsule Housing the Evil Eye) */}
            <path 
              d="M70 68 C58 75, 52 95, 58 115 C64 135, 96 135, 102 115 C108 95, 102 75, 90 68 Z" 
              fill="url(#spiderPlateMetal)" 
              stroke="#E50914" 
              strokeWidth="2" 
            />

            {/* Abdomen Cyber Segment Ribs */}
            <path d="M60 85 Q80 92 100 85" stroke="#FF3030" strokeWidth="1.2" opacity="0.7" fill="none" />
            <path d="M62 102 Q80 110 98 102" stroke="#FF3030" strokeWidth="1.2" opacity="0.7" fill="none" />
            <path d="M68 118 Q80 124 92 118" stroke="#FF3030" strokeWidth="1" opacity="0.5" fill="none" />

            {/* ======================================================== */}
            {/* GLOWING BLUE EVIL EYE (CENTER OF ARTIFACT) */}
            {/* ======================================================== */}
            <g transform="translate(80, 96)">
              {/* Outer Protective Tech Ring */}
              <circle 
                cx="0" 
                cy="0" 
                r="18" 
                fill="#050a14" 
                stroke="#00d2ff" 
                strokeWidth="1.8" 
                filter="url(#evilEyeGlow)" 
                className={isPulsing ? "animate-ping opacity-60" : ""}
              />

              {/* Glowing Cyan/Sapphire Outer Iris */}
              <circle 
                cx="0" 
                cy="0" 
                r="15" 
                fill="url(#evilEyeIris)" 
                stroke="#00f0ff" 
                strokeWidth="1.2"
                filter="url(#evilEyeGlow)"
              />

              {/* Evil Eye Concentric Sacred Cyber Rings */}
              <circle cx="0" cy="0" r="11" fill="none" stroke="#00ffff" strokeWidth="0.8" opacity="0.75" />
              <circle cx="0" cy="0" r="7.5" fill="#021430" stroke="#0088ff" strokeWidth="0.8" />

              {/* Mouse-Tracking Pupil Core (Cyan & Radiant White) */}
              <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
                <circle cx="0" cy="0" r="4.2" fill="#00f0ff" filter="url(#evilEyeGlow)" />
                <circle cx="0" cy="0" r="2.2" fill="#ffffff" />
                {/* Specular Highlight Sparkle */}
                <circle cx="-1" cy="-1" r="0.8" fill="#ffffff" />
              </g>

              {/* Orbiting Tech Reticle Marks */}
              <line x1="-15" y1="0" x2="-12" y2="0" stroke="#00f0ff" strokeWidth="1.5" />
              <line x1="12" y1="0" x2="15" y2="0" stroke="#00f0ff" strokeWidth="1.5" />
              <line x1="0" y1="-15" x2="0" y2="-12" stroke="#00f0ff" strokeWidth="1.5" />
              <line x1="0" y1="12" x2="0" y2="15" stroke="#00f0ff" strokeWidth="1.5" />
            </g>

            {/* Tail Stinger / Bio-mech Port */}
            <polygon points="77,135 83,135 80,144" fill="#FF3030" />
          </svg>

          {/* Interactive Tooltip on Hover */}
          {isHovered && (
            <div className="absolute top-28 -right-10 bg-black/95 border border-[#00d2ff] text-[#00d2ff] font-orbitron text-[9px] px-2 py-1 rounded shadow-evileye tracking-wider whitespace-nowrap pointer-events-none">
              NERONOVA SENTINEL // ACTIVE
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
