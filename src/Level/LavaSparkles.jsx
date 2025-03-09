// import { useEffect, useRef, useState, useMemo } from "react";
// import { useFrame } from "@react-three/fiber";
// import { Points, Point } from "@react-three/drei";
// import * as THREE from "three";

// const countSparkles = 30;
// const commonMaterialProps = {
//     vertexColors: true,
//     sizeAttenuation: true,
//     depthWrite: false,
// };
// const blackColor = new THREE.Color("rgb(20%, 20%, 20%)");

// export function LavaSparkles({ position }) {
//     const group = useRef();
//     const points = useMemo(() => {
//         const pointsArray = [];
//         for (let i = 0; i < countSparkles; i++) {
//             pointsArray.push([
//                 Math.random() * 0.7 - 0.35, // X
//                 Math.random() * 0.5, // Y
//                 Math.random() * 0.7 - 0.35, // Z
//             ]);
//         }
//         return pointsArray;
//     }, []);

//     useFrame((state, delta) => {
//         group.current.children.forEach((points, i) => {
//             points.children.forEach((point, j) => {
//                 const multiplier = i === 1 ? 10 : 0;

//                 point.position.y += delta * 0.02 * (i + j + 1 + multiplier);

//                 if (point.position.y > 0.8 && point.color.r > 0.2) {
//                     point.color = blackColor;
//                 }

//                 if (point.position.y > 1) {
//                     point.color = new THREE.Color(
//                         `hsl(${Math.random() * (35 - 20) + 20}, 100%, 44.71%)`
//                     );
//                     point.position.y = 0;
//                 }
//             });
//         });
//     });
//     return (
//         <>
//             <group ref={group}>
//                 <Points position={position} position-y={position.y + 0.2}>
//                     <pointsMaterial {...commonMaterialProps} size={0.08} />
//                     {points.slice(0, 25).map((point, i) => (
//                         <Point
//                             key={i}
//                             position={point}
//                             color={`hsl(${i * 0.05 * (35 - 20) + 20}, 100%, 44.71%)`}
//                         />
//                     ))}
//                 </Points>
//                 <Points position={position} position-y={position.y + 0.2}>
//                     <pointsMaterial {...commonMaterialProps} size={0.11} />
//                     {points.slice(25, 31).map((point, i) => (
//                         <Point
//                             key={i}
//                             position={point}
//                             color={`hsl(${i * 0.05 * (35 - 20) + 20}, 100%, 44.71%)`}
//                         />
//                     ))}
//                 </Points>
//             </group>
//         </>
//     );
// }

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const countSparkles = 40;
const largeSparklesCount = 15;
const smallSparklesCount = countSparkles - largeSparklesCount;
const blackColor = new THREE.Color("rgb(20%, 20%, 20%)");

const smallSparklesMaterial = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    sizeAttenuation: true,
    depthWrite: false,
});

const largeSparklesMaterial = new THREE.PointsMaterial({
    size: 0.11,
    vertexColors: true,
    sizeAttenuation: true,
    depthWrite: false,
});

