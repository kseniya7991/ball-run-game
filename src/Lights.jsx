import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import useGame from "./stores/useGame";

export default function Lights({ isFinish = false }) {
    const light = useRef();
    const spotLight = useRef();
    const targetRef = useRef();
    const finalLevelLength = useGame((state) => state.finalLevelLength);

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
            light.current.intensity = 3;
            light.current.shadow.camera.updateProjectionMatrix();
            light.current.shadow.map.needsUpdate = true;

            spotLight.current.target = targetRef.current;
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
                shadow-camera-left={-10}
            />

            {isFinish && (
                <group position={[4.48, -10 + 12, -finalLevelLength - 4]}>
                    <spotLight
                        ref={spotLight}
                        position={[0, 0, 0]}
                        intensity={10}
                        distance={20}
                        angle={0.3}
                        penumbra={0.3}
                        decay={0.2}
                        color="#FFF7E1"
                    />
                    <object3D ref={targetRef} position={[-0.4, -1, 0]} />
                </group>
            )}

            <ambientLight intensity={1} />
        </>
    );
}
