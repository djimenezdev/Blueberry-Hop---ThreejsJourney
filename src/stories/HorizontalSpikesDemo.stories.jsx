import HorizontalSpikesDemo from "./HorizontalSpikesDemo";
import { floorMat2, boxGeo, obstacleMat } from "../Level";

export default {
  title: "Traps/HorizontalSpikesDemo",
  component: HorizontalSpikesDemo,
};

export const Default = {
  args: {
    materials: {
      floorMat2: floorMat2,
      obstacle: obstacleMat,
    },
    geometries: {
      box: boxGeo,
    },
  },
};
