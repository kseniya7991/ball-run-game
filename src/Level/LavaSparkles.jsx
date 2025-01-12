import * as THREE from "three";
import { Points, Point } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export function LavaSparkles({ position }) {
    const group = useRef();
    const count = 30;
    const [points, setPoints] = useState([]);

    const commonMaterialProps = {
        vertexColors: true,
        sizeAttenuation: true,
        depthWrite: false,
    };

    useEffect(() => {
        const pointsArray = [];

        for (let i = 0; i < count; i++) {
            let pointPosition = [];
            pointPosition[0] = Math.random() * 0.7 - 0.35; // X
            pointPosition[1] = Math.random() * 0.5; // Y
            pointPosition[2] = Math.random() * 0.7 - 0.35; // Z
            pointsArray.push(pointPosition);
        }

        setPoints(pointsArray);
    }, []);

    useFrame((state, delta) => {
        group.current.children.forEach((points, i) => {
            points.children.forEach((point, j) => {
                const multiplier = i === 1 ? 10 : 0;

                point.position.y += delta * 0.02 * (i + j + 1 + multiplier);

                if (point.position.y > 0.9 && point.color.r > 0.2) {
                    point.color = new THREE.Color("rgb(20%, 20%, 20%)");
                }

                if (point.position.y > 1) {
                    point.color = new THREE.Color(
                        `hsl(${Math.random() * (35 - 20) + 20}, 100%, 44.71%)`
                    );
                    point.position.y = 0;
                }
            });
        });
    });
    return (
        <>
            <group ref={group}>
                <Points position={position} position-y={position.y + 0.2}>
                    <pointsMaterial {...commonMaterialProps} size={0.08} />
                    {points.slice(0, 25).map((point, i) => (
                        <Point
                            key={i}
                            position={point}
                            color={`hsl(${i * 0.05 * (35 - 20) + 20}, 100%, 44.71%)`}
                        />
                    ))}
                </Points>
                <Points position={position} position-y={position.y + 0.2}>
                    <pointsMaterial {...commonMaterialProps} size={0.11} />
                    {points.slice(25, 31).map((point, i) => (
                        <Point
                            key={i}
                            position={point}
                            color={`hsl(${i * 0.05 * (35 - 20) + 20}, 100%, 44.71%)`}
                        />
                    ))}
                </Points>
            </group>
        </>
    );
}
