import { useEffect, useRef, useState } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

import { boxGeometry, levelMaterials } from "./Level";
import { Floor } from "./Floor";

import fragmentShader from "../shaders/lava/fragment.glsl";
import vertexShader from "../shaders/lava/vertex.glsl";
import { shaderMaterial } from "@react-three/drei";

import * as THREE from "three";

const LavaMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorDark: new THREE.Color("#ff6600"),
        uColorLight: new THREE.Color("#f2f217"),
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
    useEffect(() => {
        lavaMaterial.current.uTime += Math.random() * 10;
    }, [])
 

    useFrame((state, delta) => {
        lavaMaterial.current.uTime += delta * 0.3;
    });

    const handleCollision = (event) => {
        const { manifold, target, other } = event;
        console.log("collision enter")
        // console.log( manifold.solverContactPoint(0));
    };

    const handleContact = (event) => {
        // console.log(event)
    }
    const handleCollisionExit = (event) => {
        console.log("collision exit")
    }

    return (
        <group position={position}>
            <Floor position={[0, -0.1, 1.5]} scale={[4, 0.2, 1]} />
            <Floor position={[0, -0.1, -1.5]} scale={[4, 0.2, 1]} />
            <RigidBody type="kinematicPosition" position={[0, 0, 0]} restitution={0.2} friction={0}>
                <CuboidCollider
                    args={[2, 0.05, 1]}
                    position={[0, -0.4, 0]}
                    restitution={0.2}
                    friction={1}
                    onCollisionEnter={handleCollision} 
                    onCollisionExit={handleCollisionExit}
                    // onContactForce={handleContact}
                />
            </RigidBody>
            <mesh
                geometry={geometry}
                position-y={-0.125}
                scale={[4, 0.15, 2]}
                castShadow
                receiveShadow>
                <lavaMaterial ref={lavaMaterial} />
            </mesh>
        </group>
    );
}
