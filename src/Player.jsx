import * as THREE from "three";
import useGame from "./stores/useGame";
import { useRapier, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { useControls } from "leva";
import { LavaSparkles } from "./Level/LavaSparkles";

export default function Player() {
    const body = useRef();
    const [subscribeKeys, getKeys] = useKeyboardControls();
    const { rapier, world } = useRapier();

    const [smoothCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10));
    const [smoothCameraTarget] = useState(() => new THREE.Vector3());
    const [burnedColor] = useState(() => "#272727");
    const [isCollidingWithLimbo, setIsCollidingWithLimbo] = useState(false);

    const start = useGame((state) => state.start);
    const restart = useGame((state) => state.restart);
    const end = useGame((state) => state.end);
    const isBurning = useGame((state) => state.isBurning);
    const endBurning = useGame((state) => state.endBurning);
    const levelLength = useGame((state) => state.levelLength);
    const nextLevel = useGame((state) => state.nextLevel);
    const fail = useGame((state) => state.fail);

    const { "ball color": ballColor } = useControls({
        "ball color": "#be3737",
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
        if (hit?.timeOfImpact < 0.15) body.current?.applyImpulse({ x: 0, y: 0.5, z: 0 });
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
            (state) => state.jump,
            (val) => {
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
        const { forward, backward, leftward, rightward } = getKeys();

        const impulse = { x: 0, y: 0, z: 0 };
        const torque = { x: 0, y: 0, z: 0 };

        const impulseStrength = 0.5 * delta;
        const torqueStrength = 0.15 * delta;

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
        if (bodyPosition.z < -(levelLength + 2) && bodyPosition.y > 0) {
            nextLevel();
            end();
        }
        if (bodyPosition.y < -4) {
            fail();
            restart();
        }

        if (
            bodyPosition.y < 0 &&
            -2 < bodyPosition.x &&
            bodyPosition.x < 2 &&
            isCollidingWithLimbo
        ) {
            body.current?.setTranslation({ x: bodyPosition.x, y: 0.5, z: bodyPosition.z });
        }
    });

    const handleCollision = (event, reset = false) => {
        if (event.other.rigidBodyObject.name === "Limbo") setIsCollidingWithLimbo(true);
        if (reset) setIsCollidingWithLimbo(false);
    };

    return (
        <>
            <group>
                <RigidBody
                    ref={body}
                    canSleep={false}
                    colliders="ball"
                    restitution={0.2}
                    friction={1}
                    linearDamping={0.5}
                    angularDamping={0.5}
                    position={[0, 1, 0]}
                    onCollisionEnter={handleCollision}
                    onCollisionExit={(e) => handleCollision(e, true)}>
                    <mesh castShadow>
                        <icosahedronGeometry args={[0.3, 1]} />
                        <meshStandardMaterial
                            flatShading
                            color={isBurning ? burnedColor : ballColor}
                        />
                    </mesh>
                </RigidBody>

                {isBurning && <LavaSparkles position={bodyPosition} />}
            </group>
        </>
    );
}
