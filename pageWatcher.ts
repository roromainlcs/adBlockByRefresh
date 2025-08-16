export interface IMessage {
  from: string,
  type: string,
  url: string,
  // isFullscreen: boolean
}

// async function waitForElement(className: string):Promise<boolean> {
  //console.log("yeyooooo");

  // const finished_loading = document.getElementsByClassName("ytp-ad-module")[0]
  // console.log("finished loading:", finished_loading);
  // if (finished_loading === undefined) {
  //   console.log("not fully loaded")
  //   await new Promise(resolve => setTimeout(resolve, 500));
  //   return await waitForElement(className);
  // }

// };

let observer: MutationObserver | null = null;

function disconnectObs () {
  if (observer != null) {
    try {
      observer.disconnect();
      console.log("observer disconnected");
    } catch {
      console.error("failed to disconnect observer")
    }
  }
}

function detectYtbVideoPage() {
  if (!document.URL.includes("www.youtube.com/watch?v=")) {
      disconnectObs()
    //console.log("not ytb video")
    return
  }
  //console.log("ytb video detected");
  //setFullscreen();
  setTimeout(() => detectAd(), 250)
}

function detectAd() {
  const observed = document.getElementsByClassName("ytp-ad-module")[0] as Node;
  const adClassName = "ad-simple-attributed-string";
  if (observed === undefined) {
    detectYtbVideoPage();
    return;
  }

  console.log("observer started");
  observer = new MutationObserver(() => {
    console.log("new changes detected")
    if (document.getElementsByClassName(adClassName)[0] !== undefined)
      chrome.runtime.sendMessage({from: "pageWatcher", type: "message", url: document.URL} as IMessage);
  });

  observer.observe(observed, {
    childList: true,
    subtree: true,
  });

  // In case it already exists
  const existing = document.getElementsByClassName(adClassName)[0];
  if (existing) {
    console.log("existing: ", existing)
    chrome.runtime.sendMessage({from: "pageWatcher", type: "message", url: document.URL} as IMessage);
    //console.log("ad already there...")
  }
}

// async function setFullscreen() {
//   chrome.storage.local.get("isFullscreenRefresh").then(async (res) => {
//     console.log("hihihihi", res.isFullscreenRefresh);
//       if (!res.isFullscreenRefresh)
//         return
//     console.log("hohohoho");
//     const deadline = Date.now() + 2000;
//     while (Date.now() != deadline) {
//       const v = document.querySelector('video')
//       if (v !== null) {
//         v.requestFullscreen();
//         chrome.storage.local.set({isFullscrenRefresh: false})
//         console.log("setting to fullscreen");
//         return;
//       }
//       await new Promise(r => setTimeout(r, 150));
//     }
//     console.log("deadline passed :( .....")
//   })
// }

// fullscreen is locked to user gesture only, there is a work around if you give persmissions in borwser's settings but it looks sketchy and complicated

console.log("pageWatcher active")
if (window.top === window) {
  detectYtbVideoPage();  
  document.addEventListener("yt-navigate-finish", detectYtbVideoPage)
  document.addEventListener("yt-page-data-updated", detectYtbVideoPage)
  document.addEventListener("popstate", detectYtbVideoPage)
  window.addEventListener("beforeunload", disconnectObs)
} else {
  //console.log("not window.top ????")
}