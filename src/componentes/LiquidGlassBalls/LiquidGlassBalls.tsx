import React, { useEffect, useMemo, useRef } from "react";
import "./LiquidGlassBalls.css";

type LiquidGlassBallsProps = {
  children?: React.ReactNode;
  preset?: "soft" | "crystal" | "liquid-strong";
};

type BallConfig = {
  id: number;
  size: number;
  top: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
};

const BALL_COUNT = 60;
const COLORS = ["var(--green1)", "var(--orange1)", "var(--blue1)", "var(--yellow1)", "var(--magenta1)"];

const FILTER_PRESET = {
  soft: { baseFrequency: "0.008 0.011", numOctaves: 1, scale: 18 },
  crystal: { baseFrequency: "0.011 0.014", numOctaves: 2, scale: 34 },
  "liquid-strong": { baseFrequency: "0.014 0.018", numOctaves: 2, scale: 48 },
} as const;

/**
 * Renderiza o fundo com bolas no estilo liquid glass.
 * Também aplica o efeito de repulsão quando o mouse se aproxima das bolas.
 *
 * @param props Propriedades do componente.
 * @param props.children Conteúdo principal renderizado acima do fundo.
 * @param props.preset Preset visual do vidro (soft, crystal, liquid-strong).
 * @returns JSX do plano de fundo e conteúdo.
 */
const LiquidGlassBalls: React.FC<LiquidGlassBallsProps> = ({ children, preset = "crystal" }) => {
  const filterConfig = FILTER_PRESET[preset];
  const glassRefs = useRef<Array<HTMLSpanElement | null>>([]);

  /**
   * Gera a configuração das bolas apenas uma vez por montagem do componente.
   * Define tamanho, posição, cor e timings de animação.
   *
   * @returns Lista de configurações para renderização das bolas.
   */
  const balls = useMemo<BallConfig[]>(() => {
    return Array.from({ length: BALL_COUNT }, (_, index) => ({
      id: index,
      size: Math.round(Math.random() * 110 + 30),
      top: Math.round(Math.random() * 100),
      left: Math.round(Math.random() * 100),
      delay: Number((Math.random() * 8).toFixed(2)),
      duration: Number((Math.random() * 6 + 6).toFixed(2)),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }, []);

  useEffect(() => {
    const repelRadius = 140;
    const maxOffset = 56;
    let raf = 0;
    let lastX = 0;
    let lastY = 0;

    /**
     * Aplica o deslocamento de repulsão nas bolas com base na última posição do mouse.
     * Executa dentro de requestAnimationFrame para reduzir custo por frame.
     *
     * @returns void
     */
    const applyRepel = () => {
      raf = 0;
      const mouseX = lastX;
      const mouseY = lastY;

      glassRefs.current.forEach((glass) => {
        if (!glass) return;

        const rect = glass.getBoundingClientRect();
        const ballX = rect.left + rect.width / 2;
        const ballY = rect.top + rect.height / 2;
        const dx = ballX - mouseX;
        const dy = ballY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0 && distance < repelRadius) {
          const force = (repelRadius - distance) / repelRadius;
          const moveX = (dx / distance) * force * maxOffset;
          const moveY = (dy / distance) * force * maxOffset;
          glass.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        } else {
          glass.style.transform = "translate3d(0, 0, 0)";
        }
      });
    };

    /**
     * Atualiza a posição do cursor e agenda a repulsão no próximo frame.
     *
     * @param event Evento de movimento do mouse.
     * @returns void
     */
    const handleMouseMove = (event: MouseEvent) => {
      lastX = event.clientX;
      lastY = event.clientY;
      if (!raf) raf = requestAnimationFrame(applyRepel);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={`liquid-balls-wrapper preset-${preset}`}>
      <svg className="liquid-balls-defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id="liquid-glass-backdrop" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={filterConfig.baseFrequency}
              numOctaves={filterConfig.numOctaves}
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={filterConfig.scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="liquid-balls-layer">
        {balls.map((ball) => (
          <div
            key={ball.id}
            className="liquid-ball"
            style={
              {
                "--ball-size": `${ball.size}px`,
                "--ball-top": `${ball.top}%`,
                "--ball-left": `${ball.left}%`,
                "--ball-delay": `${ball.delay}s`,
                "--ball-duration": `${ball.duration}s`,
                "--ball-color": ball.color,
              } as React.CSSProperties
            }
          >
            <div className="liquid-ball-float">
              <span
                className="liquid-ball-glass"
                ref={(element) => {
                  glassRefs.current[ball.id] = element;
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="liquid-content">{children}</div>
    </div>
  );
};

export default LiquidGlassBalls;
