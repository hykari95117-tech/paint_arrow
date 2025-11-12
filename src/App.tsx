import { useEffect, useState } from 'react'
import './App.css'
import Game from "./component/Game.tsx";

function App() {
  // PRESS ANY KEY
  const [pressKey, setPressKey] = useState(false);
  useEffect(() => {
    const keyPressCallbackFn = () => setPressKey(true);

    window.addEventListener("keydown", keyPressCallbackFn);

    // unmount
    return () => {
      window.removeEventListener("keydown", keyPressCallbackFn);
    }
  }, []); // mount 시 딱 한 번만 실행


  return (
    <>
      {
        pressKey
        ? <Game />
        : <>
            <h1>PAINT_ARROW</h1>
            <h3>PRESS ANY KEY</h3>
          </>
      }
    </>
  )
}

export default App
