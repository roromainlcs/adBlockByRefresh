export interface IMessage {
  from: string,
  type: string,
  data: string
}

async function waitForElement(className: string):Promise<boolean> {
  //console.log("yeyooooo");

  // const finished_loading = document.getElementsByClassName("ytp-ad-module")[0]
  // console.log("finished loading:", finished_loading);
  // if (finished_loading === undefined) {
  //   console.log("not fully loaded")
  //   await new Promise(resolve => setTimeout(resolve, 500));
  //   return await waitForElement(className);
  // }
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1 && (node as Element).classList.contains(className)) {
            //console.log("AD DETECTED, PAGE REFRESHED !!!!!")
            observer.disconnect();
            resolve(true);
            return;
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // In case it already exists
    const existing = document.getElementsByClassName(className)[0];
    console.log(existing)
    if (existing) {
      //console.log("ad already there...")
      observer.disconnect();
      resolve(true);
    }
  });
};

function detectYtbVideoPage() {
  if (!document.URL.includes("www.youtube.com/watch?v=")) {
    //console.log("not ytb video")
    return
  }
  //console.log("ytb video detected");
  setTimeout(() => detectAd(), 100)
}

function detectAd() {
  
  waitForElement('ad-simple-attributed-string').then(adAppeared => {
    if (adAppeared) {
      //console.log("sending message ad appeared")
      chrome.runtime.sendMessage({from: "pageWatcher", type: "message", data: "ad appeared"} as IMessage);
    }
});
}

console.log("pageWatcher active")
if (window.top === window) {
  detectYtbVideoPage();
  document.addEventListener("yt-navigate-finish", detectYtbVideoPage)
  document.addEventListener("yt-page-data-updated", detectYtbVideoPage)
  document.addEventListener("popstate", detectYtbVideoPage)
} else {
  //console.log("not window.top ????")
}