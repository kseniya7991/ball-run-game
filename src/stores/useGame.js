import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import { BlockLimbo } from "../Level/BlockLimbo";
import { BlockAxe } from "../Level/BlockAxe";
import { BlockSpinner } from "../Level/BLockSpinner";
import { BlockLava } from "../Level/BlockLava";
import { BlockNarrow } from "../Level/BlockNarrow";
import { BlockSeesaw } from "../Level/BlockSeesaw";

export const blockFunctions = {
    BlockSpinner: {
        component: BlockSpinner,
        length: 4,
    },
    BlockLimbo: {
        component: BlockLimbo,
        length: 4,
    },
    BlockAxe: {
        component: BlockAxe,
        length: 4,
    },
    BlockLava: {
        component: BlockLava,
        length: 4,
    },
    BlockNarrow: {
        component: BlockNarrow,
        length: 4,
    },
    BlockSeesaw: {
        component: BlockSeesaw,
        length: 8,
    },
};

const initialConfig = {
    1: {
        blocks: 1,
        types: ["BlockLava"],
        finalLength: 0,
        finalBlocks: [],
    },
    2: {
        blocks: 2,
        types: ["BlockAxe"],
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

const calcNewConfig = () => {
    const newConfig = { ...initialConfig };
    Object.entries(newConfig).forEach(([key, configKey]) => {
        const { blocks, types } = configKey;
        if (!blocks || !types?.length) return;
        Array.from({ length: blocks }, () => {
            const block = blockFunctions[types[Math.floor(Math.random() * types.length)]];
            newConfig[key].finalLength += block.length;
            newConfig[key].finalBlocks.push(block.component);
        });
    });
    return newConfig;
};

export default create(
    subscribeWithSelector((set) => {
        return {
            // Sound
            soundEnabled: localStorage.getItem("soundEnabled") === "true",
            toggleSound: () =>
                set((state) => {
                    const nextValue = !state.soundEnabled;
                    localStorage.setItem("soundEnabled", nextValue);
                    return { soundEnabled: nextValue };
                }),

            // Theme
            theme: localStorage.getItem("gameTheme") ?? "dark",
            toggleTheme: (val) =>
                set((state) => {
                    localStorage.setItem("gameTheme", val);
                    return { theme: val };
                }),

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
            startBurning: (val) => set({ isBurning: true }),
            endBurning: (val) => set({ isBurning: false }),

            // Levels
            currentLevel: 1,
            levels: 0,

            setLevels: (val) => set({ levels: val }),

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

            // Lives
            lives: 3,
            maxLives: 3,

            // Phases
            phase: "ready",
            isLastTry: false,

            start: () => set((state) => (state.phase === "ready" ? { phase: "playing" } : {})),
            restart: () =>
                set((state) =>
                    state.phase !== "ready" ? { phase: "ready", blocksSeed: Math.random() } : {}
                ),
            end: () => set((state) => (state.phase === "playing" ? { phase: "ended" } : {})),
            fail: () => set((state) => (state.phase === "playing" ? { phase: "failed" } : {})),
            finish: () => set((state) => (state.phase !== "finished" ? { phase: "finished" } : {})),
            final: () => set((state) => (state.phase === "finished" ? { phase: "finalized" } : {})),

            updateLivesOnFail: () =>
                set((state) => {
                    const nextLives = state.lives - 1 < 0 ? state.maxLives : state.lives - 1;
                    const isLastTry = nextLives === 0;
                    return isLastTry
                        ? { lives: nextLives, isLastTry: true }
                        : { lives: nextLives, isLastTry: false };
                }),

            updateLevelOnFail: () =>
                set((state) => {
                    const nextLevel = state.isLastTry ? 1 : state.currentLevel;
                    const nextLives =
                        nextLevel === 1 && state.isLastTry ? state.maxLives : state.lives;
                    return { currentLevel: nextLevel, lives: nextLives };
                }),

            // Config
            config: calcNewConfig(),
        };
    })
);
