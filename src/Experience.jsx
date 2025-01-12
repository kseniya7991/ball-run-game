import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import { Level } from "./Level/Level.jsx";
import { Physics } from "@react-three/rapier";
import Player from "./Player";
import useGame from "./stores/useGame";
import { useControls } from "leva";
import { useEffect } from "react";

export default function Experience() {
    const blocksCount = useGame((state) => state.blocksCount);
    const blocksSeed = useGame((state) => state.blocksSeed);
    const updateBlocksCount = useGame((state) => state.updateBlocksCount);

    const { "blocks count": blocksCountValue } = useControls({
        "blocks count": {
            value: 5,
            step: 1,
            min: 1,
            max: 20,
        },
    });

    useEffect(() => {
        console.log("update blocks count", blocksCountValue);
        updateBlocksCount(blocksCountValue);
    }, [blocksCountValue]);

    return (
        <>
            {/* <OrbitControls makeDefault /> */}

            <color args={["#bdedfc"]} attach="background" />

            <Physics>
                <Lights />
                <Level count={blocksCount} seed={blocksSeed} />
                <Player />
            </Physics>
        </>
    );
}
