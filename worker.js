// Custom entry: re-export only the fetch handler so OpenNext's unused DOQueueHandler class is not shipped
// (migration v2 deletes it). See opennext.js.org/cloudflare/howtos/custom-worker.
export { default } from "./.open-next/worker.js";
