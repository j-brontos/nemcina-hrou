
export class VocabularyRepository {
constructor(context){this.context=context;}


itemsForTopic(i){
const { itemsForTopic, topics, levelTwoItems, state } = this.context;
const items=state.difficulty===2?levelTwoItems[i]:topics[i].items;
if(state.mode==="explore"&&topics[i].id==="numbers-colors"&&state.difficulty===2)return [...items,...this.context.numberSentences.map(e=>[e.de,e.art,e.id])];
return items}
}
