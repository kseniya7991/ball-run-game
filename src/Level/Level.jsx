import * as THREE from "three";
import { useMemo, useEffect } from "react";
import useGame from "../stores/useGame";

import { BlockStart } from "./BlockStart";
import { BlockEnd } from "./BlockEnd";
import { BlockLimbo } from "./BlockLimbo";
import { BlockAxe } from "./BlockAxe";
import { Walls } from "./Walls";
import { BlockSpinner } from "./BLockSpinner";
import { BlockLava } from "./BlockLava";
import { BlockNarrow } from "./BlockNarrow";
import { BlockSeesaw } from "./BlockSeesaw";

export const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
export const levelMaterials = {
    floor1: new THREE.MeshStandardMaterial({ color: "limegreen" }),
    floor2: new THREE.MeshStandardMaterial({ color: "greenyellow" }),
    obstacle: new THREE.MeshStandardMaterial({ color: "mediumpurple" }),
    wall: new THREE.MeshStandardMaterial({ color: "#798e95" }),
    lava: new THREE.MeshStandardMaterial({ color: "#FF6600" }),
};

export function Level({
    count = 5,
    types = [BlockSpinner, BlockLimbo, BlockAxe, BlockLava, BlockNarrow, BlockSeesaw],
    seed = 0,
}) {
    let positionZ = 0;
    let length = 0;
    const updateLevelLength = useGame((state) => state.updateLevelLength);
    const blocks = useMemo(
        () =>
            Array.from({ length: count }, () => {
                let multiplier = 1;
                const block = types[Math.floor(Math.random() * types.length)];
                if (block.name === "BlockSeesaw") {
                    multiplier = 2;
                }
                length += 4 * multiplier;
                return block;
            }),
        [count, types, seed]
    );

    useEffect(() => {
        console.log("update level length", length, positionZ - 4);
        updateLevelLength(length);
    }, [length]);

    return (
        <>
            <BlockStart position={[0, 0, 0]} />

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
            <Walls length={count + 2} />
        </>
    );
}
