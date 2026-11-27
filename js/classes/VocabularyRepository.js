import { itemsForTopic, topics, levelTwoItems, state } from "../application.js";
export class VocabularyRepository {

itemsForTopic(i){return state.difficulty===2?levelTwoItems[i]:topics[i].items}
}
