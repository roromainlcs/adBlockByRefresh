import type { IMessage } from "../serviceWorker";


export async function adDetector(): Promise<string> {
  const timestamp: string = await new Promise((resolve) => {
    chrome.runtime.onMessage.addListener((message: IMessage) => {
      console.log("received in popup adDetector:", message);
      resolve(message.data)
    })
  })
  return timestamp;
}