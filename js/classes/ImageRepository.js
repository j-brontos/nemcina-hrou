import { imageManifest, availableImages } from "../data/imageManifest.js";

const imageRoot = new URL("../../assets/images/", import.meta.url);

export function imageUrl(filename) {
  if (typeof filename !== "string" || !/^(?:[a-z0-9-]+\/)*[a-z0-9-]+\.webp$/.test(filename)) return null;
  return new URL(filename, imageRoot).href;
}

export class ImageRepository {
  constructor(manifest = imageManifest, files = availableImages) {
    this.manifest = manifest;
    this.files = files;
  }

  urlForId(id) {
    return imageUrl(this.files[id]);
  }

  idFor(word) {
    const key = String(word[0]).toLocaleLowerCase("de-DE").replace(/[.!?]/g, "").trim();
    const subject = key.replace(/ ist (oben|unten|links|rechts|in der mitte)$/, "");
    return this.manifest[subject] || this.manifest[subject.replace(/^(der|die|das) /, "")] || null;
  }

  markup(word) {
    const url = this.urlForId(this.idFor(word));
    return url ? '<img class="learningArt" alt="" draggable="false" src="' + url + '">' : null;
  }
}
