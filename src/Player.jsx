import { useRapier, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, Sparkles } from "@react-three/drei";
import { useRef, useEffect, useState, use } from "react";
import * as THREE from "three";
import useGame from "./stores/useGame";
import { useControls } from "leva";
import { LavaSparkles } from "./Level/LavaSparkles";

export default function Player() {
    const body = useRef();
    const [bodyPosition, setBodyPosition] = useState({ x: 0, y: 1, z: 0 });
    const [subscribeKeys, getKeys] = useKeyboardControls();
    const { rapier, world } = useRapier();

    const [smoothCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10));
    const [smoothCameraTarget] = useState(() => new THREE.Vector3());

    const start = useGame((state) => state.start);
    const restart = useGame((state) => state.restart);
    const end = useGame((state) => state.end);
    const blocksCount = useGame((state) => state.blocksCount);
    const isBurning = useGame((state) => state.isBurning);
    const endBurning = useGame((state) => state.endBurning);

    const { "ball color": ballColor } = useControls({
        "ball color": "#08a3f2",
    });

    /**
     * Jump
     */
    const jump = () => {
        const origin = body.current.translation();
        origin.y -= 0.31;
        const direction = { x: 0, y: -1, z: 0 };

        const ray = new rapier.Ray(origin, direction);
        const hit = world.castRay(ray, 10, true);
        if (hit.timeOfImpact < 0.15) body.current?.applyImpulse({ x: 0, y: 0.5, z: 0 });
    };

    /**
     * Reset
     */

    const reset = () => {
        body.current?.setTranslation({ x: 0, y: 1, z: 0 });
        body.current?.setLinvel({ x: 0, y: 0, z: 0 });
        body.current?.setAngvel({ x: 0, y: 0, z: 0 });
    };

    useEffect(() => {
        const unsubscribePhase = useGame.subscribe(
            (state) => state.phase,
            (value) => {
                if (value === "ready") {
                    reset();
                    endBurning();
                }
            }
        );

        /**
         * Subscribe to jump event
         */
        const unsubscribeJump = subscribeKeys(
            (state) => state.jump, // selector
            (val) => {
                // what to do
                if (val) jump();
            }
        );

        const unsubscribeAnyKey = subscribeKeys(() => {
            start();
        });

        return () => {
            unsubscribeJump();
            unsubscribeAnyKey();
            unsubscribePhase();
        };
    }, []);

    /**
     * Controls
     */
    useFrame((state, delta) => {
        const { forward, backward, leftward, rightward, jump } = getKeys();
        const impulse = { x: 0, y: 0, z: 0 };
        const torque = { x: 0, y: 0, z: 0 };

        const impulseStrength = 0.6 * delta;
        const torqueStrength = 0.2 * delta;

        if (forward) {
            impulse.z -= impulseStrength;
            torque.x -= torqueStrength;
        }
        if (rightward) {
            impulse.x += impulseStrength;
            torque.z -= torqueStrength;
        }
        if (backward) {
            impulse.z += impulseStrength;
            torque.x += torqueStrength;
        }
        if (leftward) {
            impulse.x -= impulseStrength;
            torque.z += torqueStrength;
        }

        body.current?.applyImpulse(impulse);
        body.current?.applyTorqueImpulse(torque);
    });

    /**
     * Camera
     */
    useFrame((state, delta) => {
        const bodyPosition = body.current?.translation();
        if (!bodyPosition) return;

        const bodyPositionVec = new THREE.Vector3();
        bodyPositionVec.copy(bodyPosition);
        setBodyPosition(bodyPositionVec);

        const cameraPosition = new THREE.Vector3();
        cameraPosition.copy(bodyPosition);
        cameraPosition.z += 3.25;
        cameraPosition.y += 0.8;

        const cameraTarget = new THREE.Vector3();
        cameraTarget.copy(bodyPosition);
        cameraTarget.y += 0.25;

        smoothCameraPosition.lerp(cameraPosition, 5 * delta);
        smoothCameraTarget.lerp(cameraTarget, 5 * delta);

        state.camera.position.copy(smoothCameraPosition);
        state.camera.lookAt(smoothCameraTarget);

        /**
         * Phases
         */
        if (bodyPosition.z < -(blocksCount * 4 + 2)) end();
        if (bodyPosition.y < -4) restart();
    });

    return (
        <>
            <group>
                <RigidBody
                    ref={body}
                    canSleep={false}
                    position={[0, 0.5, 0]}
                    colliders="ball"
                    restitution={0.2}
                    friction={1}
                    linearDamping={0.5}
                    angularDamping={0.5}>
                    <mesh castShadow>
                        <icosahedronGeometry args={[0.3, 1]} />
                        <meshStandardMaterial flatShading color={ballColor} />
                    </mesh>
                </RigidBody>

                {isBurning && <LavaSparkles position={bodyPosition} />}
            </group>
        </>
    );
}
