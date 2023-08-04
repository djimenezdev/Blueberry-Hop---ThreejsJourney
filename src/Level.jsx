import { Box, Float, Text, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody, quat } from "@react-three/rapier";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import useGame from "./stores/useGame";
import { damp } from "three/src/math/MathUtils";
import { BlockVerticalSpikes } from "./components/traps/BlockVerticalSpikes";
import { BlockHorizontalSpikes } from "./components/traps/BlockHorizontalSpikes";

export const boxGeo = new THREE.BoxGeometry(1, 1, 1);
export const floorMat1 = new THREE.MeshStandardMaterial({
  color: "limegreen",
});
export const floorMat2 = new THREE.MeshStandardMaterial({
  color: "greenyellow",
});
export const obstacleMat = new THREE.MeshStandardMaterial({
  color: "orangered",
});
export const wallMaterial = new THREE.MeshStandardMaterial({
  color: "slategrey",
});

const cylinderGeo = new THREE.CylinderGeometry(0, 0.234, 1, 32);

const BlockStart = ({ position = [0, 0, 0] }) => {
  return (
    <>
      <group position={position}>
        <mesh
          geometry={boxGeo}
          material={floorMat1}
          scale={[4, 0.2, 4]}
          position={[0, -0.1, 0]}
          receiveShadow
        />
      </group>
    </>
  );
};

export const BlockSpinner = ({ position = [0, 0, 0] }) => {
  const spinner = useRef();
  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
  );

  useFrame((state, delta) => {
    if (spinner.current) {
      const current = quat(spinner.current.rotation());
      const updateRotation = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        delta * speed
      );
      const newRotation = current.multiply(updateRotation);
      spinner.current.setNextKinematicRotation(newRotation);
    }
  });
  return (
    <group position={position}>
      <RigidBody ref={spinner} type="kinematicPosition" colliders="cuboid">
        <mesh
          geometry={boxGeo}
          material={obstacleMat}
          scale={[3.5, 0.1, 0.2]}
          position={[0, 0.25, 0]}
          castShadow
          receiveShadow
        />
      </RigidBody>
      <mesh
        geometry={boxGeo}
        material={floorMat2}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  );
};

export const BlockLimbo = ({ position = [0, 0, 0] }) => {
  const limbo = useRef();
  const [timeOffset] = useState(() => Math.random() * 2 * Math.PI);

  useFrame((state, delta) => {
    const speed = Math.sin(state.clock.elapsedTime + timeOffset) + 1.15;
    if (limbo.current) {
      limbo.current.setNextKinematicTranslation({
        x: 0,
        y: speed,
        z: position[2],
      });
    }
  });

  return (
    <group position={position}>
      <RigidBody
        ref={limbo}
        position={[0, 0.3, 0]}
        type="kinematicPosition"
        colliders="cuboid"
      >
        <mesh
          geometry={boxGeo}
          material={obstacleMat}
          scale={[3.5, 0.1, 0.2]}
          castShadow
          receiveShadow
        />
      </RigidBody>
      <mesh
        position={[0, -0.1, 0]}
        geometry={boxGeo}
        material={floorMat2}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  );
};

export const BlockAxe = ({ position = [0, 0, 0] }) => {
  const axe = useRef();
  const [timeOffset] = useState(() => Math.random() * 2 * Math.PI);

  useFrame((state, delta) => {
    const speed = Math.cos(state.clock.elapsedTime + timeOffset) * 1.25;

    if (axe.current) {
      axe.current.setNextKinematicTranslation({
        x: speed,
        y: 0.7,
        z: position[2],
      });
    }
  });

  return (
    <group position={position}>
      <RigidBody
        ref={axe}
        position={[0, 0.7, 0]}
        type="kinematicPosition"
        colliders="cuboid"
      >
        <mesh
          geometry={boxGeo}
          material={obstacleMat}
          scale={[1.5, 1.2, 0.2]}
          castShadow
          receiveShadow
        />
      </RigidBody>
      <mesh
        position={[0, -0.1, 0]}
        geometry={boxGeo}
        material={floorMat2}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  );
};