export function LavaSparkles({ position }) {
    const smallPointsRef = useRef();
    const largePointsRef = useRef();

    const [smallGeometry, smallPositionsArray, smallColorArray] = useMemo(() => {
        const positions = new Float32Array(smallSparklesCount * 3);
        const colors = new Float32Array(smallSparklesCount * 3);
        const positionsArray = [];
        const colorArray = [];

        for (let i = 0; i < smallSparklesCount; i++) {
            const i3 = i * 3;

            const x = Math.random() * 0.7 - 0.35;
            const y = Math.random() * 0.5;
            const z = Math.random() * 0.7 - 0.35;

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
            positionsArray.push({ x, y, z });

            const color = new THREE.Color(`hsl(${i * 0.05 * (35 - 20) + 20}, 100%, 44.71%)`);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            colorArray.push({ r: color.r, g: color.g, b: color.b });
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        return [geometry, positionsArray, colorArray];
    }, []);

    const [largeGeometry, largePositionsArray, largeColorArray] = useMemo(() => {
        const positions = new Float32Array(largeSparklesCount * 3);
        const colors = new Float32Array(largeSparklesCount * 3);
        const positionsArray = [];
        const colorArray = [];

        for (let i = 0; i < largeSparklesCount; i++) {
            const i3 = i * 3;
            const x = Math.random() * 0.7 - 0.35;
            const y = Math.random() * 0.5;
            const z = Math.random() * 0.7 - 0.35;

            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
            positionsArray.push({ x, y, z });

            const color = new THREE.Color(`hsl(${i * 0.05 * (35 - 20) + 20}, 100%, 44.71%)`);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            colorArray.push({ r: color.r, g: color.g, b: color.b });
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        return [geometry, positionsArray, colorArray];
    }, []);

    useFrame((state, delta) => {
        if (!smallPointsRef.current || !largePointsRef.current) return;

        const smallPositions = smallPointsRef.current.geometry.attributes.position;
        const smallColorsAttr = smallPointsRef.current.geometry.attributes.color;
        const largePositions = largePointsRef.current.geometry.attributes.position;
        const largeColorsAttr = largePointsRef.current.geometry.attributes.color;

        // Update small sparkles
        for (let i = 0; i < smallPositions.count; i++) {
            const i3 = i * 3;
            smallPositionsArray[i].y += delta * 0.02 * (i + 1);
            smallPositions.array[i3 + 1] = smallPositionsArray[i].y;

            if (smallPositionsArray[i].y > 0.8 && smallColorArray[i].r > 0.2) {
                smallColorArray[i].r = blackColor.r;
                smallColorArray[i].g = blackColor.g;
                smallColorArray[i].b = blackColor.b;

                smallColorsAttr.array[i3] = blackColor.r;
                smallColorsAttr.array[i3 + 1] = blackColor.g;
                smallColorsAttr.array[i3 + 2] = blackColor.b;
            }

            if (smallPositionsArray[i].y > 1) {
                const color = new THREE.Color(
                    `hsl(${Math.random() * (35 - 20) + 20}, 100%, 44.71%)`
                );

                smallColorArray[i].r = color.r;
                smallColorArray[i].g = color.g;
                smallColorArray[i].b = color.b;

                smallColorsAttr.array[i3] = color.r;
                smallColorsAttr.array[i3 + 1] = color.g;
                smallColorsAttr.array[i3 + 2] = color.b;

                smallPositionsArray[i].y = 0;
                smallPositions.array[i3 + 1] = 0;
            }
        }

        // Update large sparkles
        for (let i = 0; i < largePositions.count; i++) {
            const i3 = i * 3;
            largePositionsArray[i].y += delta * 0.02 * (i + 25 + 1 + 10);
            largePositions.array[i3 + 1] = largePositionsArray[i].y;

            if (largePositionsArray[i].y > 0.8 && largeColorArray[i].r > 0.2) {
                largeColorArray[i].r = blackColor.r;
                largeColorArray[i].g = blackColor.g;
                largeColorArray[i].b = blackColor.b;

                largeColorsAttr.array[i3] = blackColor.r;
                largeColorsAttr.array[i3 + 1] = blackColor.g;
                largeColorsAttr.array[i3 + 2] = blackColor.b;
            }

            if (largePositionsArray[i].y > 1) {
                const color = new THREE.Color(
                    `hsl(${Math.random() * (35 - 20) + 20}, 100%, 44.71%)`
                );

                largeColorArray[i].r = color.r;
                largeColorArray[i].g = color.g;
                largeColorArray[i].b = color.b;

                largeColorsAttr.array[i3] = color.r;
                largeColorsAttr.array[i3 + 1] = color.g;
                largeColorsAttr.array[i3 + 2] = color.b;

                largePositionsArray[i].y = 0;
                largePositions.array[i3 + 1] = 0;
            }
        }

        // Отмечаем буферы как требующие обновления
        smallPositions.needsUpdate = true;
        smallColorsAttr.needsUpdate = true;
        largePositions.needsUpdate = true;
        largeColorsAttr.needsUpdate = true;
    });

    return (
        <group position={position} position-y={position.y + 0.2}>
            <points
                ref={smallPointsRef}
                geometry={smallGeometry}
                material={smallSparklesMaterial}
            />
            <points
                ref={largePointsRef}
                geometry={largeGeometry}
                material={largeSparklesMaterial}
            />
        </group>
    );
}
