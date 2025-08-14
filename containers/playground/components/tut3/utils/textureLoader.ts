import { LoadingManager, TextureLoader } from "three";

export const loadingManager = new LoadingManager();
loadingManager.onLoad = () => {
  console.log("loaded");
};
loadingManager.onProgress = (item, loaded, total) => {
  console.log("progress", item, loaded, total);
};
loadingManager.onError = (error) => {
  console.log("error", error);
};
loadingManager.onStart = (e) => {
  console.log("start", e);
};
export const textureLoader = new TextureLoader(loadingManager);
