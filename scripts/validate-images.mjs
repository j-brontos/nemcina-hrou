import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { availableImages, imageManifest } from "../js/data/imageManifest.js";
import { interfaceFiles, lessonPreviews, rhymePreviews } from "../js/data/interfaceArt.js";
import { ImageRepository, imageUrl } from "../js/classes/ImageRepository.js";
import { PictureRenderer } from "../js/classes/PictureRenderer.js";
import { activities, coloredNumber, colors, numbers } from "../js/data/expandedVocabulary.js";
import {
  itemsForTopic, placementObjects, positionObjects, positionQuestions,
  rhymes, state, topics, vocabulary
} from "../js/application.js";

const root = new URL("../assets/images/", import.meta.url);
async function listFiles(dir, prefix = "") {
  const paths = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isDirectory()) {
      paths.push(...await listFiles(new URL(entry.name + "/", dir), relative + "/"));
    } else {
      paths.push(relative);
    }
  }
  return paths.sort();
}

const expected = new Set([...Object.values(availableImages), ...Object.values(interfaceFiles)]);
const disk = await listFiles(root);
assert.deepEqual(disk, [...expected].sort(), "The asset inventory must match the checked-in image files.");
const hashes = new Map();
for (const file of disk) {
  assert.ok(imageUrl(file), "Invalid local path " + file);
  const bytes = await readFile(new URL(file, root));
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF", file);
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP", file);
  assert.equal(bytes.readUInt32LE(4), bytes.length - 8, "Truncated WebP " + file);
  const hash = createHash("sha256").update(bytes).digest("hex");
  assert.ok(!hashes.has(hash), "Duplicate image files: " + hashes.get(hash) + " and " + file);
  hashes.set(hash, file);
}
for (const [word, id] of Object.entries(imageManifest)) {
  assert.ok(Object.hasOwn(availableImages, id), word + " -> " + id);
}

const images = new ImageRepository();
const renderer = new PictureRenderer();
function artKind(word) {
  const markup = renderer.pictureMarkup(word);
  if (!markup) return null;
  if (markup.startsWith("<svg ")) return "dynamic";
  return "webp";
}
function checkWord(word) {
  const kind = artKind(word);
  assert.ok(kind, "Missing illustration: " + word[0]);
  if (kind === "dynamic") {
    assert.match(renderer.pictureMarkup(word), /<(circle|text) /, "Only colors and numerals are dynamic");
  } else {
    const url = renderer.pictureMarkup(word).match(/src="([^"]+)"/)?.[1];
    assert.ok(url?.startsWith(root.href) && expected.has(url.slice(root.href.length)), word[0]);
  }
  return kind;
}

const coverage = [];
for (const [index, topic] of topics.entries()) {
  for (const difficulty of [1, 2]) {
    for (const mode of ["quiz", "explore", "memory", "scene"]) {
      Object.assign(state, { difficulty, mode });
      const words = itemsForTopic(index);
      const kinds = words.map(checkWord);
      coverage.push({
        lesson: topic.title, difficulty, mode, words: words.length,
        static: kinds.filter(kind => kind === "webp").length,
        dynamic: kinds.filter(kind => kind === "dynamic").length
      });
    }
  }
}
assert.equal(lessonPreviews.length, topics.length, "Every lesson needs a preview");
for (const preview of lessonPreviews) {
  assert.ok(preview.length);
  preview.forEach(checkWord);
}
assert.equal(rhymePreviews.length, rhymes.length, "Every rhyme needs a preview");
rhymePreviews.forEach(checkWord);
for (const question of positionQuestions) {
  const basic = images.idFor([question.speech]);
  assert.ok(basic, question.speech);
  assert.equal(images.idFor([question.sentence]), basic, question.sentence);
  assert.equal(images.idFor([positionObjects[question.object].name]), basic);
  checkWord([question.speech]);
  checkWord([question.sentence]);
}
for (const object of placementObjects) {
  const word = [object.adjective + " " + object.noun];
  assert.ok(images.idFor(word), word[0]);
  assert.equal(images.idFor([object.noun]), images.idFor(word), word[0]);
  assert.equal(renderer.placementPicture(object), renderer.pictureMarkup(word));
  checkWord(word);
}
for (const activity of activities) {
  assert.equal(checkWord([activity.de, activity.art]), "webp");
}
for (const number of numbers) {
  for (const color of colors) {
    for (const sentence of [false, true]) {
      const entry = coloredNumber(number.value, color.de, sentence);
      assert.equal(checkWord([entry.de, entry.art]), "dynamic");
      const markup = renderer.pictureMarkup([entry.de, entry.art]);
      assert.ok(markup.includes('font-size="80"') && markup.includes('fill="' + color.hex + '"'));
    }
  }
}
const audioOnlyWithoutPicture = vocabulary
  .filter(entry => !artKind([entry.de, entry.art]))
  .map(entry => entry.de);
const summary = {
  files: disk.length, lessonCombinations: coverage.length,
  lessonWordChecks: coverage.reduce((count, row) => count + row.words, 0),
  lessonPreviews: lessonPreviews.length, rhymePreviews: rhymePreviews.length,
  positionQuestions: positionQuestions.length, placementObjects: placementObjects.length,
  possibleNumberPhrases: numbers.length * colors.length * 2, missingPlayableIllustrations: 0
};
console.log(JSON.stringify(process.argv.includes("--coverage")
  ? { ...summary, coverage, audioOnlyWithoutPicture }
  : summary, null, 2));
