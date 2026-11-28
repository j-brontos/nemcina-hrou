import { imageManifest, availableImages } from "../data/imageManifest.js";
export class ImageRepository {
 constructor(manifest=imageManifest, files=availableImages){this.manifest=manifest;this.files=files;}
 idFor(word){const key=String(word[0]).toLocaleLowerCase("de-DE").replace(/[.!?]/g,"").trim();return this.manifest[key] || this.manifest[key.replace(/ ist (oben|unten|links|rechts|in der mitte)$/,"")] || this.manifest[key.replace(/^(der|die|das) /,"")] || null;}
 markup(word){
 const id=this.idFor(word),file=id&&this.files[id];
 if(!file || !/^[a-z0-9/-]+\.webp$/.test(file))return null;
 const url=new URL("../../assets/images/"+file,import.meta.url).href;
 return '<img class="learningArt" style="object-fit:contain" alt="" draggable="false" src="'+url+'">';
 }
}
