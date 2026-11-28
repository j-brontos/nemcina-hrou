import { imageManifest, availableImages } from "../data/imageManifest.js";
export class ImageRepository {
 constructor(manifest=imageManifest, files=availableImages){this.manifest=manifest;this.files=files;}
 idFor(word){return this.manifest[String(word[0]).toLocaleLowerCase("de-DE").replace(/[.!?]/g,"").trim()] || null;}
 markup(word){
 const id=this.idFor(word),file=id&&this.files[id];
 if(!file || !/^[a-z0-9/-]+\.webp$/.test(file))return null;
 const url=new URL("../../assets/images/"+file,import.meta.url).href;
 return '<img class="learningArt" style="object-fit:contain" alt="" draggable="false" src="'+url+'">';
 }
}
