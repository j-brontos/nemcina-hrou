export class BaseGame {
 constructor(context){this.context=context;this.timers=new Set();this.generation=0;}
 defer(callback,delay){const generation=this.generation;const id=setTimeout(()=>{this.timers.delete(id);if(generation===this.generation)callback()},delay);this.timers.add(id);return id;}
 destroy(){this.generation++;for(const id of this.timers)clearTimeout(id);this.timers.clear();}
}
