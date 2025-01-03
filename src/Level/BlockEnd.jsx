import { useRef } from "react";
import { Float, Text, useGLTF } from "@react-three/drei";
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
    const { scene } = useGLTF(
        "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/coin/model.gltf"
    );

    scene.children.forEach((mesh) => (mesh.castShadow = true));

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime();
        const rotation = new THREE.Quaternion();
        rotation.setFromEuler(new THREE.Euler(0, time * 1.5, 0));
        coin.current?.setNextKinematicRotation(rotation);
    });
    return (
        <>
            <group position={position}>
                <Float floatIntensity={1.5} rotationIntensity={0.25}>
                    <Text font="./bebas-neue-v9-latin-regular.woff" position={[0, 2, 2]} scale={1}>
                        Finish
                        <meshBasicMaterial toneMapped={false} />
                    </Text>
                </Float>

                <RigidBody type="fixed">
                    <CuboidCollider
                        args={[2, 0.1, 2]}
                        position={[0, -0.1, 0]}
                        restitution={0.2}
                        friction={1}
                    />
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
                </RigidBody>
                <Floor geometry={geometry} material={material} position={[0, 0, 0]} />
                <RigidBody
                    type="kinematicPosition"
                    ref={coin}
                    colliders="hull"
                    restitution={0.2}
                    friction={0}>
                    <primitive object={scene} position-y={1.2} />
                </RigidBody>
            </group>
        </>
    );
}
