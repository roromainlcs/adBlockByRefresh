import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [adBlocked, setAdBlocked] = useState<number>(0);

  useEffect(() => {
    chrome.storage.local.get(["refreshOnAd", "adBlocked"]).then((res) => {
      console.log("refreshOnAd:", res.refreshOnAd)
      console.log("adBlocked pulled:", res.adBlocked as number)
      setIsActive(res.refreshOnAd)
      setAdBlocked(res.adBlocked as number)
  })

  }, [])

  function flipIsActive() {
    chrome.storage.local.set({refreshOnAd: !isActive})
    setIsActive(!isActive);
  }

  return (
    <>
    <h2>AdBlockByRefresh</h2>
    <div>
      <button onClick={() => {flipIsActive()}} style={{fontSize: "16px", padding: "8px 18px"}}>
        {isActive ? "on" : "off"}
      </button>
      <p className='adBlocked'>ad blocked: {adBlocked}</p>
    </div>
    </>
  )
}

export default App
