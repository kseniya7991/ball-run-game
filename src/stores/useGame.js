import { create } from "zustand";

export default create((set) => {
    return {
        blocksCount: 3,

        // Phases
        phase: "ready",
        start: () => set((state) => (state.phase === "ready" ? { phase: "playing" } : {})),
        restart: () =>
            set((state) =>
                state.phase === "playing" || state.phase === "ended" ? { phase: "ready" } : {}
            ),

        end: () =>
            set((state) => state.phase === "playing" ? { phase: "ended" } : {}),
    };
});
