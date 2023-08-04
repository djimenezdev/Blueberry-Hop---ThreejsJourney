import { Box, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { CuboidCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useGame from "./stores/useGame";
import { dampC } from "maath/easing";

const Player = () => {
  const player = useRef(null);
  const playerMesh = useRef(null);
  const platformMesh = useRef(null);
  const [subscribeKeys, getKeys] = useKeyboardControls();

  // world by default represents the actual physics world, no longer need to use world.raw()
  const { rapier, world } = useRapier();
  const [
    phase,
    setPhase,
    blocksCount,
    endTime,
    playerColor,
    setStartTime,
    setEndTime,
    setBlockSeed,
  ] = useGame((state) => [
    state.phase,
    state.setPhase,
    state.blocksCount,
    state.endTime,
    state.playerColor,
    state.setStartTime,
    state.setEndTime,
    state.setBlockSeed,
  ]);

  const [smoothedCameraPosition, setSmoothedCameraPosition] = useState(
    () => new THREE.Vector3(10, 10, 10)
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  useFrame(({ camera }, delta) => {
    if (phase !== "customizing") {
      const { forward, backward, left, right } = getKeys();

      const impulse = { x: 0, y: 0, z: 0 };
      const torque = { x: 0, y: 0, z: 0 };
      const impulseStrength = 0.6 * delta;
      const torqueStrength = 0.2 * delta;
      const bodyPosition = player.current.translation();
      if (bodyPosition.y < 1 && bodyPosition.y > 0.1) {
        if (forward) {
          impulse.z -= impulseStrength;
          torque.x -= torqueStrength;
        }
        if (backward) {
          impulse.z += impulseStrength;
          torque.x += torqueStrength;
        }
        if (left) {
          torque.z += torqueStrength;
          impulse.x -= impulseStrength;
        }
        if (right) {
          torque.z -= torqueStrength;
          impulse.x += impulseStrength;
        }
        player.current.applyImpulse(impulse);
        player.current.applyTorqueImpulse(torque);
      }

      const cameraPosition = new THREE.Vector3();
      cameraPosition.copy(bodyPosition);
      cameraPosition.z += 2.25;
      cameraPosition.y += 0.65;
      const cameraTarget = new THREE.Vector3();
      cameraTarget.copy(bodyPosition);
      cameraTarget.y += 0.25;
      if (bodyPosition.y < -4) {
        player.current.setTranslation({ x: 0, y: 1, z: 0 });
        // since we are applying impulses to the force as well as torque,
        // we need to reset the velocity since impulses impact velocity
        player.current.setLinvel({ x: 0, y: 0, z: 0 });
        player.current.setAngvel({ x: 0.0, y: 0.0, z: 0.0 });
      }

      smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
      smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

      camera.position.copy(smoothedCameraPosition);
      camera.lookAt(smoothedCameraTarget);
    } else {
      const playerBody = player.current.translation();

      const cameraPosition = new THREE.Vector3(0, 24, 0);
      smoothedCameraPosition.lerp(cameraPosition, delta * 1);
      camera.position.copy(smoothedCameraPosition);

      if (camera.position.y > 23) {
        if (playerBody.x === 3) {
          player.current.applyImpulse({ x: -0.2675, y: 0, z: 0 });
        }

        if (playerBody.x < 0.85 && playerBody.x > 0.8) {
          player.current.setLinearDamping(3.125);
        }
      }
    }
    dampC(playerMesh.current.material.color, playerColor, 0.1, delta);
    dampC(platformMesh.current.material.color, playerColor, 0.1, delta);
  });

  useEffect(() => {
    let jumpUnsub;
    if (phase !== "customizing") {
      jumpUnsub = subscribeKeys(
        (state) => {
          return state.jump;
        },
        (pressed) => {
          if (pressed) {
            console.log("jumping");
            const origin = player.current.translation();
            origin.y -= 0.31;
            const direction = { x: 0, y: -1, z: 0 };
            const ray = new rapier.Ray(origin, direction);

            // the 10 refers to the max distance for the ray
            // the third param is set to true to say everything
            // it interacts with is solid, to trigger not just at the points
            const hit = world.castRay(ray, 10, true);

            if (hit.toi < 0.15) {
              player.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
            }
          }
        }
      );
    }

    return () => {
      if (jumpUnsub) {
        jumpUnsub();
      }
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "ready") {
      player.current.setLinearDamping(0.5);
      player.current.setTranslation({ x: 0, y: 1, z: 0 });
      player.current.setLinvel({ x: 0, y: 0, z: 0 });
      player.current.setAngvel({ x: 0.0, y: 0.0, z: 0.0 });
      setSmoothedCameraPosition(new THREE.Vector3(10, 10, 10));
    }
    if (phase === "customizing") {
      player.current.setTranslation({ x: 3, y: 24.5, z: -2 });
      player.current.setLinvel({ x: 0, y: 0, z: 0 });
      player.current.setAngvel({ x: 0.0, y: 0.0, z: 0.0 });
      setSmoothedCameraPosition(new THREE.Vector3(0, 0, 0));
      // camera.position.set(0, 24, 0);
    }
  }, [phase]);

  return (
    <>
      <RigidBody
        position={[0, 23, 0]}
        friction={1}
        restitution={0}
        type="fixed"
        colliders="cuboid"
      >
        <Box args={[10, 0.3, 10]} ref={platformMesh} receiveShadow>
          <meshStandardMaterial />
        </Box>
      </RigidBody>
      <RigidBody type="kinematicPosition">
        <CuboidCollider
          args={[2, 1, 0.001]}
          position={[0, 1, -2]}
          name="startGameSensor"
          sensor
          onIntersectionEnter={() => {
            if (phase === "ready") {
              setStartTime(Date.now());
              setPhase("playing");
            }
          }}
        />
        <CuboidCollider
          args={[2, 1, 0.001]}
          position={[0, 1, 2]}
          name="fallSensor"
          sensor
          onIntersectionEnter={async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setBlockSeed(Math.floor(Math.random() * 40));
          }}
        />
        <CuboidCollider
          args={[2, 1, 0.001]}
          position={[0, 1, -(blocksCount + 1) * 4 + 2]}
          name="endGameSensor"
          sensor
          onIntersectionEnter={() => {
            if (phase === "playing") setPhase("ended");
            if (endTime === 0) setEndTime(Date.now());
          }}
        />
      </RigidBody>
      <RigidBody
        ref={player}
        type="dynamic"
        canSleep={false}
        restitution={0.2}
        linearDamping={0.5}
        angularDamping={0.5}
        friction={1}
        position={[0, 0, 0]}
        colliders="ball"
      >
        <mesh ref={playerMesh} castShadow>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial flatShading color="mediumpurple" />
        </mesh>
      </RigidBody>
    </>
  );
};
export default Player;
