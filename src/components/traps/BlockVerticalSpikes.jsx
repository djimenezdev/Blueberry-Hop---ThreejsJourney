import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import PropTypes from "prop-types";
import SpikeRow from "./SpikeRow";
import { useEnvironment } from "@react-three/drei";
import { suspend } from "suspend-react";
const cityEnv = import("@pmndrs/assets/hdri/city.exr");

export const BlockVerticalSpikes = ({
  position = [0, 0, 0],
  geometries,
  materials,
}) => {
  const verticalSpikes = useRef();
  const [timeOffset] = useState(() => Math.random() * 2 * Math.PI);
  const spikeEnv = useEnvironment({ files: suspend(cityEnv).default });

  let [time] = useState(0);

  useFrame((state, delta) => {
    time += delta * 1.6;
    const speed = Math.sin(time + timeOffset) + 1.55;
    if (verticalSpikes.current) {
      verticalSpikes.current.setNextKinematicTranslation({
        x: 0,
        y: speed,
        z: position[2],
      });
    }
  });

  return (
    <group position={position}>
      <RigidBody
        ref={verticalSpikes}
        type="kinematicPosition"
        position={[0, 2, 0]}
        friction={0}
        restitution={0.2}
      >
        <CuboidCollider position={[0, -0.25, 0]} args={[1.35, 0.3, 1.35]} />
        <mesh
          geometry={geometries.box}
          material={materials.obstacle}
          scale={[3, 0.1, 3]}
          castShadow
          receiveShadow
        />
        {/* create instance mesh since we will have multiple spikes with same material and geo */}
        {new Array(8).fill().map((_, i) => (
          <SpikeRow
            position={[0, -0.3, 0]}
            spikeX={i === 0 ? -1.25 : -1.25 + i * 0.35}
            spikeEnv={spikeEnv}
          />
        ))}
      </RigidBody>
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

BlockVerticalSpikes.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  geometries: PropTypes.object,
  materials: PropTypes.object,
};
