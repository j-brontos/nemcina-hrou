
export class VocabularyRepository {
constructor(context){this.context=context;}


itemsForTopic(i){
const { itemsForTopic, topics, levelTwoItems, state } = this.context;
return state.difficulty===2?levelTwoItems[i]:topics[i].items}
}
