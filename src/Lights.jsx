import { useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { DirectionalLightHelper } from "three";

export default function Lights() {
  const directionalLight = useRef(null);

  // useHelper(directionalLight, DirectionalLightHelper, 1, "blue");

  useFrame(({ camera }) => {
    directionalLight.current.position.z = camera.position.z - 3;
    directionalLight.current.target.position.z = camera.position.z - 4;
    // need to update targets matrix(refers to objects transformations) world manually since target is not apart of scene
    directionalLight.current.target.updateMatrixWorld();
  });

  return (
    <>
      <directionalLight
        ref={directionalLight}
        castShadow
        position={[4, 4, 1]}
        intensity={1.5}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={10}
        shadow-camera-right={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
      />
      <ambientLight intensity={0.5} />
    </>
  );
}
