import { Floor } from "./Floor";

export function BlockNarrow({
    position = [0, 0, 0],
}) {
    return (
        <group position={position}>
            <Floor  scale={[0.5, 0.2, 4]}/>
        </group>
    );
}
