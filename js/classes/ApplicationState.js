export class GameSession {
 #round=[]; #step=0; #score=0; #done=false;
 get round(){return this.#round} set round(value){this.#round=value}
 get step(){return this.#step} set step(value){this.#step=value}
 get score(){return this.#score} set score(value){this.#score=value}
 get done(){return this.#done} set done(value){this.#done=value}
 reset(round=[]){this.#round=round;this.#step=0;this.#score=0;this.#done=false}
}
export class ApplicationState extends GameSession {
 difficulty=1;topicIndex=0;mode="quiz";speechToken=0;audioBusy=false;wrongAnswerWatchdog=null;advanceTimer=null;previousFeedback={correct:-1,wrong:-1};
}
