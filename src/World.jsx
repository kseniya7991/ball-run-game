import { RigidBody, BallCollider } from "@react-three/rapier";
import { Instance, Instances } from "@react-three/drei";
import {  useState, useRef, useEffect } from "react";
import * as THREE from "three";
import useGame from "./stores/useGame";
import { useLoader } from "@react-three/fiber";

const wall = new THREE.BoxGeometry(0.2, 2, 4);
// const wallMaterial = new THREE.MeshPhysicalMaterial({
//     metalness: 0.1,
//     roughness: 1,
//     color: "#fff",
//     transmission: 1,
//     ior: 1,
//     thickness: 0.5,
//     dispersion: 0,
//     iridescence: 1,
//     iridescenceIOR: 1.05,
//     specularColor: "green",
// });

const wallMaterial = new THREE.MeshStandardMaterial({
    color: "#20273b",
});

export default function World({ ballsData }) {
    const itemsRef = useRef([]);
    const finalLevelLength = useGame.getState().finalLevelLength;
    const zPosition = (finalLevelLength + 4) / 2
    const instances = useRef();

    const bakedShadow = useLoader(THREE.TextureLoader, "./textures/simpleShadow.jpg");

    const planeShadow = new THREE.PlaneGeometry(0.9, 0.6);
    const planeShadowMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: bakedShadow,
    });

    useEffect(() => {
        setTimeout(() => {
            itemsRef.current.forEach((item) => {
                item.setBodyType(1);
                item.sleep();
            });
        }, 5000);
    }, []);

    const [outBoxBalls, setOutBoxBalls] = useState(new Map());

    const handleCollisionEnter = (e) => {
        if (e.colliderObject.name.includes("ball")) {
            const newOutBoxBalls = new Map(outBoxBalls);
            newOutBoxBalls.set(e.colliderObject.name, e.colliderObject);
            setOutBoxBalls(newOutBoxBalls);
        }
    };

    return (
        <>
            {/* <fogExp2 attach="fog" color="#191920" density={0.05} /> */}
            <group position={[0, -10, -zPosition]}>
                <RigidBody
                    name="floor"
                    type="fixed"
                    friction={0.5}
                    restitution={0.2}
                    onCollisionEnter={handleCollisionEnter}
                    position-z={-zPosition}>
                    <mesh position={[0, 0, 0]} receiveShadow>
                        <boxGeometry args={[2000, 0.1, 2000]} />
                        <meshStandardMaterial color="#20273b" />
                        {/* <meshStandardMaterial color="#fff" /> */}
                    </mesh>
                </RigidBody>

                <group>
                    <RigidBody name="box" type="fixed" friction={0.2} position-z={-zPosition}>
                        <mesh
                            castShadow
                            position={[-2, 1, 0]}
                            material={wallMaterial}
                            geometry={wall}></mesh>
                        <mesh
                            castShadow
                            position={[2, 1, 0]}
                            material={wallMaterial}
                            geometry={wall}></mesh>
                        <mesh
                            castShadow
                            position={[0, 1, -1.9]}
                            rotation={[0, Math.PI / 2, 0]}
                            scale-z={0.95}
                            material={wallMaterial}
                            geometry={wall}></mesh>
                        <mesh
                            castShadow
                            position={[0, 1, 1.9]}
                            rotation={[0, Math.PI / 2, 0]}
                            scale-z={0.95}
                            material={wallMaterial}
                            geometry={wall}></mesh>
                        <mesh
                            castShadow
                            position={[0, 0.1, 0]}
                            rotation={[0, 0, Math.PI / 2]}
                            scale={[0.5, 1.9, 0.9]}
                            material={wallMaterial}
                            geometry={wall}></mesh>
                    </RigidBody>
                    <Instances limit={1000} range={1000} ref={instances}>
                        <icosahedronGeometry args={[0.3, 2]} />
                        <meshStandardMaterial flatShading />
                        {ballsData.map(({ key, position, color }) => (
                            <group key={key}>
                                <RigidBody
                                    position-z={-zPosition}
                                    friction={1}
                                    linearDamping={1}
                                    angularDamping={1}
                                    ref={(el) => (itemsRef.current[key] = el)}>
                                    <BallCollider
                                        args={[0.3]}
                                        position={position}
                                        name={"ball" + key}
                                    />
                                    <Instance
                                        color={color}
                                        castShadow={true}
                                        position={position}
                                        rotation={[0, 0, 0]}
                                        onClick={(e) => console.log(e)}
                                    />
                                </RigidBody>
                            </group>
                        ))}
                    </Instances>

                    <group position-z={0}>
                        {Array.from(outBoxBalls.values()).map((item, i) => {
                            const worldPosition = new THREE.Vector3();
                            item.getWorldPosition(worldPosition); 
                            return (
                                <mesh
                                    key={i}
                                    position-x={worldPosition.x - 0.2}
                                    position-z={worldPosition.z + zPosition}
                                    position-y={0.06}
                                    rotation-z={-0.5}
                                    rotation-x={-Math.PI * 0.5}
                                    material={planeShadowMaterial}
                                    geometry={planeShadow}
                                />
                            );
                        })}
                    </group>
                </group>
            </group>
        </>
    );
}
