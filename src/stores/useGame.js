import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const initialConfig = {
    1: {
        blocks: 1,
        types: ["BlockAxe"],
        finalLength: 0,
        finalBlocks: [],
    },
    2: {
        blocks: 8,
        types: ["BlockSpinner", "BlockLimbo", "BlockAxe", "BlockLava"],
        finalLength: 0,
        finalBlocks: [],
    },
    // 3: {
    //     blocks: 10,
    //     types: ["BlockSpinner", "BlockLimbo", "BlockAxe", "BlockNarrow", "BlockLava"],
    //     finalLength: 0,
    //     finalBlocks: [],
    // },
    // 4: {
    //     blocks: 12,
    //     types: [
    //         "BlockSpinner",
    //         "BlockLimbo",
    //         "BlockAxe",
    //         "BlockNarrow",
    //         "BlockLava",
    //         "BlockSeesaw",
    //     ],
    //     finalLength: 0,
    //     finalBlocks: [],
    // },
    // 5: {
    //     blocks: 15,
    //     types: [
    //         "BlockSpinner",
    //         "BlockLimbo",
    //         "BlockAxe",
    //         "BlockNarrow",
    //         "BlockNarrow",
    //         "BlockLava",
    //         "BlockLava",
    //         "BlockSeesaw",
    //         "BlockSeesaw",
    //     ],
    //     finalLength: 0,
    //     finalBlocks: [],
    // },
};

export default create(
    subscribeWithSelector((set) => {
        return {
            // Sound
            soundEnabled: localStorage.getItem("soundEnabled") === "true",
            toggleSound: () => set((state) => {
                const nextValue = !state.soundEnabled;
                localStorage.setItem("soundEnabled", nextValue);
                return { soundEnabled: nextValue };
            }),

            // Theme
            theme: "dark",
            toggleTheme: (val) => set({ theme: val }),

            blocksSeed: 0,

            // Blocks count
            blocksCount: 1,

            // Level length
            finalLevelLength: 0,
            levelLength: 0,
            updateLevelLength: (val) =>
                set((state) => {
                    return { levelLength: val };
                }),
            updateFinalLevelLength: (val) =>
                set((state) => {
                    return { finalLevelLength: val };
                }),

            // Burning
            isBurning: false,
            startBurning: () =>
                set((state) => {
                    return { isBurning: true };
                }),
            endBurning: () =>
                set((state) => {
                    return { isBurning: false };
                }),

            // Levels
            currentLevel: 1,
            levels: 0,

            setLevels: (val) =>
                set((state) => {
                    return { levels: val };
                }),

            nextLevel: () =>
                set((state) => {
                    return state.phase === "ready"
                        ? {
                              currentLevel:
                                  state.currentLevel + 1 <= state.levels
                                      ? state.currentLevel + 1
                                      : 1,
                          }
                        : {};
                }),

            resetLevels: () =>
                set((state) => {
                    return { currentLevel: 1 };
                }),

            // Lives
            lives: 3,
            maxLives: 3,

            resetLives: () =>
                set((state) => {
                    return { lives: state.maxLives };
                }),

            increaseLives: () =>
                set((state) => {
                    return {
                        lives: state.lives + 1 <= state.maxLives ? state.lives + 1 : state.maxLives,
                    };
                }),

            // Time
            startTime: 0,
            endTime: 0,

            // Phases
            phase: "ready",
            start: () =>
                set((state) =>
                    state.phase === "ready" ? { phase: "playing", startTime: Date.now() } : {}
                ),
            restart: () =>
                set((state) =>
                    state.phase !== "ready" ? { phase: "ready", blocksSeed: Math.random() } : {}
                ),
            end: () =>
                set((state) =>
                    state.phase === "playing" ? { phase: "ended", endTime: Date.now() } : {}
                ),

            fail: () =>
                set((state) => {
                    const nextLives = state.lives - 1 < 0 ? state.maxLives : state.lives - 1;
                    const nextLevel = state.lives - 1 < 0 ? 1 : state.currentLevel;
                    return state.phase === "playing"
                        ? {
                              phase: "failed",
                              endTime: Date.now(),
                              lives: nextLives,
                              currentLevel: nextLevel,
                          }
                        : {};
                }),

            finish: () =>
                set((state) => {
                    return state.phase !== "finished" ? { phase: "finished" } : {};
                }),

            // Config
            config: initialConfig,
            isConfigReady: false,
            updateConfig: (newConfig) =>
                set((state) => {
                    return { config: newConfig, isConfigReady: true };
                }),
        };
    })
);
