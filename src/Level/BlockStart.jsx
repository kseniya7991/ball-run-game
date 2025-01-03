import { Float, Text } from "@react-three/drei";

import { boxGeometry, levelMaterials } from "./Level";
import { Floor } from "./Floor";

export function BlockStart({
    geometry = boxGeometry,
    material = levelMaterials.floor1,
    position = [0, 0, 0],
}) {
    return (
        <>
            <Float floatIntensity={0.5} rotationIntensity={0.25} position={[0.95, 0, 0]}>
                {["Ball", "Race"].map((text, index) => (
                    <Text
                        key={text}
                        font="./bebas-neue-v9-latin-regular.woff"
                        maxWidth={0.25}
                        lineHeight={0.75}
                        textAlign="left"
                        position={[0, 0.85 - index * 0.4, 0]}
                        rotation-y={-0.25}
                        scale={index === 0 ? 0.52 : 0.5}>
                        {text}
                        <meshBasicMaterial toneMapped={false} />
                    </Text>
                ))}
            </Float>
            <group position={position}>
                <Floor geometry={geometry} material={material} />
            </group>
        </>
    );
}
