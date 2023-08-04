import { boxGeo, floorMat2, obstacleMat } from "../Level";
import VerticalSpikesDemo from "./VerticalSpikesDemo";

export default {
  title: "Traps/VerticalSpikesDemo",
  component: VerticalSpikesDemo,
};

export const Default = {
  args: {
    position: [0, 0, 0],
    geometries: {
      box: boxGeo,
    },
    materials: {
      obstacle: obstacleMat,
      floorMat2: floorMat2,
    },
  },
};