const Hamburger = (props) => {
  const { nodes, materials } = useGLTF("/hamburger.glb");
  return (
    <group {...props} dispose={null}>
      <RigidBody
        position={[0, 0.25, 0]}
        type="fixed"
        colliders="hull"
        restitution={0.2}
        friction={0}
      >
        <mesh
          castShadow
          geometry={nodes.bottomBun.geometry}
          material={materials.BunMaterial}
        />
        <mesh
          castShadow
          geometry={nodes.meat.geometry}
          material={materials.SteakMaterial}
          position={[0, 2.817, 0]}
        />
        <mesh
          castShadow
          geometry={nodes.cheese.geometry}
          material={materials.CheeseMaterial}
          position={[0, 3.04, 0]}
        />
        <mesh
          castShadow
          geometry={nodes.topBun.geometry}
          material={materials.BunMaterial}
          position={[0, 1.771, 0]}
        />
      </RigidBody>
    </group>
  );
};

const BlockEnd = ({ position = [0, 0, 0] }) => {
  // const
  return (
    <>
      <group position={position}>
        <Hamburger scale={0.15} position-y={0.06} />
        <mesh
          geometry={boxGeo}
          material={floorMat1}
          scale={[4, 0.2, 4]}
          position={[0, 0, 0]}
          receiveShadow
        />
      </group>
    </>
  );
};

useGLTF.preload("/hamburger.glb");

const Bounds = ({ length = 1 }) => {
  return (
    <group>
      <RigidBody type="fixed" colliders="cuboid" restitution={0.2} friction={0}>
        <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, -0.1, -(length * 2) + 2]}
          restitution={0.2}
          friction={1}
        />
        <mesh
          geometry={boxGeo}
          material={wallMaterial}
          position={[2.1, 1, -(length * 2) + 2]}
          scale={[0.2, 2, length * 4]}
          castShadow
        />
        <mesh
          geometry={boxGeo}
          material={wallMaterial}
          position={[-2.1, 1, -(length * 2) + 2]}
          scale={[0.2, 2, length * 4]}
          receiveShadow
        />
        <mesh
          geometry={boxGeo}
          material={wallMaterial}
          position={[0, 1, -(length * 4) + 2]}
          scale={[4, 2, 0.3]}
          receiveShadow
        />
      </RigidBody>
    </group>
  );
};

export const EndText = ({ count }) => {
  const endText = useRef();
  const phase = useGame((state) => state.phase);
  useFrame((state, delta) => {
    if (endText.current) {
      if (phase === "ended") {
        const updatedOpacity = damp(
          endText.current.material.opacity,
          1,
          0.8,
          delta
        );
        endText.current.material.opacity = updatedOpacity;
      } else {
        if (endText.current.material.opacity > 0) {
          endText.current.material.opacity = damp(
            endText.current.material.opacity,
            0,
            1.5,
            delta
          );
        }
      }
    }
  });
  return (
    <Float rotationIntensity={0.05} floatIntensity={0.5}>
      <Text
        ref={endText}
        font="/bebas-neue-v9-latin-regular.woff"
        fontSize={0.2}
        maxWidth={0.2}
        position={[0, 1.25, -(count + 1) * 4]}
        lineHeight={0.975}
      >
        Finished!
        <meshBasicMaterial opacity={0} toneMapped={false} />
      </Text>
    </Float>
  );
};

export const Level = ({
  count = 5,
  types = [
    BlockSpinner,
    BlockLimbo,
    BlockAxe,
    BlockVerticalSpikes,
    BlockHorizontalSpikes,
  ],
  seed = 0,
}) => {
  const levels = useMemo(() => {
    return new Array(count).fill("").map((_, i) => {
      const Block = types[Math.floor(Math.random() * types.length)];
      return Block;
    });
  }, [count, types, seed]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {levels.map((Block, i) => (
        <Block
          key={i}
          position={[0, 0, -4 * (i + 1)]}
          rotation={[0, 0, 0]}
          geometries={{
            box: boxGeo,
          }}
          materials={{ obstacle: obstacleMat, floorMat2: floorMat2 }}
        />
      ))}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
      <EndText count={count} />
    </>
  );
};
