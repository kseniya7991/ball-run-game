// import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import { Level } from "./Level/Level.jsx";
import { Physics } from "@react-three/rapier";
import Player from "./Player";
import useGame from "./stores/useGame";


export default function Experience() {
    const blocksCount = useGame((state) => state.blocksCount);
    console.log(blocksCount);
    return (
        <>
            {/* <OrbitControls makeDefault /> */}
            <Physics >
                <Lights />
                <Level count={blocksCount}/>
                <Player />
            </Physics>
        </>
    );
}
