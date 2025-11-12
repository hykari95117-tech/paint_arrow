import { useState, useEffect } from "react"
import App from "../App";

export default function GameOver() {
  // PRESS ANY KEY
    const [pressKey, setPressKey] = useState(false);
    useEffect(() => {
        const keyPressCallbackFn = () => setPressKey(true);
        window.addEventListener("keydown", keyPressCallbackFn);
        return () => window.removeEventListener("keydown", keyPressCallbackFn);
    }, []);
    return (
        <>
            {
                pressKey
                ? <App />
                :
                <div>
                    <h1>GAME OVER</h1>
                    <h3>press any key to restart</h3>
                </div>
            }
        </>
    )
};