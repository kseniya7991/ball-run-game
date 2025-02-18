import { useRef, useEffect, useState } from "react";
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
    const phase = useGame((state) => state.phase);

    const [countdown, setCountdown] = useState(3);
    const [message, setMessage] = useState("");

    useEffect(() => {
        let timer;
        let timer1;
        if (phase === "finished") {
            setMessage("Only one thing remains...");
            // setMessage("Осталось лишь одно...");
            // Через 2 секунды показываем второе сообщение
            timer1 = setTimeout(() => {
                setMessage("Accept your fate.");
                // setMessage("Принять свою судьбу");

                // Через еще 2 секунды начинаем отсчет
                const timer2 = setTimeout(() => {
                    setMessage(countdown.toString());

                    // Запускаем таймер отсчета
                    timer = setInterval(() => {
                        setCountdown((prev) => {
                            const newCount = prev - 1;
                            setMessage(newCount.toString());

                            if (newCount === 0) {
                                clearInterval(timer);
                            }
                            return newCount;
                        });
                    }, 1000);
                }, 2000);

                return () => clearTimeout(timer2);
            }, 2000);
        }

        return () => {
            clearTimeout(timer1);
            clearInterval(timer);
        };
    }, [phase]);

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
