export interface IMessage {
  from: string,
  type: string,
  data: string
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

function detectYtbVideoPage() {
  if (!document.URL.includes("www.youtube.com/watch?v=")) {
      disconnectObs()
    //console.log("not ytb video")
    return
  }
  //console.log("ytb video detected");
  setTimeout(() => detectAd(), 250)
}

const disconnectObs = () => {
  if (observer != null) {
    try {
      observer.disconnect();
      console.log("observer disconnected");
    } catch {
      console.error("failed to disconnect observer")
    }
  }
}

function detectAd() {
  const adClassName = "ad-simple-attributed-string";

  console.log("observer started");
  observer = new MutationObserver(() => {
    console.log("new changes detected")
    if (document.getElementsByClassName(adClassName)[0] !== undefined)
      chrome.runtime.sendMessage({from: "pageWatcher", type: "message", data: "ad appeared"} as IMessage);
    // for (const mutation of mutations) {
    //   for (const node of mutation.addedNodes) {
    //     if (node.nodeType === 1 && (node as Element).classList.contains(adClassName)) {
    //       console.log("AD DETECTED, PAGE REFRESHED !!!!!")
    //       //observer.disconnect();
    //       chrome.runtime.sendMessage({from: "pageWatcher", type: "message", data: "ad appeared"} as IMessage);
    //     }
    //   }
    // }
  });

  observer.observe((document.getElementsByClassName("ytp-ad-module")[0] as Node), {
    childList: true,
    subtree: true,
  });

  // In case it already exists
  const existing = document.getElementsByClassName(adClassName)[0];
  console.log(existing)
  if (existing) {
    chrome.runtime.sendMessage({from: "pageWatcher", type: "message", data: "ad appeared"} as IMessage);
    //console.log("ad already there...")
  }
}

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