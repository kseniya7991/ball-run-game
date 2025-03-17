import { useRef, useEffect, useState, useCallback } from "react";
import { Float, Text } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import useGame from "../stores/useGame";

import { boxGeometry, levelMaterials } from "./Level";
import { Floor } from "./Floor";

export function BlockEnd({
    geometry = boxGeometry,
    material = levelMaterials.floor1,
    position = [0, 0, 0],
}) {
    const end = useRef();
    const timerRef = useRef(null);
    const timer1Ref = useRef(null);
    const timer2Ref = useRef(null);

    const [phase, setPhase] = useState(null);
    const [countdown, setCountdown] = useState(3);
    const [message, setMessage] = useState("");

    const final = useGame((state) => state.final);

    useEffect(() => {
     
        if (countdown === 0) {
            final();
        }
    }, [countdown, final]);


    const handlePhaseChange = useCallback(
        (value) => {
            if (value === "finished") {
                setPhase(value);
                setMessage("Only one thing remains...");

                timer1Ref.current = setTimeout(() => {
                    setMessage("Accept your fate.");


                    timer2Ref.current = setTimeout(() => {
                        setMessage(countdown.toString());

                        timerRef.current = setInterval(() => {
                            setCountdown((prev) => {
                                const newCount = prev - 1;
                                setMessage(newCount.toString());

                                if (newCount === 0) {
                                    clearInterval(timerRef.current);
                                }
                                return newCount;
                            });
                        }, 1000);
                    }, 2000);
                }, 2000);
            }
        },
        [countdown]
    );

    useEffect(() => {
        const unsubscribePhase = useGame.subscribe((state) => state.phase, handlePhaseChange);
        return () => {
            unsubscribePhase();
            if (timer1Ref.current) clearTimeout(timer1Ref.current);
            if (timer2Ref.current) clearTimeout(timer2Ref.current);
        };
    }, [handlePhaseChange]);

    return (
        <>
            <group>
                {phase !== "finished" && (
                    <Float floatIntensity={1.5} rotationIntensity={0.25} position={position}>
                        <Text
                            font={"./bebas-neue-v9-latin-regular.woff"}
                            position={[0, 2, 2]}
                            scale={phase === "finished" ? 0.5 : 1}>
                            Finish
                            <meshBasicMaterial toneMapped={false} />
                        </Text>
                    </Float>
                )}

                <Float
                    floatIntensity={1.5}
                    rotationIntensity={0.25}
                    position={position}
                    rotation-x={-Math.PI * 0.25}>
                    <Text font={"./Days.woff"} position={[0, 2, 2]} scale={0.5}>
                        {message}
                        <meshBasicMaterial toneMapped={false} />
                    </Text>
                </Float>

                <RigidBody type="fixed" position={position} ref={end}>
                    <CuboidCollider
                        args={[0.1, 3, 2]}
                        position={[-2, 1.7, 0]}
                        restitution={0}
                        friction={1}
                    />
                    <CuboidCollider
                        args={[0.1, 3, 2]}
                        position={[2, 1.7, 0]}
                        restitution={0}
                        friction={1}
                    />
                    <CuboidCollider
                        args={[2, 3, 0.1]}
                        position={[0, 1.7, -2]}
                        restitution={0}
                        friction={1}
                    />
                    {phase === "finished" && (
                        <>
                            <CuboidCollider
                                args={[2, 3, 0.1]}
                                position={[0, 1.7, 2]}
                                restitution={0}
                                friction={1}
                            />
                            <CuboidCollider
                                args={[2, 0.1, 2]}
                                position={[0, 4.5, 0]}
                                restitution={0}
                                friction={1}
                            />
                        </>
                    )}

                    <Floor geometry={geometry} material={material} />
                </RigidBody>
            </group>
        </>
    );
}
