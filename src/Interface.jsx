import { useKeyboardControls } from "@react-three/drei";
import useGame from "./stores/useGame";
import { useEffect, useRef, useState } from "react";
import { addEffect } from "@react-three/fiber";
import customizeIcon from "../public/customize-icon.svg";
import closeIcon from "../public/close.png";
import { motion } from "framer-motion";

const colors = ["mediumpurple", "red", "turquoise", "limegreen", "yellow"];

const Interface = () => {
  const { forward, backward, left, right, jump } = useKeyboardControls(
    (state) => ({
      forward: state.forward,
      backward: state.backward,
      left: state.left,
      right: state.right,
      jump: state.jump,
    })
  );

  const [
    phase,
    startTime,
    endTime,
    playerColor,
    setPhase,
    setBlockSeed,
    setStartTime,
    setEndTime,
    setPlayerColor,
    setEnableAudio,
  ] = useGame((state) => [
    state.phase,
    state.startTime,
    state.endTime,
    state.playerColor,
    state.setPhase,
    state.setBlockSeed,
    state.setStartTime,
    state.setEndTime,
    state.setPlayerColor,
    state.setEnableAudio,
  ]);

  const timerRef = useRef(null);

  useEffect(() => {
    let startTime = 0;
    const unsubscribeEffect = addEffect(() => {
      if (timerRef.current) {
        if (startTime === 0) {
          startTime = Date.now();
        }
        const time = Date.now() - startTime;
        timerRef.current.textContent = `${(time / 1000).toFixed(2)}`;
      } else {
        startTime = 0;
      }
    });
    return () => {
      unsubscribeEffect();
    };
  }, []);

  return (
    <div className="interface">
      <div
        ref={phase === "playing" ? timerRef : null}
        style={{
          opacity:
            phase === "ready" || phase === "customizing" || phase === "start"
              ? 0
              : 1,
        }}
        className="time"
      >
        {phase !== "ended" || phase !== "customizing"
          ? "0.00"
          : ((endTime - startTime) / 1000).toFixed(2)}
      </div>
      {phase === "start" && (
        <div
          className="start"
          onClick={() => {
            setPhase("ready");
            setEnableAudio(true);
          }}
        >
          Start
        </div>
      )}
      {phase === "ended" && (
        <div
          className="restart"
          onClick={() => {
            setStartTime(0);
            setEndTime(0);
            setPhase("ready");
            setBlockSeed(Math.floor(Math.random() * 40));
          }}
        >
          Restart
        </div>
      )}
      {phase !== "customizing" && phase !== "start" && (
        <div className="controls">
          <div className="raw">
            <div className={`key ${forward && "active"}`}></div>
          </div>
          <div className="raw">
            <div className={`key ${left && "active"}`}></div>
            <div className={`key ${backward && "active"}`}></div>
            <div className={`key ${right && "active"}`}></div>
          </div>
          <div className="raw">
            <div className={`key ${jump && "active"} large`}></div>
          </div>
        </div>
      )}
      {phase === "customizing" && (
        <div className="colorCustomizer">
          {colors.map((color, i) => (
            <motion.div
              onClick={() => setPlayerColor(color)}
              key={color}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: i === 0 ? 4.3 + 0.1 : 4.3 + i * 0.2,
              }}
              className={`colorOption ${
                `${playerColor}` === color && "active"
              }`}
            >
              <div className={color} />
            </motion.div>
          ))}
        </div>
      )}
      {(phase === "ready" || phase === "customizing") && (
        <>
          <div
            className={`customize key ${left && "active"}`}
            onClick={() =>
              phase === "ready" ? setPhase("customizing") : setPhase("ready")
            }
          >
            {<img src={phase === "ready" ? customizeIcon : closeIcon} alt="" />}
          </div>
        </>
      )}
    </div>
  );
};
export default Interface;
