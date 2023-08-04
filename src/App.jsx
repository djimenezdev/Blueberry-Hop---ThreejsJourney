import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import { Perf } from "r3f-perf";
import { Physics } from "@react-three/rapier";
import { KeyboardControls } from "@react-three/drei";
import Interface from "./Interface";
import { folder, useControls } from "leva";

const App = () => {
  const { perfShow, physicsDebug } = useControls({
    debug: folder({
      perfShow: true,
      physicsDebug: false,
    }),
  });

  return (
    <KeyboardControls
      map={[
        {
          name: "forward",
          keys: ["KeyW", "ArrowUp"],
        },
        {
          name: "backward",
          keys: ["KeyS", "ArrowDown"],
        },
        {
          name: "left",
          keys: ["KeyA", "ArrowLeft"],
        },
        {
          name: "right",
          // can use d or KeyD with qwerty keyboards but if its not, use Key format instead
          keys: ["KeyD", "ArrowRight"],
        },
        {
          name: "jump",
          keys: ["Space"],
        },
      ]}
    >
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [0, -10, 0],
        }}
      >
        {perfShow && <Perf position="top-left" />}
        <Physics debug={physicsDebug} colliders={false}>
          <Experience />
        </Physics>
      </Canvas>
      <Interface />
    </KeyboardControls>
  );
};
export default App;
