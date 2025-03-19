import { useEffect, useState } from "react";
import useGame from "../stores/useGame";
import { BlockStart } from "./BlockStart";
import { BlockEnd } from "./BlockEnd";

import * as THREE from "three";
import { Floor } from "./Floor";

export const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
export const levelMaterials = {
    accentFloor: new THREE.MeshStandardMaterial({ color: "#336D82" }),
    floor: new THREE.MeshStandardMaterial({ color: "#69868e" }),
    obstacle: new THREE.MeshStandardMaterial({ color: "mediumpurple" }),
    lava: new THREE.MeshStandardMaterial({ color: "#FF6600" }),
};

export function Level() {
    let positionZ = 0;
    let holisticFloor = 0;

    const updateLevelLength = useGame((state) => state.updateLevelLength);
    const currentLevel = useGame((state) => state.currentLevel);
    const finalLevelLength = useGame((state) => state.finalLevelLength);
    const finalConfig = useGame.getState().config;

    const finalBlocks = finalConfig[currentLevel]?.finalBlocks;
    const levelLength = finalConfig[currentLevel]?.finalLength;

    useEffect(() => {
        updateLevelLength(levelLength);
    }, [levelLength]);

    return (
        <>
            <BlockStart position={[0, 0, finalLevelLength]} key={finalLevelLength} />

            {/* {finalBlocks.map((Block, i) => {
                const prevHolisticFloor = holisticFloor;
                let needAddFloor = false;
                if (
                    Block.name !== "BlockSeesaw" &&
                    Block.name !== "BlockLava" &&
                    Block.name !== "BlockNarrow"
                ) {
                    holisticFloor += 1;
                } else {
                    holisticFloor = 0;
                }

                if (prevHolisticFloor > 0 && holisticFloor === 0) needAddFloor = true;

                if (Block.name === "BlockSeesaw") {
                    let posZ = positionZ - 6;
                    positionZ += -8;

                    return (
                        <>
                            <Block
                                key={Date.now() + i}
                                position={[0, 0, posZ + finalLevelLength]}
                            />
                             <Floor
                                key={Date.now() * (i + 1)}
                                scale={[4, 0.2, 4 * prevHolisticFloor]}
                                position={[
                                    0,
                                    0.1,
                                    posZ + finalLevelLength + (4 * prevHolisticFloor) / 2,
                                ]}
                            /> 
                        </>
                    );
                } else {
                    positionZ += -4;
                    return (
                        <>
                            <Block
                                key={Date.now() + i}
                                position={[0, 0, positionZ + finalLevelLength]}
                            />
                             <Floor
                                key={Date.now() * 2 + i}
                                scale={[4, 0.2, 4 * prevHolisticFloor]}
                                position={[
                                    0,
                                    0.1,
                                    positionZ + finalLevelLength + (4 * prevHolisticFloor) / 2,
                                ]}
                            /> 
                        </>
                    );
                }
            })} */}
          

            {finalBlocks.map((Block, i) => {
                let prevHolisticFloor = holisticFloor;
                const isLastBlock = finalBlocks.length - 1 === i;
                const isSpecialBlock = ["BlockSeesaw", "BlockLava", "BlockNarrow"].includes(
                    Block.name
                );

                !isSpecialBlock ? (holisticFloor += 1) : (holisticFloor = 0);
                prevHolisticFloor =
                    !isSpecialBlock && isLastBlock ? holisticFloor : prevHolisticFloor;

                const needAddFloor =
                    (prevHolisticFloor > 0 && holisticFloor === 0) ||
                    (isLastBlock && !isSpecialBlock);

                const fixFloorPosition = !isSpecialBlock && isLastBlock ? -4 : 0;
                const floorOffset = Block.name === "BlockSeesaw" ? 4 : 2;
                const blockPositionZ = Block.name === "BlockSeesaw" ? positionZ - 6 : positionZ - 4;

                positionZ += Block.name === "BlockSeesaw" ? -8 : -4;

                return (
                    <group key={Date.now() + i}>
                        <Block position={[0, 0, blockPositionZ + finalLevelLength]} />
                        {needAddFloor && (
                            <Floor
                                scale={[4, 0.2, 4 * prevHolisticFloor]}
                                position={[
                                    0,
                                    -0.1,
                                    blockPositionZ +
                                        finalLevelLength +
                                        (4 * prevHolisticFloor) / 2 +
                                        floorOffset +
                                        fixFloorPosition,
                                ]}
                            />
                        )}
                    </group>
                );

            })}

            <BlockEnd
                position={[0, 0, positionZ - 4 + finalLevelLength]}
                key={positionZ - 4 + finalLevelLength}
            />
        </>
    );
}
