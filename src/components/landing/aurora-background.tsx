import type React from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BackgroundBeams } from "./background-beams";

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function AuroraBackground({ className, children, ...props }: AuroraBackgroundProps) {
  return (
    <div
      className={cn("relative min-h-screen w-full overflow-x-hidden text-ink", className)}
      style={{ backgroundColor: "#f4faf5" }}
      {...(props as any)}
    >
      {/* Beams layer — fixed, covers full scroll height, blends through sections */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          mixBlendMode: "multiply",
        }}
      >
        <BackgroundBeams />
      </div>

      {/* Content sits above beams */}
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

export default AuroraBackground;
