// import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import { Level } from "./Level/Level.jsx";
import { Physics } from "@react-three/rapier";
import Player from "./Player";

export default function Experience() {
    return (
        <>
            {/* <OrbitControls makeDefault /> */}

            <Physics >
                <Lights />
                <Level />
                <Player />
            </Physics>
        </>
    );
}
