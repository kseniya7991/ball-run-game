import { OrbitControls, Sky } from "@react-three/drei";
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
        sky: {
            turbidity: 3,
            rayleigh: 4,
            sunY: -0.05
        }
    },
    2: {
        blocks: 8,
        types: ["BlockSpinner", "BlockLimbo", "BlockAxe", "BlockNarrow"],
        sky: {
            turbidity: 3,
            rayleigh: 2,
            sunY: -0.05
        }
    },
    3: {
        blocks: 10,
        types: ["BlockSpinner", "BlockLimbo", "BlockAxe", "BlockNarrow", "BlockLava"],
        sky: {
            turbidity: 3,
            rayleigh: 2,
            sunY: -0.01
        }
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
        sky: {
            turbidity: 0.3,
            rayleigh: 1,
            sunY: -0.01
        }
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
        sky: {
            turbidity: 0.02,
            rayleigh: 0.3,
            sunY: 0.3
        }
    },
};

export default function Experience() {
    const blocksCount = useGame((state) => state.blocksCount);
    const blocksSeed = useGame((state) => state.blocksSeed);

    return (
        <>
            {/* <OrbitControls makeDefault /> */}

            <color args={["#bdedfc"]} attach="background" />
            {/* <color args={["#242424"]} attach="background" /> */}


            <Physics debug>
                <Lights />
                <Level count={blocksCount} seed={blocksSeed} config={config} />
                <Player />
            </Physics>
        </>
    );
}
