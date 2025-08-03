export interface IMessage {
  from: string,
  type: string,
  data: string
}

function waitForElement(className: string):Promise<boolean> {
  console.log("yeyooooo");
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1 && (node as Element).classList.contains(className)) {
            console.log("AAAAAAAADD HEERREE AN AAAADD !!!!!")
            observer.disconnect();
            resolve(true);
            return;
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // In case it already exists
    const existing = document.getElementsByClassName(className)[0];
    if (existing) {
      observer.disconnect();
      resolve(true);
    }
  });
};

function detectAd() {
  console.log("coucou")
  if (!document.URL.includes("www.youtube/watch?v=")) {
    console.log("not youtube so no page reading...")
    chrome.runtime.sendMessage({from: "content", type: "message", data: "not youtube"} as IMessage);
    return;
  }
  console.log("le J c le S");
  
  waitForElement('ytp-ad-module').then(adAppeared => {
  if (adAppeared) {
    chrome.runtime.sendMessage({from: "content", type: "message", data: "ad appeared"} as IMessage);
  }
});
}

if (window.top === window) {
  detectAd();
}