import { useEffect, useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

import { boxGeometry, levelMaterials } from "./Level";
import { Floor } from "./Floor";

import useGame from "../stores/useGame";

import fragmentShader from "../shaders/lava/fragment.glsl";
import vertexShader from "../shaders/lava/vertex.glsl";
import { shaderMaterial } from "@react-three/drei";

import * as THREE from "three";

const LavaMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorDark: new THREE.Color("#ff6600"),
        uColorLight: new THREE.Color("#f2f217"),
        // fogColor: new THREE.Color("#565666"),
        // fogNear: 5,
        // fogFar: 20,
    },
    vertexShader,
    fragmentShader
);

extend({ LavaMaterial });

export function BlockLava({
    geometry = boxGeometry,
    material = levelMaterials.lava,
    position = [0, 0, 0],
}) {
    const lavaMaterial = useRef();
    const startBurning = useGame((state) => state.startBurning);
    const fail = useGame((state) => state.fail);
    const lavaSize = 2;
    const floorSize = (4 - lavaSize) / 2;
    const marginFloor = floorSize / 2 + lavaSize / 2;

    useEffect(() => {
        lavaMaterial.current.uTime += Math.random() * 10;
    }, []);

    useFrame((state, delta) => {
        lavaMaterial.current.uTime += delta * 0.3;
    });

    const handleCollision = (event) => {
        startBurning();
        fail();
    };

    return (
        <group position={position}>
            <Floor position={[0, -0.1, marginFloor]} scale={[4, 0.2, floorSize]} />
            <Floor position={[0, -0.1, -marginFloor]} scale={[4, 0.2, floorSize]} />
            <RigidBody type="kinematicPosition" position={[0, 0, 0]} restitution={0.2} friction={0}>
                <CuboidCollider
                    args={[2, 0.05, lavaSize / 2]}
                    position={[0, -0.4, 0]}
                    restitution={0.2}
                    friction={1}
                    onCollisionEnter={handleCollision}
                />
            </RigidBody>
            <mesh
                geometry={geometry}
                position-y={-0.125}
                scale={[4, 0.15, lavaSize]}
                castShadow
                receiveShadow>
                <lavaMaterial ref={lavaMaterial} />
            </mesh>
        </group>
    );
}
