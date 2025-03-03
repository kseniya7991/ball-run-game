import * as THREE from "three";
import useGame from "./stores/useGame";
import { useRapier, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect, useState, useMemo } from "react";
import { useControls } from "leva";
import { LavaSparkles } from "./Level/LavaSparkles";
import { playHitSound, playHitObstacleSound, playLavaSound, stopAllSounds } from "./sounds";

export default function Player() {
    const body = useRef();
    const [bodyPosition, setBodyPosition] = useState({ x: 0, y: 1, z: 0 });
    const [subscribeKeys, getKeys] = useKeyboardControls();
    const { rapier, world } = useRapier();

    const [smoothCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10));
    const [smoothCameraTarget] = useState(() => new THREE.Vector3());
    const [burnedColor] = useState(() => "#272727");
    const [isCollidingWithLimbo, setIsCollidingWithLimbo] = useState(false);

    const lastLevel = useGame((state) => state.levels);
    const start = useGame((state) => state.start);
    const restart = useGame((state) => state.restart);
    const end = useGame((state) => state.end);

    const isBurning = useGame((state) => state.isBurning);
    const endBurning = useGame((state) => state.endBurning);

    const phase = useGame((state) => state.phase);
    const levelLength = useGame((state) => state.levelLength);

    const fail = useGame((state) => state.fail);
    const finish = useGame((state) => state.finish);

    const { "ball color": ballColor } = useControls({
        "ball color": "#be3737",
    });

    useEffect(() => {
        if (isBurning) playLavaSound();
    }, [isBurning]);

    /**
     * Jump
     */
    const jump = () => {
        const origin = body.current.translation();
        origin.y -= 0.31;
        const direction = { x: 0, y: -5, z: 0 };

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
        stopAllSounds();
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
        setBodyPosition(body.current?.translation());
        if (!bodyPosition) return;

        const bodyPositionVec = new THREE.Vector3();
        bodyPositionVec.copy(bodyPosition);
        setBodyPosition(bodyPositionVec);

        const cameraPosition = getCameraPosition(state, bodyPosition);

        const cameraTarget = new THREE.Vector3();
        cameraTarget.copy(bodyPosition);
        cameraTarget.y += 0.25;

        smoothCameraPosition.lerp(cameraPosition, lerpStrength * delta);
        smoothCameraTarget.lerp(cameraTarget, lerpStrength * delta);

        state.camera.position.copy(smoothCameraPosition);
        state.camera.lookAt(smoothCameraTarget);

        /**
         * Phases
         */
        if (bodyPosition.z < -(levelLength + 2 + 0.4) && bodyPosition.y > 0) {
            if (useGame.getState().currentLevel === lastLevel) {
                finish();
            } else {
                end();
            }
        }

        if (bodyPosition.y < -4 && phase !== "finished") {
            fail();
            restart();
        }

        // Fixes moments when limbo obstacle presses ball
        if (
            bodyPosition.y < 0 &&
            -2 < bodyPosition.x &&
            bodyPosition.x < 2 &&
            isCollidingWithLimbo
        ) {
            body.current?.setTranslation({ x: bodyPosition.x, y: 0.5, z: bodyPosition.z });
        }
    });

    let finishLerpDuration = 3;
    let finishLerpTime = null;
    let lerpStrength = 5;

    const getCameraPosition = (state, bodyPosition) => {
        const cameraPosition = new THREE.Vector3();
        cameraPosition.copy(bodyPosition);

        const defaultLerpStrength = 5;
        const finishLerpStrength = 2;

        // Move camera upper when its finished phase
        if (phase === "finished") {
            cameraPosition.z += 6;
            cameraPosition.y += 8;

            if (!finishLerpTime) finishLerpTime = state.clock.getElapsedTime();

            let elapsedTime = state.clock.getElapsedTime() - finishLerpTime;
            lerpStrength =
                elapsedTime < finishLerpDuration ? finishLerpStrength : defaultLerpStrength;
        } else {
            cameraPosition.z += 3.25;
            cameraPosition.y += 0.8;

            lerpStrength = defaultLerpStrength;
            finishLerpTime = null;
        }

        return cameraPosition;
    };

    const handleCollisionEnter = (event) => {
        if(phase === "ready") return;
        const objName = event.other.rigidBodyObject.name;
        const velocity = body.current.linvel();
        const absX = Math.abs(velocity.x);
        const absY = Math.abs(velocity.y);
        const absZ = Math.abs(velocity.z);

        if (objName === "Limbo") {
            setIsCollidingWithLimbo(true);
            if (absX > 1.5 || absY > 1 || absZ > 1.5) {
                playHitObstacleSound(Math.max(absX, absY, absZ));
            }
        } else if (objName === "obstacle") {
            if (absX > 1.5 || absY > 1 || absZ > 1.5) {
                playHitObstacleSound(Math.max(absX, absY, absZ));
            }
        } else if (objName !== "lava" && velocity.y < -1) {
            playHitSound(-velocity.y);
        }
    };

    const handleCollisionExit = () => {
        setIsCollidingWithLimbo(false);
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
                    onCollisionEnter={handleCollisionEnter}
                    onCollisionExit={handleCollisionExit}>
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
