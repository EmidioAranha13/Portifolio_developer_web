import React, { useEffect, useRef, useState } from "react";
import "./FloatingBalls.css";

type FloatingBallsProps = {
  children?: React.ReactNode;
};

const FloatingBalls: React.FC<FloatingBallsProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [stage, setStage] = useState<"orbit" | "collision" | "background">("orbit");

  useEffect(() => {
    if (stage === "orbit") {
      const timer = setTimeout(() => setStage("collision"), 2000);
      return () => clearTimeout(timer);
    }

    if (stage === "collision") {
      // pequeno delay antes de gerar o fundo
      const toCenter = setTimeout(() => {
        document.querySelectorAll(".orbit-ball").forEach((ball) => {
          ball.classList.add("to-center");
        });
      }, 450);
      const timer = setTimeout(() => setStage("background"), 1400);
      return () => {
        clearTimeout(timer);
        clearTimeout(toCenter);
      };
    }

    if (stage === "background") {
      const container = containerRef.current;
      if (!container) return;

      const numBalls = 100;
      const colors = [
        "rgba(0, 150, 255, 0.25)", // azul
        "rgba(0, 255, 50, 0.25)", // amarelo
        "rgba(255, 100, 0, 0.25)", // magenta
        "rgba(0, 150, 255, 0.25)", // azul
        "rgba(255, 255, 0, 0.25)", // amarelo
        "rgba(255, 0, 150, 0.25)", // magenta
      ];

      for (let i = 0; i < numBalls; i++) {
        const ball = document.createElement("div");
        const color = colors[Math.floor(Math.random() * colors.length)];

        ball.classList.add("ball");
        ball.style.background = color;

        // metade esquerda, metade direita
        const side = i < numBalls / 2 ? "left" : "right";
        const xStart = 48;
        const xEnd = side === "left" ? Math.random() * 20 : 80 + Math.random() * 20;
        const yEnd = Math.random() * 100;

        ball.style.left = `${xStart}vw`;
        ball.style.top = "50vh";

        const size = Math.random() * 100 + 20;
        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;

        container.appendChild(ball);

        // ANIMAÇÃO DE EXPLOSÃO INICIAL
        ball.animate(
          [
            { left: `${xStart}vw`, top: "50vh", opacity: 1 },
            { left: `${xEnd}vw`, top: `${yEnd}vh`, opacity: 1 },
          ],
          {
            duration: Math.random() * 2000 + 2000,
            easing: "ease-out",
            fill: "forwards",
          }
        ).finished.then(() => {
          // 🔹 Após chegar na posição final, inicia o movimento suave e infinito
          const toX = Math.random() * 200 - 100;
          const toY = Math.random() * 200 - 100;
          ball.animate(
            [
              { transform: "translate(0, 0)" },
              { transform: `translate(${toX}px, ${toY}px)` },
            ],
            {
              duration: Math.random() * 8000 + 4000,
              direction: "alternate",
              fill: "both",
              iterations: Infinity,
              easing: "ease-in-out",
            }
          );
        });
      }

      return () => {
        container.innerHTML = "";
      };
    }
  }, [stage]);

  return (
    <div className="floating-balls-wrapper">
      {stage !== "background" && (
        <>
          <div className="orbit-container">
            <div className="orbit-ball blue"></div>
            <div className="orbit-ball yellow"></div>
            <div className="orbit-ball magenta"></div>
          </div>
        </>
      )}
      {
        stage === "background" && (
          <div className="collision-flash"></div> 
        ) 
      }
      <div className="floating-balls" ref={containerRef}></div>

      <div
        className={`floating-content ${stage === "background" ? "visible" : ""}`}
      >
        {children}
      </div>
    </div>
  );
};

export default FloatingBalls;
