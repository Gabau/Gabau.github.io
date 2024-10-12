import React, { useEffect, useState, useContext, SetStateAction } from "react";
import { Stage, Graphics, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import ThemeContext from "../../context/ThemeContext";

// Define dimensions
const screenWidth = 800;
const screenHeight = 600;

const paddleWidth = 20;
const paddleHeight = 100;
const ballSize = 20;

interface BallState {
  x: number;
  y: number;
}

interface BallSpeedState {
  x: number;
  y: number;
}


const keyState: { [key: string]: boolean } = {};

const Pong: React.FC = () => {
  const {theme} = useContext(ThemeContext);

  const [ball, setBall] = useState<BallState>({ x: screenWidth / 2, y: screenHeight / 2 });
  const [ballSpeed, setBallSpeedInner] = useState<BallSpeedState>({ x: 4, y: 4 });
  const [recentlySetSpeed, setRecentlySetSpeed] = useState(false);
  const [leftPaddleY, setLeftPaddleY] = useState<number>(screenHeight / 2 - paddleHeight / 2);
  const [rightPaddleY, setRightPaddleY] = useState<number>(screenHeight / 2 - paddleHeight / 2);

  const [leftScore, setLeftScore] = useState<number>(0);
  const [rightScore, setRightScore] = useState<number>(0);

  const setBallSpeed = (f: SetStateAction<BallSpeedState>) => {
    // if it has been set recently
    if (recentlySetSpeed) return;
    setBallSpeedInner(f);
    setRecentlySetSpeed(true);
    setTimeout(() => setRecentlySetSpeed(false), 100);
  }
  const paddleSpeed = 5;

  // Colors based on theme
  const colors = {
    dark: {
      backgroundColor: 0x000000,
      paddleBallColor: 0x00ff00,
    },
    light: {
      backgroundColor: 0xffffff,
      paddleBallColor: 0x000000,
    },
  };

  const currentColors = theme === "dark" ? colors.dark : colors.light;

  // Handle key down and key up
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keyState[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keyState[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Game loop to update ball, paddles, and handle collisions
  useEffect(() => {
    const gameLoop = () => {
      // Move paddles based on keyState
      if (keyState["ArrowUp"]) {
        setRightPaddleY((prevY) => Math.max(prevY - paddleSpeed, 0));
      }
      if (keyState["ArrowDown"]) {
        setRightPaddleY((prevY) => Math.min(prevY + paddleSpeed, screenHeight - paddleHeight));
      }

      // Left paddle follows the ball (simple AI logic)
      setLeftPaddleY((prevY) => {
        const targetY = ball.y - paddleHeight / 2;
        const moveUp = targetY < prevY ? -paddleSpeed : 0;
        const moveDown = targetY > prevY ? paddleSpeed : 0;
        return Math.max(0, Math.min(prevY + moveUp + moveDown, screenHeight - paddleHeight));
      });

      // Ball movement and collision logic
      setBall((prevBall) => {
        let newBall = { ...prevBall };

        // Move the ball
        newBall.x += ballSpeed.x;
        newBall.y += ballSpeed.y;

        // Ball collision with top and bottom walls
        if (newBall.y <= 0 || newBall.y >= screenHeight - ballSize) {
          setBallSpeed((prevSpeed) => ({ ...prevSpeed, y: -prevSpeed.y }));
        }

        // Ball collision with left paddle (AI paddle)
        if (
          newBall.x <= paddleWidth &&
          newBall.y >= leftPaddleY &&
          newBall.y <= leftPaddleY + paddleHeight
        ) {
          setBallSpeed((prevSpeed) => ({ ...prevSpeed, x: -prevSpeed.x }));
        }

        // Ball collision with right paddle
        if (
          newBall.x >= screenWidth - paddleWidth - ballSize &&
          newBall.y >= rightPaddleY &&
          newBall.y <= rightPaddleY + paddleHeight
        ) {
          setBallSpeed((prevSpeed) => ({ ...prevSpeed, x: -prevSpeed.x }));
        }

        // Ball goes off the left side
        if (newBall.x < 0) {
          setRightScore((prevScore) => prevScore + 1);
          newBall = { x: screenWidth / 2, y: screenHeight / 2 };
          setBallSpeed({ x: 4, y: 4 });
        }

        // Ball goes off the right side
        if (newBall.x > screenWidth - ballSize) {
          setLeftScore((prevScore) => prevScore + 1);
          newBall = { x: screenWidth / 2, y: screenHeight / 2 };
          setBallSpeed({ x: -4, y: 4 });
        }

        return newBall;
      });
    }
    const m = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(m);
  }, [ball, ballSpeed, leftPaddleY, rightPaddleY]);

  return (
    <Stage width={screenWidth} height={screenHeight} options={{ backgroundColor: currentColors.backgroundColor }}>
      {/* Left Paddle */}
      <Graphics
        draw={(g: PIXI.Graphics) => {
          g.clear();
          g.beginFill(currentColors.backgroundColor);
          g.drawRect(0, 0, screenWidth, screenHeight);

          g.beginFill(currentColors.paddleBallColor);
          g.drawRect(0, leftPaddleY, paddleWidth, paddleHeight);
          g.endFill();
        }}
      />

      {/* Right Paddle */}
      <Graphics
        draw={(g: PIXI.Graphics) => {
          g.clear();
          g.beginFill(currentColors.paddleBallColor);
          g.drawRect(screenWidth - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
          g.endFill();
        }}
      />

      {/* Ball */}
      <Graphics
        draw={(g: PIXI.Graphics) => {
          g.clear();
          g.beginFill(currentColors.paddleBallColor);
          g.drawRect(ball.x, ball.y, ballSize, ballSize);
          g.endFill();
        }}
      />

      {/* Score Display */}
      <Text
        text={`${leftScore} : ${rightScore}`}
        x={screenWidth / 2 - 50}
        y={20}
        style={
          new PIXI.TextStyle({
            fill: currentColors.paddleBallColor === 0x00ff00 ? "#00ff00" : "#000000",
            fontSize: 36,
          })
        }
      />
    </Stage>
  );
};

export default Pong;
