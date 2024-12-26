import { useKeyboardControls } from "@react-three/drei";

export default function Interface() {
    const forward = useKeyboardControls((state) => state.forward);
    const backward = useKeyboardControls((state) => state.backward);
    const rightward = useKeyboardControls((state) => state.rightward);
    const leftward = useKeyboardControls((state) => state.leftward);
    const jump = useKeyboardControls((state) => state.jump);

    return (
        <>
            <div className="interface">
                {/* Time */}
                <div className="interface__time">0.00</div>

                {/* Restart */}
                <div className="interface__restart">Restart</div>

                {/* Controls */}
                <div className="interface__controls">
                    <div className="raw">
                        <div className={`key ${forward ? "active" : ""}`}></div>
                    </div>
                    <div className="raw">
                        <div className={`key ${leftward ? "active" : ""}`}></div>
                        <div className={`key ${backward ? "active" : ""}`}></div>
                        <div className={`key ${rightward ? "active" : ""}`}></div>
                    </div>
                    <div className="raw">
                        <div className={`key large ${jump ? "active" : ""}`}></div>
                    </div>
                </div>
            </div>
        </>
    );
}
