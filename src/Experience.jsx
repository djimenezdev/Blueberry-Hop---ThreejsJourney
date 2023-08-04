import {
  Center,
  Cloud,
  Float,
  OrbitControls,
  Sky,
  Text,
  Text3D,
} from "@react-three/drei";
import Lights from "./Lights.jsx";
import { Level } from "./Level.jsx";
import Player from "./Player.jsx";
import useGame from "./stores/useGame.js";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";
import { damp } from "maath/easing";

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blockSeed = useGame((state) => state.blockSeed);
  const enableAudio = useGame((state) => state.enableAudio);
  const gameTitle = useRef(null);

  const newPos = new THREE.Vector3(2.5, 4, 6);
  useFrame(({ camera }, delta) => {
    if (!enableAudio) {
      camera.lookAt(0, 0, 0);
      camera.position.lerp(newPos, delta);
    } else {
      if (gameTitle.current) {
        if (gameTitle.current.material.opacity > 0.1) {
          damp(gameTitle.current.material, "opacity", 0, 0.01, delta);
        }
      }
    }
  });

  return (
    <>
      <color args={["#bdedfc"]} attach="background" />
      <Sky sunPosition={[-3, 1, 0]} />
      {/* <OrbitControls makeDefault /> */}
      {enableAudio && (
        <>
          <Float rotationIntensity={0.4} floatIntensity={0.2}>
            <Text
              font="/bebas-neue-v9-latin-regular.woff"
              fontSize={0.2}
              maxWidth={0.2}
              position={[0.6, 0.8, 0]}
              lineHeight={0.975}
            >
              <meshBasicMaterial toneMapped={false} />
            </Text>
          </Float>

          <Player />
          <Level count={blocksCount} seed={blockSeed} />
        </>
      )}
      <Text3D
        font={"/bebas-neue-typeface.json"}
        size={0.5}
        position={[-0.1, 2.5, 4.2]}
        rotation={[0, 0.39, 0]}
        ref={gameTitle}
      >
        Blueberry Hop
        <meshStandardMaterial
          toneMapped={false}
          color="mediumpurple"
          transparent
        />
      </Text3D>
      <Lights />
    </>
  );
}
