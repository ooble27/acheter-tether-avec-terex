import { AbsoluteFill } from "remotion";

/**
 * Fond neutre, sombre, très légèrement dégradé.
 * Pas de halo coloré — la couleur vient uniquement des écrans Terex à l'écran.
 */
export const Background: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 0%, #141414 0%, #0b0b0b 60%, #060606 100%)",
      }}
    />
  );
};
