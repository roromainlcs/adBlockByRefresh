export interface IMessage {
  from: string,
  type: string,
  data: string,
}

interface IYtdPlayer extends HTMLElement {
  getPlayer: () => {
    getCurrentTime: () => number;
  }
}

//console.log("service worker active...");

function checkChromeLocalStorage() {
  chrome.storage.local.get(["refreshOnAd", "adBlocked"]).then((res) => {
    if (res.refreshOnAd === undefined) {
      chrome.storage.local.set({refreshOnAd: true})
    }
    if (res.adBlocked === undefined) {
      chrome.storage.local.set({adBlocked: 0})
    }
  })
}

async function executeGetTimeStamp(): Promise<number> {
  if (!/\.youtube\.com$/.test(location.hostname)) return -4;       // not YouTube
  if (!/^\/watch/.test(location.pathname)) return -5;              // not a watch page

  // Poll until ytd-player is present and upgraded
  const deadline = Date.now() + 3000; // up to 3s
  while (Date.now() < deadline) {
    const el: IYtdPlayer | null = document.querySelector('ytd-player');
    const p = el?.getPlayer?.()
      if (p && typeof p.getCurrentTime === 'function') {
        return p.getCurrentTime(); // content timeline (freezes during ads)
      }
    await new Promise(r => setTimeout(r, 150));
  }
  return -3; // couldn't find/upgrade in time
}

async function getTimeStamp(tabId: number): Promise<number> {
    const [res] = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    world: 'MAIN',
    func: executeGetTimeStamp
  });
  const timeStamp = res?.result === undefined ? -1 : res.result
  //console.log("timeStamp received: ", timeStamp);
  return timeStamp;
}

checkChromeLocalStorage();

function refreshPageWithTimeStamp(tabId: number, currentUrl: string, timeStamp: number) {
  let newUrl = currentUrl;
  const timeParam = currentUrl.search("&t=");
  if (timeStamp === null)
    return;
  //console.log("refreshing page...", currentUrl, timeStamp)
  if (timeParam === -1) {
    newUrl = newUrl.concat("&t=", timeStamp.toFixed(), "s")
  } else {
    newUrl = newUrl.substring(0, timeParam + 3).concat(timeStamp.toFixed(), "s")
  }
  chrome.storage.local.get("adBlocked").then((res) => {
    chrome.storage.local.set({adBlocked: (res.adBlocked as number) + 1})
  })
  chrome.tabs.update(tabId, {url: newUrl})
}

chrome.runtime.onMessage.addListener((message: IMessage, sender: chrome.runtime.MessageSender) => {
  const currentUrl = sender.url;
  console.log(currentUrl);
  if (sender.tab?.id == undefined || sender.url === undefined) {
    console.error("incomplete sender information");
    return;
  }
  const tabId = sender.tab.id;
  const senderUrl = sender.url;
  chrome.storage.local.get(["refreshOnAd"]).then((res) =>{
    //console.log("message received in service worker:", message)
    if (message.from === "pageWatcher" && res.refreshOnAd === true) {
      getTimeStamp(tabId).then((timeStamp) => {
        refreshPageWithTimeStamp(tabId, senderUrl, timeStamp);
      });
    }
  })
});