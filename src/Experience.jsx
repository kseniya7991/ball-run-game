import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import { Level } from "./Level/Level.jsx";
import { Physics } from "@react-three/rapier";
import Player from "./Player";
import useGame from "./stores/useGame";
import World from "./World";
import { useMemo, useEffect, useState, useCallback } from "react";
import React from "react";
import { Perf } from "r3f-perf";

import { BlockLimbo } from "./Level/BlockLimbo";
import { BlockAxe } from "./Level/BlockAxe";
import { BlockSpinner } from "./Level/BLockSpinner";
import { BlockLava } from "./Level/BlockLava";
import { BlockNarrow } from "./Level/BlockNarrow";
import { BlockSeesaw } from "./Level/BlockSeesaw";
import { LavaSparkles } from "./Level/LavaSparkles";

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

export default function Experience() {
    const [phase, setPhase] = useState(null);

    const blocksCount = useGame((state) => state.blocksCount);
    const blocksSeed = useGame((state) => state.blocksSeed);

    const config = useGame((state) => state.config);
    const updateConfig = useGame((state) => state.updateConfig);
    const isConfigReady = useGame((state) => state.isConfigReady);

    const levels = useGame.getState().levels;
    const updateFinalLevelLength = useGame((state) => state.updateFinalLevelLength);

    useEffect(() => {
        const newConfig = { ...config };
        Object.entries(newConfig).forEach(([key, configKey]) => {
            const { blocks, types } = configKey;
            if (!blocks || !types?.length) return;
            Array.from({ length: blocks }, () => {
                const block = blockFunctions[types[Math.floor(Math.random() * types.length)]];
                newConfig[key].finalLength += block.length;
                newConfig[key].finalBlocks.push(block.component);
            });
        });
        updateConfig(newConfig);
        updateFinalLevelLength(useGame.getState().config[levels]?.finalLength);

        return () => {
            updateConfig(config);
        };
    }, []);

    const ballsData = useMemo(() => {
        const data = [];

        for (let ball = 0; ball < 50; ball++) {
            const position = [
                Math.random() * 3.5 - 1.75,
                1 + ball * 0.1,
                Math.random() * 3.5 - 1.75,
            ];
            const hue = Math.random() * 360;
            data.push({
                key: ball,
                position,
                color: `hsl(${hue}, 50%, 50%)`,
            });
        }
        return data;
    }, []);

    const handlePhaseChange = useCallback(
        (value) => {
            if (value === "finished") {
                setTimeout(() => {
                    setPhase(value);
                }, 3000);
            }
            // if (value === "ready" && phase === "finished") {
            //     setPhase(value);
            // }
        },
        [phase]
    );

    useEffect(() => {
        const unsubscribePhase = useGame.subscribe((state) => state.phase, handlePhaseChange);

        return () => {
            unsubscribePhase();
        };
    }, [handlePhaseChange]);

    /**
     * TODO 1. Сделать темную/светлую тему:
     * TODO переключать пол, фон, туман, цвет бокса
     */

    return (
        <>
            <Perf position="top-left" />
            <OrbitControls makeDefault />

            <color args={["#bdedfc"]} attach="background" />
            {/* <color args={["#242424"]} attach="background" /> */}
            <color args={["#191920"]} attach="background" />

            <Physics>
                <Lights isFinish={phase === "finished"} />
                {phase !== "finished" && (
                    <>
                        <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <planeGeometry args={[500, 500]} />
                            <meshBasicMaterial color="#191920" toneMapped={false} />
                        </mesh>
                        <Level count={blocksCount} seed={blocksSeed} config={config} />
                    </>
                )}

                {isConfigReady && <World ballsData={ballsData} />}

                <Player />
            </Physics>
        </>
    );
}
