import React, { useEffect, useMemo, useRef, useState } from "react";
import type { BallConfig, FloatingBallsProps } from "../../utils/Types";
import "./FloatingBalls.css";

const BALL_COUNT_DESKTOP = 40;
const BALL_COUNT_MOBILE = 30;
/** Alinhado ao layout “compacto” do portfólio (860px). */
const MOBILE_BALLS_MEDIA = "(max-width: 860px)";
const COLORS = ["var(--green1)", "var(--orange1)", "var(--blue1)", "var(--yellow1)", "var(--magenta1)"];

/**
 * Fundo com bolas no estilo do {@link LoadingOrbitSpinner}: anel em degradê + núcleo liquid glass.
 * Mesma lógica de posicionamento e repulsão do {@link LiquidGlassBalls}.
 */
const FloatingBalls: React.FC<FloatingBallsProps> = ({ children }) => {
  const shellRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [ballCount, setBallCount] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(MOBILE_BALLS_MEDIA).matches
      ? BALL_COUNT_MOBILE
      : BALL_COUNT_DESKTOP,
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_BALLS_MEDIA);
    const sync = () => setBallCount(mq.matches ? BALL_COUNT_MOBILE : BALL_COUNT_DESKTOP);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const balls = useMemo<BallConfig[]>(() => {
    return Array.from({ length: BALL_COUNT_DESKTOP }, (_, index) => ({
      id: index,
      size: Math.round(Math.random() * 110 + 30),
      top: Math.round(Math.random() * 100),
      left: Math.round(Math.random() * 100),
      delay: Number((Math.random() * 8).toFixed(2)),
      duration: Number((Math.random() * 6 + 6).toFixed(2)),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }, []);

  const visibleBalls = balls.slice(0, ballCount);

  useEffect(() => {
    const repelRadius = 140;
    const maxOffset = 56;
    let raf = 0;
    let lastX = 0;
    let lastY = 0;

    const applyRepel = () => {
      raf = 0;
      const mouseX = lastX;
      const mouseY = lastY;

      shellRefs.current.forEach((shell) => {
        if (!shell) return;

        const rect = shell.getBoundingClientRect();
        const ballX = rect.left + rect.width / 2;
        const ballY = rect.top + rect.height / 2;
        const dx = ballX - mouseX;
        const dy = ballY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0 && distance < repelRadius) {
          const force = (repelRadius - distance) / repelRadius;
          const moveX = (dx / distance) * force * maxOffset;
          const moveY = (dy / distance) * force * maxOffset;
          shell.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        } else {
          shell.style.transform = "translate3d(0, 0, 0)";
        }
      });
    };

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
    <div className="floating-balls-wrapper">
      <div className="floating-balls-layer">
        {visibleBalls.map((ball) => (
          <div
            key={ball.id}
            className="floating-ball"
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
            <div className="floating-ball-float">
              <div
                className="floating-ball-shell"
                ref={(element) => {
                  shellRefs.current[ball.id] = element;
                }}
              >
                <span className="floating-ball-glass" aria-hidden="true" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {children ? <div className="floating-content">{children}</div> : null}
    </div>
  );
};

export default FloatingBalls;
