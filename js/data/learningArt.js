import { colors } from "./expandedVocabulary.js";
import { ImageRepository } from "../classes/ImageRepository.js";

const palette = new Map(colors.map(color => [color.de, color.hex]));
const illustrations = new ImageRepository();

export function learningMarkup(key) {
  if (typeof key !== "string") return null;
  const [kind, value, color] = key.split(":");
  if (kind === "activity") return illustrations.markup([value]);

  let shape;
  if (kind === "number" && /^(?:[0-9]|1[0-2])$/.test(value)) {
    const fill = palette.get(color) || "#5865d8";
    shape = '<text x="50" y="77" text-anchor="middle" font-family="Arial,sans-serif" font-size="80" font-weight="bold" fill="' + fill + '" stroke="#30394b" stroke-width="1.4" paint-order="stroke">' + value + '</text>';
  } else if (kind === "color" && palette.has(value)) {
    shape = '<circle cx="50" cy="50" r="37" fill="' + palette.get(value) + '" stroke="#30394b" stroke-width="2"/>';
  } else {
    return null;
  }
  return '<svg class="learningArt" viewBox="0 0 100 100" aria-hidden="true">' + shape + '</svg>';
}
