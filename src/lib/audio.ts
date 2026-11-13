export function speak(text: string, rate = 1, onEnd?: () => void) {
  if (!("speechSynthesis" in window)) {
    onEnd?.();
    return false;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  const english = speechSynthesis
    .getVoices()
    .find((v) => v.lang.startsWith("en"));
  if (english) utterance.voice = english;
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  speechSynthesis.speak(utterance);
  return true;
}
export function stopSpeech() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}
function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("vervo-audio-demo", 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("recordings");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function putRecording(id: string, blob: Blob) {
  const db = await database();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("recordings", "readwrite");
    tx.objectStore("recordings").put(blob, id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}
export async function getRecording(id: string): Promise<Blob | undefined> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const r = db.transaction("recordings").objectStore("recordings").get(id);
    r.onsuccess = () => {
      db.close();
      resolve(r.result);
    };
    r.onerror = () => {
      db.close();
      reject(r.error);
    };
  });
}
export async function deleteRecording(id: string) {
  const db = await database();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("recordings", "readwrite");
    tx.objectStore("recordings").delete(id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}
