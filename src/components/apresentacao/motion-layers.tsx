"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { type ReactNode, useRef } from "react";

type ParallaxProps = {
  children: ReactNode;
  /** Deslocamento total em px: começa em +distance e termina em -distance. */
  distance?: number;
  /**
   * Para elementos já visíveis no carregamento: começam na posição real do
   * layout (y = 0) e só sobem ao rolar, senão nascem deslocados.
   */
  aboveFold?: boolean;
  className?: string;
};

/**
 * O elemento externo fica parado para a medição do scroll; só o interno recebe
 * o transform, senão o getBoundingClientRect realimenta o próprio cálculo.
 */
export function Parallax({
  children,
  distance = 40,
  aboveFold = false,
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: aboveFold
      ? ["start start", "end start"]
      : ["start end", "end start"],
  });
  const raw = useTransform(
    scrollYProgress,
    [0, 1],
    aboveFold ? [0, -distance] : [distance, -distance],
  );
  const y = useSpring(raw, { stiffness: 80, damping: 22, mass: 0.4 });

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-full w-full"
        style={reduced ? undefined : { y }}
      >
        {children}
      </motion.div>
    </div>
  );
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 18,
}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
