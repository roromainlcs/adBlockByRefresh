import { useState, useEffect } from 'react'
import './App.css'
import { adDetector } from './adDetector'

function App() {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [adDetected, setAdDetected] = useState<string>("a mi me gusta la paella")

  useEffect(() => {
    adDetector().then((res) => setAdDetected(res))
      //refreshPage();
  }, []);

  return (
    <>
    <h1>AdBlockByRefresh</h1>
    <h2>{adDetected}</h2>
    <div>
      <button onClick={() => {setIsActive(!isActive)}}>
        {isActive ? "on" : "off"}
      </button>
    </div>
    </>
  )
}

export default App
