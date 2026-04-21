import React, { useEffect, useRef, useState } from "react";
import type { FloatingBallsProps } from "../../utils/Types";
import "./FloatingBalls.css";

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
      const balls: HTMLDivElement[] = [];

      const colors = [
        "var(--green1)",
        "var(--orange1)",
        "var(--blue1)",
        "var(--yellow1)",
        "var(--magenta1)",
      ];

      for (let i = 0; i < numBalls; i++) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("ball-wrapper");

        const ball = document.createElement("div");
        ball.classList.add("ball");

        wrapper.appendChild(ball);
        container.appendChild(wrapper);
        balls.push(wrapper); // 👈 agora armazenamos o wrapper

        const color = colors[Math.floor(Math.random() * colors.length)];
        ball.style.background = color;

        const side = i < numBalls / 2 ? "left" : "right";
        const xStart = 48;
        const xEnd = side === "left" ? Math.random() * 20 : 80 + Math.random() * 20;
        const yEnd = Math.random() * 100;

        wrapper.style.position = "absolute";
        wrapper.style.left = `${xStart}vw`;
        wrapper.style.top = "50vh";

        const size = Math.random() * 100 + 20;
        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;

        wrapper.animate(
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


      // 🔥 INTERAÇÃO COM O MOUSE
      const handleMouseMove = (e: MouseEvent) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const repelRadius = 140;

        balls.forEach((wrapper) => {
          const rect = wrapper.getBoundingClientRect();
          const ballX = rect.left + rect.width / 2;
          const ballY = rect.top + rect.height / 2;

          const dx = ballX - mouseX;
          const dy = ballY - mouseY;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < repelRadius) {
            const force = (repelRadius - distance) / repelRadius;
            const moveX = (dx / distance) * force * 120;
            const moveY = (dy / distance) * force * 120;

            wrapper.style.transform = `translate(${moveX}px, ${moveY}px)`;
          } else {
            wrapper.style.transform = "";
          }
        });
      };


      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        container.innerHTML = "";
      };
    }

  }, [stage]);

  return (
    <div className="floating-balls-wrapper">
      {stage !== "background" && (
        <>
          <div className="orbit-container">
            <div className="ball orbit-ball blue"></div>
            <div className="ball orbit-ball yellow"></div>
            <div className="ball orbit-ball magenta"></div>
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