import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import "./Preloader.css";

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const countRef = useRef(null);
  const glowRef = useRef(null);
  const [count, setCount] = useState(10);

  useEffect(() => {
    // Lock body scroll during preloader
    document.body.style.overflow = "hidden";

    // Countdown logic from 10 to 0
    let current = 10;
    const interval = setInterval(() => {
      current -= 1;
      if (current >= 0) {
        setCount(current);
        // Subtle pop animation on count change
        if (countRef.current) {
          gsap.fromTo(
            countRef.current,
            { scale: 1.25, opacity: 0.7 },
            { scale: 1, opacity: 1, duration: 0.18, ease: "power2.out" }
          );
        }
      }

      if (current <= 0) {
        clearInterval(interval);
        // Trigger exit bottom-to-top curtain lift
        setTimeout(() => {
          if (containerRef.current) {
            gsap.to(containerRef.current, {
              yPercent: -100,
              duration: 0.9,
              ease: "power4.inOut",
              onComplete: () => {
                document.body.style.overflow = "auto";
                if (onComplete) onComplete();
              },
            });
          } else {
            document.body.style.overflow = "auto";
            if (onComplete) onComplete();
          }
        }, 200);
      }
    }, 180);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "auto";
    };
  }, [onComplete]);

  // Calculate percentage for progress ring/bar (10 -> 0% ... 0 -> 100%)
  const progressPercent = Math.round(((10 - count) / 10) * 100);

  return (
    <div className="cinematic-preloader-wrapper" ref={containerRef}>
      <div className="preloader-curtain">
        {/* Glow backdrop aura */}
        <div className="preloader-glow-aura" ref={glowRef} />

        {/* Outer Tech Ring */}
        <div className="preloader-ring-wrap">
          <svg className="preloader-ring-svg" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>
            <circle
              cx="100"
              cy="100"
              r="85"
              className="ring-bg"
            />
            <circle
              cx="100"
              cy="100"
              r="85"
              className="ring-progress"
              style={{
                strokeDasharray: 534,
                strokeDashoffset: 534 - (534 * progressPercent) / 100,
              }}
            />
          </svg>

          {/* Countdown Center Number */}
          <div className="preloader-count-box">
            <span className="preloader-count" ref={countRef}>
              {count}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;

