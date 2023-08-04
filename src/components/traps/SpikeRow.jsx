import {
  Environment,
  Instance,
  Instances,
  useTexture,
} from "@react-three/drei";

const SpikeRow = ({
  position,
  spikeX,
  isVertical = true,
  horizontalRotation,
  spikeEnv,
}) => {
  return (
    <>
      <group
        position={position}
        rotation={[0, 0, isVertical ? Math.PI : horizontalRotation]}
      >
        <Instances limit={8}>
          <cylinderGeometry args={[0, 0.1, 0.5, 32]} />
          <meshBasicMaterial
            color={0xa3a3a3}
            envMap={spikeEnv}
            envMapIntensity={2}
          />
          {new Array(7).fill().map((_, i) => (
            <Instance
              key={i * Math.random()}
              position={[spikeX, 0, -0.83 + i * 0.28]}
              castShadow
              receiveShadow
            />
          ))}
        </Instances>
      </group>
    </>
  );
};

export default SpikeRow;
