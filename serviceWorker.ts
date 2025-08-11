export interface IMessage {
  from: string,
  type: string,
  data: string
}

console.log("service worker active...");

function checkChromeLocalStorage() {
  chrome.storage.local.get("refreshOnAd").then((res) => {
    if (res.refreshOnAd === undefined) {
      chrome.storage.local.set({refreshOnAd: true})
    } else {
      console.log("isActive correctly set:", res.refreshOnAd);
    }
  })
}

checkChromeLocalStorage();


chrome.runtime.onMessage.addListener((message: IMessage, sender: chrome.runtime.MessageSender) => {
  chrome.storage.local.get(["refreshOnAd"]).then((res) =>{
    console.log("message received in service worker:", message)
    if (message.from === "pageWatcher" && message.data == "ad appeared") {
      if (sender.tab?.id == undefined) {
        console.log("undefined sender's tab id")
      } else if (res.refreshOnAd === true) {
        console.log("refreshing page...")
        chrome.tabs.reload(sender.tab?.id)
      }
    }
  })
});