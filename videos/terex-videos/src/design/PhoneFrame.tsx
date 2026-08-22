import React from "react";
import { colors } from "./tokens";

/**
 * Cadre "smartphone" stylisé — sert de conteneur pour les étapes du tutoriel.
 */
export const PhoneFrame: React.FC<{
  children: React.ReactNode;
  width?: number;
  height?: number;
}> = ({ children, width = 620, height = 1240 }) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 62,
        padding: 14,
        background: "linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02))",
        boxShadow:
          "0 60px 140px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.08)",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 50,
          background: colors.dark,
          overflow: "hidden",
          position: "relative",
          border: `1px solid ${colors.border}`,
        }}
      >
        {/* Dynamic island */}
        <div
          style={{
            position: "absolute",
            top: 18,
            left: "50%",
            translate: "-50% 0",
            width: 130,
            height: 34,
            borderRadius: 20,
            background: "#000",
            zIndex: 10,
          }}
        />
        {children}
      </div>
    </div>
  );
};
