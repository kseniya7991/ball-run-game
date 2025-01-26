import { useRef } from "react";
import { Float, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";

import { boxGeometry, levelMaterials } from "./Level";
import { Floor } from "./Floor";

export function BlockEnd({
    geometry = boxGeometry,
    material = levelMaterials.floor1,
    position = [0, 0, 0],
}) {
    const coin = useRef();
    const end = useRef();

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        const rotation = new THREE.Quaternion();
        rotation.setFromEuler(new THREE.Euler(0, time * 1.5, 0));
        coin.current?.setNextKinematicRotation(rotation);
    });


    return (
        <>
            <group>
                <Float floatIntensity={1.5} rotationIntensity={0.25} position={position}>
                    <Text font="./bebas-neue-v9-latin-regular.woff" position={[0, 2, 2]} scale={1}>
                        Finish
                        <meshBasicMaterial toneMapped={false} />
                    </Text>
                </Float>

                <RigidBody type="fixed" position={position} ref={end}>
                    <CuboidCollider
                        args={[0.1, 1, 2]}
                        position={[-2, 1, 0]}
                        restitution={0.2}
                        friction={1}
                    />
                    <CuboidCollider
                        args={[0.1, 1, 2]}
                        position={[2, 1, 0]}
                        restitution={0.2}
                        friction={1}
                    />
                    <CuboidCollider
                        args={[2, 1, 0.1]}
                        position={[0, 1, -2]}
                        restitution={0.2}
                        friction={1}
                    />
                    <Floor geometry={geometry} material={material} position={[0, 0, 0]} />
                </RigidBody>
            </group>
        </>
    );
}
