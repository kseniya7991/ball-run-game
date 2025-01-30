import * as THREE from "three";
import { useMemo, useEffect } from "react";
import useGame from "../stores/useGame";
import { Sky } from "@react-three/drei";

import { BlockStart } from "./BlockStart";
import { BlockEnd } from "./BlockEnd";
import { BlockLimbo } from "./BlockLimbo";
import { BlockAxe } from "./BlockAxe";
import { BlockSpinner } from "./BLockSpinner";
import { BlockLava } from "./BlockLava";
import { BlockNarrow } from "./BlockNarrow";
import { BlockSeesaw } from "./BlockSeesaw";

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

export const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
export const levelMaterials = {
    floor1: new THREE.MeshStandardMaterial({ color: "limegreen" }),
    floor2: new THREE.MeshStandardMaterial({ color: "greenyellow" }),
    obstacle: new THREE.MeshStandardMaterial({ color: "mediumpurple" }),
    lava: new THREE.MeshStandardMaterial({ color: "#FF6600" }),
};

export function Level({ count = 5, seed = 0, config }) {
    let positionZ = 0;
    let length = 0;

    const updateLevelLength = useGame((state) => state.updateLevelLength);
    const currentLevel = useGame.getState().currentLevel;
    const availableTypes = config[currentLevel].types;

    const blocks = useMemo(
        () =>
            Array.from({ length: config[currentLevel].blocks }, () => {
                const block =
                    blockFunctions[
                        availableTypes[Math.floor(Math.random() * availableTypes.length)]
                    ];

                length += block.length;
                return block.component;
            }),
        [count, seed, config]
    );

    useEffect(() => {
        updateLevelLength(length);
    }, [length]);

    return (
        <>
            <BlockStart position={[0, 0, 0]} />

            <Sky
                distance={450000}
                sunPosition={[1, config[currentLevel].sky.sunY, 1]}
                mieCoefficient={0.0}
                mieDirectionalG={0.1} 
                rayleigh={config[currentLevel].sky.rayleigh}
                turbidity={config[currentLevel].sky.turbidity} 
            />

             {blocks.map((Block, i) => {
                if (Block.name === "BlockSeesaw") {
                    let posZ = positionZ - 6;
                    positionZ += -8;

                    return <Block key={Date.now() + i} position={[0, 0, posZ]} />;
                } else {
                    positionZ += -4;
                    return <Block key={Date.now() + i} position={[0, 0, positionZ]} />;
                }
            })} 

            <BlockEnd position={[0, 0, positionZ - 4]} key={positionZ} />
        </>
    );
}
