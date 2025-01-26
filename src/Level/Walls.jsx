import { RigidBody } from "@react-three/rapier";
import { useControls } from "leva";

import { boxGeometry, levelMaterials } from "./Level";

export function Walls({ geometry = boxGeometry, material = levelMaterials.wall, length = 1 }) {
    const { walls } = useControls({
        walls: false,
    });

    return (
        <>
            {walls && (
                <RigidBody type="fixed" restitution={0.2} friction={0}>
                    <mesh
                        receiveShadow
                        position={[-2.1, 0.75 - 0.2, (length * 4) / -2 + 2]}
                        geometry={geometry}
                        material={material}
                        scale={[0.2, 1.5, length * 4]}
                    />
                    <mesh
                        castShadow
                        position={[2.1, 0.75 - 0.2, (length * 4) / -2 + 2]}
                        geometry={geometry}
                        material={material}
                        scale={[0.2, 1.5, length * 4]}
                    />
                    <mesh
                        receiveShadow
                        position={[0, 0.75 - 0.2, -(length * 4) + 2 + 0.1]}
                        geometry={geometry}
                        material={material}
                        scale={[4, 1.5, 0.2]}
                    />
                </RigidBody>
            )}
        </>
    );
}
