// Author: Adis
const mascotButton=document.querySelector('#mascot');
if(mascotButton){
 const messages=['Selamat datang di DISCO XIII.','Kebersamaan, disajikan istimewa.','Silakan buka menu divisi kami.'];let current=0;
 mascotButton.addEventListener('click',()=>{current=(current+1)%messages.length;document.querySelector('#greeting').textContent=messages[current];});
}
const turningSurfaces=new WeakSet();
async function turnPaper(surface, render, direction=1){
 if(turningSurfaces.has(surface))return false;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||!surface.animate){render();return true;}
 turningSurfaces.add(surface);surface.setAttribute('aria-busy','true');
 surface.dataset.turning=direction>0?'forward':'backward';
 const origin=direction>0?'left center':'right center';
 let animation;
 try{
  animation=surface.animate([{transform:'perspective(1600px) rotateY(0deg)',opacity:1,transformOrigin:origin},{transform:`perspective(1600px) rotateY(${-direction*84}deg)`,opacity:.55,transformOrigin:origin}],{duration:240,easing:'cubic-bezier(.55,0,.8,.45)',fill:'forwards'});
  await animation.finished;render();animation.cancel();
  animation=surface.animate([{transform:`perspective(1600px) rotateY(${direction*84}deg)`,opacity:.55,transformOrigin:origin},{transform:'perspective(1600px) rotateY(0deg)',opacity:1,transformOrigin:origin}],{duration:380,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});
  await animation.finished;
 }finally{animation?.cancel();delete surface.dataset.turning;surface.setAttribute('aria-busy','false');turningSurfaces.delete(surface);}
 return true;
}
const chapters=[...document.querySelectorAll('[data-division]')];
const panels=[...document.querySelectorAll('.division-panel')];
if(panels.length){
 let current=0;
 const previous=document.querySelector('#division-prev'),next=document.querySelector('#division-next');
 function renderChapter(index){
  current=index;panels.forEach((panel,i)=>{panel.hidden=i!==current;});
  chapters.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===current)));
  previous.disabled=current===0;next.disabled=current===panels.length-1;
  document.querySelector('#division-position').textContent=`Bab ${current+1} dari ${panels.length}`;
 }
 async function showChapter(index){
  const target=Math.max(0,Math.min(panels.length-1,index));if(target===current)return;
  await turnPaper(document.querySelector('.menu-pages'),()=>renderChapter(target),target>current?1:-1);
 }
 chapters.forEach((button,index)=>button.addEventListener('click',async()=>{await showChapter(index);if(matchMedia('(max-width: 600px)').matches)panels[current].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}));
 previous.addEventListener('click',()=>showChapter(current-1));next.addEventListener('click',()=>showChapter(current+1));
 document.querySelector('.book-controls').hidden=false;renderChapter(0);
}
const leaves=[...document.querySelectorAll('.album-leaf')];
if(leaves.length){
 let spread=0;const total=Math.ceil(leaves.length/2);
 const previous=document.querySelector('#album-prev'),next=document.querySelector('#album-next');
 function renderSpread(index){
  spread=index;leaves.forEach((leaf,i)=>{leaf.hidden=Math.floor(i/2)!==spread;});
  previous.disabled=spread===0;next.disabled=spread===total-1;
  document.querySelector('#album-position').textContent=`Lembar ${spread+1} dari ${total}`;
 }
 async function showSpread(index){
  const target=Math.max(0,Math.min(total-1,index));if(target===spread)return;
  await turnPaper(document.querySelector('.album-book'),()=>renderSpread(target),target>spread?1:-1);
 }
 previous.addEventListener('click',()=>showSpread(spread-1));next.addEventListener('click',()=>showSpread(spread+1));
 document.querySelector('.album-controls').hidden=false;renderSpread(0);
}
