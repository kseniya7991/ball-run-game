import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";

export default function Lights({ isFinish = false }) {
    const light = useRef();

    useFrame((state) => {
        // Update Z
        light.current.position.z = state.camera.position.z + 1 - 4;
        light.current.target.position.z = state.camera.position.z - 4;

        // Update X
        light.current.position.x = state.camera.position.x + 6;
        light.current.target.position.x = state.camera.position.x + 4;

        light.current.target.updateMatrixWorld();
    });

    useEffect(() => {
        if (isFinish) {
            light.current.shadow.camera.far = 100;
            light.current.shadow.camera.updateProjectionMatrix();
            light.current.shadow.map.needsUpdate = true;
        }
    }, [isFinish]);

    return (
        <>
            <directionalLight
                ref={light}
                castShadow
                position={[4, 4, 1]}
                intensity={4.5}
                shadow-mapSize={[1024, 1024]}
                shadow-camera-near={1}
                shadow-camera-far={10}
                shadow-camera-top={10}
                shadow-camera-right={10}
                shadow-camera-bottom={-10}
                shadow-camera-left={-10}></directionalLight>

            {/* <spotLight
                position={[5, 10, 0]}
                intensity={6}
                distance={20}
                angle={0.3}
                penumbra={0.5}
                decay={0}
            /> */}
            <ambientLight intensity={1} />
        </>
    );
}
