import { create } from "zustand";

const useGame = create((set) => ({
  blocksCount: 7,
  blockSeed: 0,
  phase: "start",
  startTime: 0,
  endTime: 0,
  playerColor: "mediumpurple",
  enableAudio: false,
  setPhase: (phase) => set({ phase }),
  setBlockSeed: (blockSeed) => set({ blockSeed }),
  setBlocksCount: (blocksCount) => set({ blocksCount }),
  setStartTime: (startTime) => set({ startTime }),
  setEndTime: (endTime) => set({ endTime }),
  setPlayerColor: (playerColor) => set({ playerColor }),
  setEnableAudio: (enableAudio) => set({ enableAudio }),
}));

export default useGame;
