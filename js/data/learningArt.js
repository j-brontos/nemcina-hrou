import { colors } from './expandedVocabulary.js';
const stroke='#30394b', skin='#f3bc8b', shirt='#5865d8';
const child=(x,y,arms,legs)=>'<circle cx="'+x+'" cy="'+(y-13)+'" r="10" fill="'+skin+'" stroke="'+stroke+'" stroke-width="2"/><path d="M'+(x-9)+' '+(y-17)+' Q'+x+' '+(y-30)+' '+(x+9)+' '+(y-17)+'" fill="#754b32"/><path d="M'+x+' '+y+' v23" stroke="'+shirt+'" stroke-width="13" stroke-linecap="round"/><path d="'+arms+'" stroke="'+skin+'" stroke-width="6" stroke-linecap="round" fill="none"/><path d="'+legs+'" stroke="'+stroke+'" stroke-width="7" stroke-linecap="round" fill="none"/>';
const arts={
rennen:child(49,35,'M49 39 L32 48 22 39 M49 39 L66 30 76 39','M49 58 L31 70 15 68 M49 58 L66 70 78 86')+'<path d="M8 30 H23 M5 46 H18 M8 85 H31" stroke="#9ab6d2" stroke-width="3" stroke-linecap="round"/>',
hüpfen:child(50,27,'M50 31 L30 16 M50 31 L70 16','M50 50 L36 63 42 72 M50 50 L64 63 58 72')+'<ellipse cx="50" cy="89" rx="22" ry="4" fill="#cbd5e1"/><path d="M18 75 V55 l-5 6 m5-6 5 6 M82 75 V55 l-5 6 m5-6 5 6" stroke="#47a963" stroke-width="3" fill="none"/>',
malen:'<path d="M67 16 L52 88 M67 16 L86 88" stroke="#9b6235" stroke-width="5"/><rect x="52" y="22" width="36" height="43" rx="3" fill="#fff" stroke="#9b6235" stroke-width="3"/><circle cx="76" cy="33" r="6" fill="#f2c831"/><path d="M55 59 L66 42 82 59" fill="#47a963"/>'+child(25,40,'M25 44 L40 49 56 39 M25 44 L13 57','M25 63 L19 86 M25 63 L34 86')+'<path d="M52 42 L63 32" stroke="#9b6235" stroke-width="3"/>',
schaukeln:'<path d="M12 90 L27 8 H77 L91 90 M38 9 V62 M66 9 V62" stroke="#9b6235" stroke-width="4" fill="none"/>'+child(52,38,'M52 42 L38 33 M52 42 L66 33','M52 61 L66 68 75 60 M52 61 L61 77 73 77')+'<rect x="34" y="61" width="36" height="6" rx="3" fill="#e64545"/>',
wippen:'<path d="M40 88 L50 57 60 88Z" fill="#9b6235"/><path d="M10 68 L90 47" stroke="#e64545" stroke-width="7" stroke-linecap="round"/>'+child(23,40,'M23 44 L35 52 M23 44 L14 52','M23 63 L35 66 38 78 M23 63 L14 74')+child(76,19,'M76 23 L64 32 M76 23 L86 32','M76 42 L65 50 62 63 M76 42 L86 54'),
rutschen:'<path d="M16 86 V20 H39 M20 35 H35 M20 49 H35 M20 63 H35 M20 77 H35" stroke="#9b6235" stroke-width="4" fill="none"/><path d="M36 20 Q51 76 88 82" stroke="#3979d9" stroke-width="12" fill="none" stroke-linecap="round"/>'+child(52,31,'M52 35 L39 28 M52 35 L64 40','M52 54 L69 61 79 61 M52 54 L61 68 74 70'),
klettern:'<path d="M12 90 V12 H88 V90 M12 32 H88 M12 52 H88 M12 72 H88 M36 12 V90 M64 12 V90" stroke="#47a963" stroke-width="4" fill="none"/>'+child(50,36,'M50 40 L36 32 M50 40 L64 18','M50 59 L36 70 M50 59 L64 52')
};
export function learningMarkup(key){
 if(typeof key!=='string')return null;
 const [kind,value,color]=key.split(':');let body='';
 if(kind==='number'&&/^([0-9]|1[0-2])$/.test(value)){const fill=colors.find(c=>c.de===color)?.hex||'#5865d8';body='<text x="50" y="77" text-anchor="middle" font-family="Arial,sans-serif" font-size="80" font-weight="bold" fill="'+fill+'" stroke="#30394b" stroke-width="1.4" paint-order="stroke">'+value+'</text>'}
 else if(kind==='color'){const c=colors.find(c=>c.de===value);if(c)body='<circle cx="50" cy="50" r="37" fill="'+c.hex+'" stroke="#30394b" stroke-width="2"/>'}
 else if(kind==='activity')body=arts[value]||'';
 return body?'<svg class="learningArt" viewBox="0 0 100 100" role="img" aria-hidden="true">'+body+'</svg>':null;
}
