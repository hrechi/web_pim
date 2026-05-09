import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

export interface BackgroundBeamsProps {
  className?: string;
}

// Paths scaled to fill a tall full-page viewport (1440 x 3000)
const pathData = [
  "M-200 0C-200 0 100 600 500 900C900 1200 1100 1800 1100 2800",
  "M-150 0C-150 0 150 620 550 920C950 1220 1150 1820 1150 2800",
  "M-100 0C-100 0 200 640 600 940C1000 1240 1200 1840 1200 2800",
  "M-50 0C-50 0 250 660 650 960C1050 1260 1250 1860 1250 2800",
  "M0 0C0 0 300 680 700 980C1100 1280 1300 1880 1300 2800",
  "M50 0C50 0 350 700 750 1000C1150 1300 1350 1900 1350 2800",
  "M100 0C100 0 400 720 800 1020C1200 1320 1400 1920 1400 2800",
  "M150 0C150 0 450 740 850 1040C1250 1340 1450 1940 1450 2800",
  "M200 0C200 0 500 760 900 1060C1300 1360 1500 1960 1500 2800",
  "M250 0C250 0 550 780 950 1080C1350 1380 1550 1980 1550 2800",
  "M300 0C300 0 600 800 1000 1100C1400 1400 1600 2000 1600 2800",
  "M350 0C350 0 650 820 1050 1120C1450 1420 1650 2020 1650 2800",
  "M400 0C400 0 700 840 1100 1140C1500 1440 1700 2040 1700 2800",
  "M450 0C450 0 750 860 1150 1160C1550 1460 1750 2060 1750 2800",
  "M500 0C500 0 800 880 1200 1180C1600 1480 1800 2080 1800 2800",
  "M550 0C550 0 850 900 1250 1200C1650 1500 1850 2100 1850 2800",
  "M600 0C600 0 900 920 1300 1220C1700 1520 1900 2120 1900 2800",
  "M650 0C650 0 950 940 1350 1240C1750 1540 1950 2140 1950 2800",
  "M700 0C700 0 1000 960 1400 1260C1800 1560 2000 2160 2000 2800",
  "M750 0C750 0 1050 980 1450 1280C1850 1580 2050 2180 2050 2800",
];

const animations = pathData.map((_, i) => ({
  duration: 5 + (i % 5) * 1.2,
  delay: i * 0.3,
}));

// Fieldly green palette — clear, light, compatible with warm white bg
const BEAM_COLORS = [
  { from: "#309448", mid1: "#2ecc71", mid2: "#1abc9c", to: "#27ae60" },
  { from: "#2ecc71", mid1: "#309448", mid2: "#27ae60", to: "#1abc9c" },
  { from: "#1abc9c", mid1: "#309448", mid2: "#729944", to: "#2ecc71" },
  { from: "#729944", mid1: "#2ecc71", mid2: "#309448", to: "#1abc9c" },
  { from: "#27ae60", mid1: "#1abc9c", mid2: "#2ecc71", to: "#309448" },
];

export const BackgroundBeams = React.memo(({ className }: BackgroundBeamsProps) => {
  return (
    <div className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}>
      <svg
        aria-hidden="true"
        className="absolute h-full w-full"
        fill="none"
        viewBox="0 0 1440 3000"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Static faint paths for depth */}
        <g opacity="0.06">
          {pathData.map((d, i) => (
            <path key={`static-${i}`} d={d} stroke="#309448" strokeWidth="1" />
          ))}
        </g>

        {/* Animated gradient beams */}
        {pathData.map((d, i) => (
          <motion.path
            key={`beam-${i}`}
            d={d}
            stroke={`url(#gradient-${i})`}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: animations[i].duration,
              delay: animations[i].delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <defs>
          {pathData.map((_, i) => {
            const c = BEAM_COLORS[i % BEAM_COLORS.length];
            return (
              <linearGradient
                key={`gradient-${i}`}
                id={`gradient-${i}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%"   stopColor={c.from}  stopOpacity="0" />
                <stop offset="20%"  stopColor={c.from}  stopOpacity="1" />
                <stop offset="50%"  stopColor={c.mid1}  stopOpacity="1" />
                <stop offset="80%"  stopColor={c.mid2}  stopOpacity="1" />
                <stop offset="100%" stopColor={c.to}    stopOpacity="0" />
              </linearGradient>
            );
          })}
        </defs>
      </svg>
    </div>
  );
});

BackgroundBeams.displayName = "BackgroundBeams";
