import { ImageRepository } from "./ImageRepository.js";
import { learningMarkup } from "../data/learningArt.js";

export class PictureRenderer {
  constructor() {
    this.images = new ImageRepository();
  }

  isFootball(word) {
    return /fußball|fussball/i.test(word[0]);
  }

  accessibleWord(word) {
    return this.isFootball(word) ? "fotbalový míč – " + word[0] : word[0];
  }

  placementPicture(object) {
    return this.pictureMarkup([object.adjective + " " + object.noun]);
  }

  pictureMarkup(word) {
    // The original seven colour tuples identify their swatch by the spoken word.
    return this.images.markup(word) || learningMarkup(word[1]) || learningMarkup("color:" + word[0]);
  }

  paintPicture(element, word) {
    const markup = this.pictureMarkup(word);
    if (markup) element.innerHTML = markup;
    else element.textContent = word[0];
  }
}
