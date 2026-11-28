// Chrome and vocabulary share ImageRepository's local asset URL resolver.
import { imageUrl } from "../classes/ImageRepository.js";
import { availableImages } from "./imageManifest.js";

export const interfaceFiles = Object.freeze({
  landscape: "storybook/landscape.webp",
  dino: "storybook/dino.webp",
  speaker: "storybook/speaker.webp",
  book: "storybook/book.webp",
  memory: "storybook/memory.webp",
  find: "storybook/find.webp",
  directions: "storybook/directions.webp",
  move: "storybook/move.webp",
  rhymes: "storybook/rhymes.webp",
  sound: "storybook/sound.webp",
  star: "storybook/star.webp",
  trophy: "storybook/trophy.webp",
});

export const lessonPreviews = [
  [["rot", "color:rot"], ["gelb", "color:gelb"], ["blau", "color:blau"]],
  [["die Sonne"]], [["die bunten Blätter"]], [["der Apfel"]], [["der Kuchen"]],
  [["der Schmetterling"]], [["das Mädchen"]], [["Ich bin Dino."]], [["der Fußball"]],
  [["eins", "number:1:rot"], ["zwei", "number:2:gelb"], ["drei", "number:3:blau"]],
  [["malen", "activity:malen"]], [["der Feuerwehrmann"]],
];
export const rhymePreviews = [
  ["der Regenbogen"], ["die bunten Blätter"], ["der Regenschirm"], ["Guten Morgen!"],
  ["zehn", "number:10"], ["zwölf", "number:12"], ["malen", "activity:malen"],
];

export function interfaceUrl(id) {
  return imageUrl(interfaceFiles[id] ?? availableImages[id]);
}

export function loadInterfaceArt() {
  for (const image of document.querySelectorAll("img[data-art]")) {
    image.src = interfaceUrl(image.dataset.art);
  }
}
