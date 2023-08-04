import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import PropTypes from "prop-types";
import SpikeRow from "./SpikeRow";
import { PositionalAudio, useEnvironment } from "@react-three/drei";
import { suspend } from "suspend-react";

const cityEnv = import("@pmndrs/assets/hdri/city.exr");

export const BlockHorizontalSpikes = ({
  position = [0, 0, 0],
  geometries,
  materials,
}) => {
  const horizontalSpikesOne = useRef();
  const horizontalSpikesTwo = useRef();
  const audioRef = useRef();
  const [timeOffset] = useState(() => Math.random() * 2 * Math.PI);
  const spikeEnv = useEnvironment({ files: suspend(cityEnv).default });

  // in case comp renders multiple times, we want to keep the time from resetting
  let [time] = useState(() => 0);

  useFrame((state, delta) => {
    time += delta * 1.6;
    if (horizontalSpikesOne.current) {
      const speed = Math.sin(time + timeOffset) * 0.749 + 1.2;
      horizontalSpikesOne.current.setNextKinematicTranslation({
        x: speed,
        y: horizontalSpikesOne.current.translation().y,
        z: horizontalSpikesTwo.current.translation().z,
      });
    }
    if (horizontalSpikesTwo.current) {
      const speed = Math.sin(time + timeOffset) * 0.749 + 1.2;
      if (speed < 0.5 && audioRef?.current) {
        console.log("now");
        if (audioRef.current.isPlaying) return;
        audioRef.current.play();
      }
      horizontalSpikesTwo.current.setNextKinematicTranslation({
        x: -speed,
        y: horizontalSpikesTwo.current.translation().y,
        z: horizontalSpikesTwo.current.translation().z,
      });
    }
  });

  return (
    <group position={position}>
      <PositionalAudio
        ref={audioRef}
        url="/metal-clang.mp3"
        distance={0.1}
        loop={false}
      />
      <group position={[1.949, 1, 0]}>
        <RigidBody
          ref={horizontalSpikesOne}
          type="kinematicPosition"
          friction={0}
          restitution={0.2}
        >
          <CuboidCollider
            position={[-0.259, 0, 0]}
            args={[1, 0.3, 1]}
            rotation={[0, 0, Math.PI / 2]}
          />
          <mesh
            geometry={geometries.box}
            material={materials.obstacle}
            rotation={[0, 0, Math.PI / 2]}
            scale={[2, 0.1, 2]}
            castShadow
            receiveShadow
          />
          {new Array(7).fill().map((_, i) => (
            <SpikeRow
              key={Math.random() * i}
              position={[-0.3, 0, 0]}
              spikeX={-0.82 + i * 0.27}
              isVertical={false}
              horizontalRotation={Math.PI / 2}
              spikeEnv={spikeEnv}
            />
          ))}
        </RigidBody>
      </group>
      <group position={[-1.949, 1, 0]}>
        <RigidBody
          ref={horizontalSpikesTwo}
          type="kinematicPosition"
          friction={0}
          restitution={0.2}
        >
          <CuboidCollider
            position={[0.259, 0, 0]}
            args={[1, 0.3, 1]}
            rotation={[0, 0, Math.PI / 2]}
          />
          <mesh
            geometry={geometries.box}
            material={materials.obstacle}
            rotation={[0, 0, Math.PI / 2]}
            scale={[2, 0.1, 2]}
            castShadow
            receiveShadow
          />
          {new Array(7).fill().map((_, i) => (
            <SpikeRow
              key={Math.random() * i}
              position={[0.3, 0, 0]}
              spikeX={-0.82 + i * 0.27}
              isVertical={false}
              horizontalRotation={-Math.PI / 2}
              spikeEnv={spikeEnv}
            />
          ))}
        </RigidBody>
      </group>
      <mesh
        position={[0, -0.1, 0]}
        geometry={geometries.box}
        material={materials.floorMat2}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  );
};

BlockHorizontalSpikes.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
};
