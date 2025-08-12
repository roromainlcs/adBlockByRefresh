export interface IMessage {
  from: string,
  type: string,
  data: string
}

//console.log("service worker active...");

function checkChromeLocalStorage() {
  console.log("coucou here")
  chrome.storage.local.get(["refreshOnAd", "adBlocked"]).then((res) => {
    if (res.refreshOnAd === undefined) {
      chrome.storage.local.set({refreshOnAd: true})
    }
    if (res.adBlocked === undefined) {
      chrome.storage.local.set({adBlocked: 0})
    }
  })
}

checkChromeLocalStorage();


chrome.runtime.onMessage.addListener((message: IMessage, sender: chrome.runtime.MessageSender) => {
  chrome.storage.local.get(["refreshOnAd"]).then((res) =>{
    console.log("message received in service worker:", message)
    if (message.from === "pageWatcher") {
      if (sender.tab?.id == undefined) {
        console.log("undefined sender's tab id")
      } else if (res.refreshOnAd === true) {
        console.log("refreshing page...")
        if (message.data == "ad appeared") {
          chrome.storage.local.get("adBlocked").then((res) => {
            chrome.storage.local.set({adBlocked: (res.adBlocked as number) + 1})
          })
        }
        chrome.tabs.reload(sender.tab?.id)
      }
    }
  })
});