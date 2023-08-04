import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import PropTypes from "prop-types";
import { BlockVerticalSpikes } from "../components/traps/BlockVerticalSpikes";
import Lights from "../Lights";
import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";

const VerticalSpikesDemo = ({
  position = [0, 0, 0],
  geometries,
  materials,
}) => {
  // setup canvas and render in the BlockVerticalSpikes component
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [4, 0.5, 6],
        }}
      >
        <Physics debug={true} colliders={false}>
          <Perf />
          <OrbitControls makeDefault />
          <BlockVerticalSpikes
            position={position}
            geometries={geometries}
            materials={materials}
          />
        </Physics>
        <Lights />
      </Canvas>
    </div>
  );
};
export default VerticalSpikesDemo;

VerticalSpikesDemo.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  geometries: PropTypes.object,
  materials: PropTypes.object,
};
