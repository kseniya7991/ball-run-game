import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

import { boxGeometry, levelMaterials } from "./Level";
import { Floor } from "./Floor";

export function BlockLimbo({
    geometry = boxGeometry,
    material = levelMaterials.obstacle,
    position = [0, 0, 0],
}) {
    const [randomSpeed] = useState(() => Math.random() + 0.6);
    const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
    const obstacle = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const positionY = Math.sin(time * randomSpeed + timeOffset) + 1.15;
        obstacle.current?.setNextKinematicTranslation({
            x: position[0],
            y: position[1] + positionY,
            z: position[2],
        });
    });

    return (
        <group position={position}>
            <Floor />
            <RigidBody
                ref={obstacle}
                type="kinematicPosition"
                position={[0, 0.3, 0]}
                restitution={0.2}
                friction={0}>
                <mesh
                    geometry={geometry}
                    material={material}
                    scale={[3.5, 0.3, 0.3]}
                    castShadow
                    receiveShadow
                />
            </RigidBody>
        </group>
    );
}