import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export default create(
    subscribeWithSelector((set) => {
        return {
            blocksSeed: 0,

            /**
             * Blocks count
             */
            blocksCount: 1,

            
            /**
             * Level Length
             */

            levelLength: 0,
            updateLevelLength: (val) =>
                set((state) => {
                    return { levelLength: val };
                }),

            /**
             * Burning
             */
            isBurning: false,
            startBurning: () =>
                set((state) => {
                    return { isBurning: true };
                }),
            endBurning: () =>
                set((state) => {
                    return { isBurning: false };
                }),

            /**
             * Levels
             */
            currentLevel: 1,
            levels: 5,
            nextLevel: () =>
                set((state) => {
                    return state.phase === "playing"
                        ? {
                              currentLevel:
                                  state.currentLevel + 1 <= state.levels
                                      ? state.currentLevel + 1
                                      : 1,
                          }
                        : {};
                }),

            /**
             * Lives
             */
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

            /**
             * Time
             */
            startTime: 0,
            endTime: 0,

            /**
             * Phases
             */
            phase: "ready",
            start: () =>
                set((state) =>
                    state.phase === "ready" ? { phase: "playing", startTime: Date.now() } : {}
                ),
            restart: () =>
                set((state) =>
                    state.phase === "playing" || state.phase === "ended" || state.phase === "failed"
                        ? { phase: "ready", blocksSeed: Math.random() }
                        : {}
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
        };
    })
);
