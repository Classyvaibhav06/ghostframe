import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const SparklesCore = ({
  id,
  background,
  minSize = 1,
  maxSize = 3,
  particleDensity = 120,
  className,
  particleColor = "#FFF",
}) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: particleDensity }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (maxSize - minSize) + minSize,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      }));
      setParticles(newParticles);
    };
    generateParticles();
  }, [particleDensity, maxSize, minSize]);

  return (
    <div className={cn("relative h-full w-full overflow-hidden pointer-events-none", className)} style={{ background }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: particleColor,
            boxShadow: `0 0 ${p.size * 2}px ${particleColor}`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
