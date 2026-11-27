// Canonical learning data. Speech uses natural spelling; UI uses uppercase.
export const numbers=['null','eins','zwei','drei','vier','fünf','sechs','sieben','acht','neun','zehn','elf','zwölf'].map((de,value)=>({id:'number-'+value,de,cs:['nula','jedna','dva','tři','čtyři','pět','šest','sedm','osm','devět','deset','jedenáct','dvanáct'][value],value,art:'number:'+value}));
export const colors=[
['rot','červená','#e64545','rote'],['blau','modrá','#3979d9','blaue'],['grün','zelená','#47a963','grüne'],['gelb','žlutá','#f2c831','gelbe'],['orange','oranžová','#ef8b32','orange'],['rosa','růžová','#e77fae','rosa'],['violett','fialová','#8952c8','violette'],['schwarz','černá','#202638','schwarze'],['weiß','bílá','#ffffff','weiße'],['braun','hnědá','#9b6235','braune']
].map(([de,cs,hex,adjective])=>({id:'color-'+de,de,cs,hex,adjective,art:'color:'+de}));
export const activities=[
['rennen','běhat','renne','rennst','rennt','Rád běhám.','Běháš rád?'],['malen','malovat','male','malst','malt','Rád maluji.','Maluješ rád?'],['schaukeln','houpat se','schaukle','schaukelst','schaukelt','Rád se houpám.','Houpáš se rád?'],['wippen','houpat se na vahadle','wippe','wippst','wippt','Rád se houpám na vahadle.','Houpáš se rád na vahadle?'],['rutschen','klouzat se','rutsche','rutschst','rutscht','Rád se kloužu.','Kloužeš se rád?'],['klettern','lézt','klettere','kletterst','klettert','Rád lezu.','Lezeš rád?'],['hüpfen','poskakovat','hüpfe','hüpfst','hüpft','Rád poskakuji.','Poskakuješ rád?']
].map(([de,cs,ich,du,third,likeCs,questionCs])=>({id:'activity-'+de,de,cs,ich,du,third,likeCs,questionCs,art:'activity:'+de}));
const cap=s=>s[0].toLocaleUpperCase('de-DE')+s.slice(1);
export function coloredNumber(value,colorId,sentence=false){
 const n=numbers[value],c=colors.find(c=>c.de===colorId);
 if(!n||!c)throw new RangeError('Unknown number or color');
 return {id:'colored-'+value+'-'+colorId+(sentence?'-sentence':''),de:sentence?'Die '+cap(n.de)+' ist '+c.de+'.':'die '+c.adjective+' '+cap(n.de),cs:sentence?'Číslice '+value+' je '+c.cs+'.':c.cs+' číslice '+value,art:'number:'+value+':'+colorId,value,colorId};
}
const pairs=['violett','rot','rosa','blau','grün','gelb'];
export const combinations=pairs.map((c,i)=>coloredNumber(i+1,c));
export const numberSentences=pairs.map((c,i)=>coloredNumber(i+1,c,true));
export const favorites=activities.map(a=>({id:a.id+'-like',de:'Ich '+a.ich+' gern.',cs:a.likeCs,art:a.art}));
export const questions=activities.map(a=>({id:a.id+'-question',de:cap(a.du)+' du gern?',cs:a.questionCs,art:a.art}));
const entries=(kind,rows)=>rows.map(([de,cs,plural],i)=>({id:kind+'-'+encodeURIComponent(de.toLocaleLowerCase('de-DE')).replace(/%/g,'_'),de,cs,plural,kind}));
export const phrases=entries('phrase',[
['Was machst du gern?','Co rád děláš?'],['Was macht das Kind?','Co dělá dítě?'],['Komm vorbei.','Přijď na návštěvu.'],['Dino ist hier.','Dino je tady.'],['alte Hexe','stará čarodějnice'],['Gute Nacht.','Dobrou noc.'],['schlafen gehen','jít spát'],['Die Wölfe kommen.','Vlci přicházejí.'],['Ich bin dran.','Jsem na řadě.'],['Du bist dran.','Jsi na řadě.'],['Gewonnen!','Vyhráno!'],['Super!','Super!'],['Toll!','Skvělé!'],['Welche Zahl ist das?','Jaké je to číslo?'],['Welche Farbe ist das?','Jaká je to barva?'],['Wie viele sind es?','Kolik jich je?'],['Zähle bis zehn.','Počítej do deseti.'],['Zeig mir die Fünf.','Ukaž mi pětku.'],['Male die Zwei rot.','Vybarvi dvojku červeně.'],['Renne!','Běhej!'],['Male!','Maluj!'],['Schaukle!','Houpej se!'],['Wippe!','Houpej se na vahadle!'],['Rutsche!','Klouzej se!'],['Klettere!','Lez!'],['Hüpfe!','Poskoč!'],['Klatsche!','Zatleskej!'],['Renne auf der Stelle!','Běhej na místě!'],['Hüpfe dreimal!','Třikrát poskoč!'],['Klatsche fünfmal!','Pětkrát zatleskej!']]);
export const extra=entries('word',[
['die Zahl','číslo','die Zahlen'],['die Zahlen','čísla'],['die Farbe','barva','die Farben'],['die Farben','barvy'],['die Hexe','čarodějnice','die Hexen'],['der Wolf','vlk','die Wölfe'],['die Wölfe','vlci'],['die Nacht','noc','die Nächte'],['das Kind','dítě','die Kinder'],['die Kinder','děti'],['die Schaukel','houpačka','die Schaukeln'],['die Wippe','vahadlová houpačka','die Wippen'],['die Rutsche','skluzavka','die Rutschen'],['das Klettergerüst','prolézačka','die Klettergerüste'],['der Spielplatz','dětské hřiště','die Spielplätze'],['der Würfel','hrací kostka','die Würfel'],['das Spiel','hra','die Spiele'],['zählen','počítat'],['spielen','hrát si'],['klatschen','tleskat'],['gern','rád'],['einmal','jednou'],['zweimal','dvakrát'],['dreimal','třikrát'],['viermal','čtyřikrát'],['fünfmal','pětkrát'],['sechsmal','šestkrát']]);
export const vocabulary=[...numbers,...colors,...activities,...combinations,...numberSentences,...favorites,...questions,...phrases,...extra];
export const tuple=e=>[e.de,e.art,e.id];
export const newTopics=[{id:'numbers-colors',title:'ZAHLEN UND FARBEN',icon:'🔢',items:numbers.map(tuple)},{id:'favorite-activities',title:'WAS MACHST DU GERN?',icon:'🎨',items:activities.map(tuple)}];
export const newLevelTwo=[combinations.map(tuple),favorites.map(tuple)];
export const newRhymes=[
{title:'ZAHLEN BIS ZEHN',icon:'🔢',lines:['Eins, zwei, drei, vier, fünf, sechs.','Sieben, acht, neun, zehn.','Sieben, acht, neun, zehn.','Ich bin dran. Du bist dran.','Super, super – toll, toll, toll.','Eins, zwei, drei.','Vier, fünf, sechs.','Sieben, acht, neun, zehn.']},
{title:'ZAHLEN BIS ZWÖLF',icon:'🔢',lines:['Eins, zwei – komm vorbei.','Drei, vier – Dino ist hier.','Fünf, sechs – alte Hex’!','Sieben, acht – gute Nacht.','Neun, zehn – schlafen gehen.','Elf, zwölf – kommen Wölf’!']},
{title:'WAS MACHST DU GERN?',icon:'🎨',lines:[...favorites.map(a=>a.de),'Ich hüpfe gern.']}
].map(r=>({...r,speech:r.lines.join(' ')}));
