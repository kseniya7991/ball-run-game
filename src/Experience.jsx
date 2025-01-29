import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import { Level } from "./Level/Level.jsx";
import { Physics } from "@react-three/rapier";
import Player from "./Player";
import useGame from "./stores/useGame";
import { useControls } from "leva";
import { useEffect } from "react";

const config = {
    1: {
        blocks: 5,
        types: ["BlockSpinner", "BlockLimbo", "BlockAxe"],
    },
    2: {
        blocks: 8,
        types: ["BlockSpinner", "BlockLimbo", "BlockAxe", "BlockNarrow"],
    },
    3: {
        blocks: 10,
        types: ["BlockSpinner", "BlockLimbo", "BlockAxe", "BlockNarrow", "BlockLava"],
    },
    4: {
        blocks: 12,
        types: [
            "BlockSpinner",
            "BlockLimbo",
            "BlockAxe",
            "BlockNarrow",
            "BlockLava",
            "BlockSeesaw",
        ],
    },
    5: {
        blocks: 15,
        types: [
            "BlockSpinner",
            "BlockLimbo",
            "BlockAxe",
            "BlockNarrow",
            "BlockNarrow",
            "BlockLava",
            "BlockLava",
            "BlockSeesaw",
            "BlockSeesaw",
        ],
    },
};

export default function Experience() {
    const blocksCount = useGame((state) => state.blocksCount);
    const blocksSeed = useGame((state) => state.blocksSeed);
    const updateBlocksCount = useGame((state) => state.updateBlocksCount);

    const { "blocks count": blocksCountValue } = useControls({
        "blocks count": {
            value: 1,
            step: 1,
            min: 1,
            max: 20,
        },
    });
    

    useEffect(() => {
        updateBlocksCount(blocksCountValue);
    }, [blocksCountValue]);

    return (
        <>
            <OrbitControls makeDefault />

            {/* <color args={["#bdedfc"]} attach="background" /> */}
            <color args={["#242424"]} attach="background" />

            <Physics debug>
                <Lights />
                <Level count={blocksCount} seed={blocksSeed} config={config} />
                <Player />
            </Physics>
        </>
    );
}
