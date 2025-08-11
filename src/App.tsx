import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    chrome.storage.local.get(["refreshOnAd"]).then((res) => {
      console.log("refreshOnAd:", res.refreshOnAd)
      setIsActive(res.refreshOnAd)
  })

  }, [])

  function flipIsActive() {
    chrome.storage.local.set({refreshOnAd: !isActive})
    setIsActive(!isActive);
  }

  return (
    <>
    <h1>AdBlockByRefresh</h1>
    <div>
      <button onClick={() => {flipIsActive()}}>
        {isActive ? "on" : "off"}
      </button>
    </div>
    </>
  )
}

export default App
