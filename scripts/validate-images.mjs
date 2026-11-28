import { readFile, stat } from 'node:fs/promises';
import { imageManifest, availableImages } from '../js/data/imageManifest.js';
const ids=new Set(Object.values(imageManifest));
const missing=[...ids].filter(id=>!Object.hasOwn(availableImages,id));
for(const [id,path] of Object.entries(availableImages)){
 if(!ids.has(id)||! /^[a-z0-9/-]+\.webp$/.test(path))throw Error('Invalid registry entry: '+id);
 const url=new URL('../assets/images/'+path,import.meta.url);
 const info=await stat(url);
 const bytes=await readFile(url);
 if(!info.isFile()||bytes.length<12||bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP')throw Error('Invalid WebP: '+path);
}
console.log(JSON.stringify({required:ids.size,available:ids.size-missing.length,missing},null,2));
if(missing.length&&process.argv.includes('--strict'))process.exitCode=1;
