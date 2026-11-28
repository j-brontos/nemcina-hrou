import { learningMarkup } from "../data/learningArt.js";

export class PictureRenderer {
constructor(context){this.context=context;}


soccerBallMarkup(){
const { soccerBallMarkup, isFootball, accessibleWord, placementPicture, pictureMarkup, paintPicture, state } = this.context;

 return '<svg class="learningArt footballArt" viewBox="0 0 100 100" role="img" aria-label="fotbalový míč"><circle cx="50" cy="50" r="36" fill="#fff" stroke="#26313b" stroke-width="2.5"/><path d="M50 32 L67 44 L61 63 L39 63 L33 44Z" fill="#222831"/><path d="M50 32 L44 15 L57 15 L67 44 L82 36 L84 52 L61 63 L68 81 L55 86 L39 63 L21 72 L16 57 L33 44 L22 31 L33 20Z" fill="none" stroke="#222831" stroke-width="3.5"/><path d="M44 15 L33 20 L22 31 L16 57 L21 72 M57 15 L68 20 L82 36 L84 52 L68 81 L55 86" fill="none" stroke="#222831" stroke-width="3"/></svg>';
}
isFootball(word){
const { soccerBallMarkup, isFootball, accessibleWord, placementPicture, pictureMarkup, paintPicture, state } = this.context;
return /fußball|fussball/i.test(word[0])}
accessibleWord(word){
const { soccerBallMarkup, isFootball, accessibleWord, placementPicture, pictureMarkup, paintPicture, state } = this.context;
return isFootball(word)?"fotbalový míč – "+word[0]:word[0]}
placementPicture(object){
const { soccerBallMarkup, isFootball, accessibleWord, placementPicture, pictureMarkup, paintPicture, state } = this.context;
return this.pictureMarkup([object.adjective+" "+object.noun,object.icon])}
pictureMarkup(word){
const { soccerBallMarkup, isFootball, accessibleWord, placementPicture, pictureMarkup, paintPicture, state } = this.context;

 const text=word[0].toLocaleLowerCase("de-DE"),emoji=word[1];
 const palette={rote:"#e64545",roten:"#e64545",braune:"#9b6235",schwarze:"#202638",gelbe:"#f2c831",grüne:"#47a963",grünen:"#47a963",blaue:"#3979d9",blauen:"#3979d9",bunten:"#e96736",schwarzen:"#202638",gelben:"#f2c831",braunen:"#9b6235"};
 const color=Object.entries(palette).find(([key])=>text.includes(key))?.[1];
 let shape="";
 const glyph=(symbol,x=50,y=76,size=76)=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" text-anchor="middle">'+symbol+'</text>';
 const leaf=c=>'<path d="M50 10 Q90 30 77 63 Q65 87 50 92 Q25 74 16 53 Q12 30 50 10Z" fill="'+c+'"/><path d="M50 91 V26 M50 62 L27 44 M50 53 L73 34" stroke="#85502e" stroke-width="3" fill="none"/>';
 if(text.includes("blätter"))shape=['#e64545','#f2c831','#ef8b32'].map((c,i)=>'<g transform="translate('+(i*29)+' '+(i===1?35:8)+') scale(.43)">'+leaf(c)+'</g>').join('');
 else if(text.includes("baum"))shape='<rect x="44" y="57" width="12" height="36" fill="#895c39"/><circle cx="30" cy="45" r="23" fill="#47a963"/><circle cx="70" cy="45" r="23" fill="#47a963"/><circle cx="50" cy="27" r="25" fill="#47a963"/>';
 else if(text.includes("birne"))shape='<path d="M50 20 Q35 20 35 42 Q8 75 31 88 Q50 99 69 88 Q92 75 65 42 Q65 20 50 20Z" fill="'+(color||"#47a963")+'"/><path d="M50 23 Q48 10 60 8" stroke="#895c39" stroke-width="5" fill="none"/>';
 else if(text.includes("trauben"))shape='<path d="M50 20 Q50 8 65 9" stroke="#895c39" stroke-width="5" fill="none"/>'+[[35,31],[61,31],[23,51],[48,51],[73,51],[36,71],[61,71],[49,88]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="13" fill="'+(color||"#8952c8")+'" stroke="#fff" stroke-width="1.5"/>').join('');
 else if(text.includes("schmetterling"))shape='<ellipse cx="29" cy="35" rx="23" ry="28" fill="#3979d9"/><ellipse cx="71" cy="35" rx="23" ry="28" fill="#e64545"/><ellipse cx="30" cy="69" rx="19" ry="23" fill="#f2c831"/><ellipse cx="70" cy="69" rx="19" ry="23" fill="#8952c8"/><ellipse cx="50" cy="50" rx="6" ry="32" fill="#26313b"/>';
 else if(text.includes("drachen"))shape='<path d="M50 5 L12 39 L50 83Z" fill="#e64545"/><path d="M50 5 L88 39 L50 83Z" fill="#3979d9"/><path d="M12 39 H50 V83Z" fill="#f2c831"/><path d="M50 39 H88 L50 83Z" fill="#47a963"/><path d="M50 83 Q75 90 62 98" stroke="#26313b" fill="none" stroke-width="3"/>';
 else if(text.includes("raupe"))shape=Array.from({length:7},(_,i)=>'<circle cx="'+(12+i*12)+'" cy="'+(55+7*Math.sin(i))+'" r="10" fill="#47a963" stroke="#285c36"/>').join('')+'<circle cx="84" cy="49" r="13" fill="#8ac75a"/><circle cx="88" cy="45" r="2" fill="#26313b"/>';
 else if(text.includes("äpfel"))shape=glyph("❤️",50,36,32)+glyph("🍎",30,88,48)+glyph("🍎",72,88,48);
 else if(text.includes("himmel"))shape='<rect x="5" y="10" width="90" height="80" rx="8" fill="#3979d9"/>'+glyph("☁️",50,48,35);
 else if(text.includes("apfel"))shape='<path d="M50 34 C22 11 6 47 20 75 Q34 104 50 88 Q66 104 80 75 C94 47 78 11 50 34Z" fill="'+(color||"#e64545")+'"/><path d="M50 33 Q45 14 56 9" stroke="#67452c" stroke-width="5" fill="none"/><ellipse cx="64" cy="20" rx="14" ry="7" fill="#4da86a" transform="rotate(-27 64 20)"/>';
 else if(text.includes("marienkäfer"))shape='<ellipse cx="50" cy="57" rx="32" ry="30" fill="#e43e3e"/><path d="M50 28 V85" stroke="#1d5231" stroke-width="4"/><circle cx="35" cy="45" r="6" fill="#173c26"/><circle cx="66" cy="45" r="6" fill="#173c26"/><circle cx="37" cy="68" r="6" fill="#173c26"/><circle cx="64" cy="68" r="6" fill="#173c26"/><circle cx="50" cy="25" r="14" fill="#20352a"/><path d="M45 14 Q32 4 28 13 M55 14 Q68 4 72 13" fill="none" stroke="#20352a" stroke-width="3"/>';
 else if(/\bschuhe?\b/.test(text)){
 const shoe='<path d="M12 12 L29 12 Q34 30 45 35 L70 44 Q82 49 82 59 L82 65 H9 Q5 61 8 49 L12 12Z" fill="'+(color||"#47a963")+'" stroke="#26313b" stroke-width="2"/><path d="M8 59 H82 V67 Q80 71 73 71 H15 Q8 71 8 65Z" fill="#f5f5f5" stroke="#26313b" stroke-width="2"/><path d="M29 28 L43 26 M34 35 L48 33 M40 42 L54 40" stroke="#fff" stroke-width="3" stroke-linecap="round"/>';
 shape=/\bschuhe\b/.test(text)?'<g transform="translate(3 0) scale(.82)">'+shoe+'</g><g transform="translate(25 35) scale(.82)">'+shoe+'</g>':shoe;
 }
 else if(/\b(?:regen)?schirm\b/.test(text))shape='<path d="M7 49 Q12 12 50 12 Q88 12 93 49 Q79 39 65 49 Q50 39 35 49 Q21 39 7 49Z" fill="'+(color||"#8a54c8")+'" stroke="#26313b" stroke-width="2"/><path d="M50 7 V78 Q50 92 63 85" fill="none" stroke="#26313b" stroke-width="4" stroke-linecap="round"/>';
 else if(text.includes("hut"))shape='<path d="M28 72 L35 24 Q50 14 65 24 L72 72Z" fill="'+(color||"#242632")+'"/><ellipse cx="50" cy="75" rx="43" ry="11" fill="'+(color||"#242632")+'"/><path d="M30 62 H70" stroke="#d7a853" stroke-width="7"/>';
 else if(text.includes("kastanie"))shape='<ellipse cx="50" cy="55" rx="33" ry="32" fill="'+(color||"#92522e")+'"/><path d="M37 26 Q50 16 63 26" stroke="#e6b67a" stroke-width="5" fill="none"/>';
 else if(text.includes("blatt")||text.includes("blätter"))shape='<path d="M50 10 Q90 30 77 63 Q65 87 50 92 Q25 74 16 53 Q12 30 50 10Z" fill="'+(color||"#df7434")+'"/><path d="M50 91 L50 26 M50 62 L27 44 M50 53 L73 34" stroke="#85502e" stroke-width="3" fill="none"/>';
 else if(text.includes("sonne"))shape='<circle cx="50" cy="50" r="25" fill="#f5c63b"/>'+Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return '<path d="M'+(50+33*Math.cos(a))+' '+(50+33*Math.sin(a))+' L'+(50+44*Math.cos(a))+' '+(50+44*Math.sin(a))+'" stroke="#e9aa27" stroke-width="6" stroke-linecap="round"/>'}).join("");
 else if(text.includes("regnet"))shape='<path d="M24 48 Q18 24 40 27 Q50 8 67 27 Q89 27 80 49Z" fill="#a5b6c7"/><path d="M28 62 L20 81 M50 62 L42 81 M72 62 L64 81" stroke="#3b8de2" stroke-width="7" stroke-linecap="round"/>';
 else if(text.includes("fußball")||text.includes("fussball"))return this.soccerBallMarkup();
 else if(text.includes("buch"))shape='<path d="M19 17 H73 Q83 17 83 28 V84 H25 Q19 84 19 76Z" fill="'+(color||"#3979d9")+'"/><path d="M26 73 H83" stroke="#fff" stroke-width="5"/>';
 if(!shape){
 const parts=Array.from(new Intl.Segmenter("de",{granularity:"grapheme"}).segment(emoji),x=>x.segment);
 if(/\bklein(?:e|en|er|es)?\b/.test(text))shape=glyph(parts[0],50,76,45);
 else if(/\bgroß(?:e|en|er|es)?\b/.test(text))shape=glyph(parts[0],50,88,94);
 else if(parts.length>1)shape=glyph(parts[0],40,72,65)+glyph(parts.slice(1).join(""),76,90,30);
 else return '<span class="singleEmoji">'+emoji+'</span>';
 }
 if(/\bgroß(?:e|en|er|es)\b/.test(text)&&text.includes("baum"))shape='<g transform="translate(-5 -5) scale(1.1)">'+shape+'</g>';
 return '<svg class="learningArt" viewBox="0 0 100 100" role="img" aria-label="'+text.replace(/"/g,"")+'">'+shape+'</svg>';
}
paintPicture(button,word){
const { soccerBallMarkup, isFootball, accessibleWord, placementPicture, pictureMarkup, paintPicture, state } = this.context;
const art=learningMarkup(word[1]);if(art){button.innerHTML=art;return}if(isFootball(word))button.innerHTML=soccerBallMarkup();else button.innerHTML=pictureMarkup(word)}
}
