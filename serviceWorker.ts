export interface IMessage {
  from: string,
  type: string,
  data: string
}

chrome.runtime.onMessage.addListener((message: IMessage) => {
  if (message.from === "content") {
    // Send message to the popup
    chrome.runtime.sendMessage({ from: "background", type: message.type, data: message.data });
  }
});