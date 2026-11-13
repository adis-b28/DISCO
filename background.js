// Author: Adis
(()=>{
const W=240,H=135,cv=document.querySelector('.restaurant-background'),ctx=cv.getContext('2d');
const img=ctx.createImageData(W,H),d=img.data,K={};
const k=h=>typeof h!=='string'?h:(K[h]||(K[h]=[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]));
const px=(x,y,c)=>{x|=0;y|=0;if(x<0||y<0||x>=W||y>=H)return;const i=(y*W+x)*4;c=k(c);d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2];d[i+3]=255};
const rect=(x,y,w,h,c)=>{for(let j=0;j<h;j++)for(let i=0;i<w;i++)px(x+i,y+j,c)};
const cl=(v,a,b)=>v<a?a:v>b?b:v;
function glow(x0,y0,r,c,a){c=k(c);for(let y=(y0-r)|0;y<=y0+r;y++)for(let x=(x0-r)|0;x<=x0+r;x++){
  if(x<0||y<0||x>=W||y>=H)continue;const f=Math.max(0,1-Math.hypot(x-x0,y-y0)/r),v=f*f*a,i=(y*W+x)*4;
  d[i]=Math.min(255,d[i]+c[0]*v);d[i+1]=Math.min(255,d[i+1]+c[1]*v);d[i+2]=Math.min(255,d[i+2]+c[2]*v)}}
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
// skyline
const BASE=80,sky=['#1b0a3a','#2a0c4a','#40105a','#5c1466','#7a1a6e','#9a2478','#b43480'];
const lights=['#ffd24a','#ff9a3c','#ff5ca8','#fff0b0','#c040ff','#ffb84a'];
const layers=[],beacons=[];
function city(col,hmin,hmax,wmin,wmax,dim){
  const L={b:[],w:[],col,dim};let x=-2;
  while(x<W){const w=(wmin+rnd()*(wmax-wmin))|0,h=(hmin+rnd()*(hmax-hmin))|0;L.b.push({x,w,h});
    for(let wx=x+1;wx<x+w-1;wx+=3)for(let wy=BASE-h+3;wy<BASE-1;wy+=3)if(rnd()<.7)L.w.push({x:wx,y:wy,c:lights[(rnd()*6)|0],p:4+rnd()*10,ph:rnd(),duty:.5+rnd()*.45});
    if(h>hmax*.8&&dim===1)beacons.push({x:x+(w>>1),y:BASE-h-2,ph:rnd()*3});
    x+=w+((rnd()*2)|0)}
  layers.push(L)}
city('#3a1252',10,30,6,12,.55);city('#220a34',6,22,7,14,1);
const stars=[];for(let i=0;i<40;i++)stars.push({x:(rnd()*W)|0,y:31+((rnd()*22)|0),p:rnd()*6,s:.6+rnd()*2});
function chair(x,y){rect(x,y,9,16,'#4e1a10');rect(x+1,y+1,7,13,'#56664a');rect(x+1,y+1,7,2,'#738363');rect(x,y+16,10,3,'#3f4e34');rect(x+1,y+19,1,8,'#4e1a10');rect(x+8,y+19,1,8,'#4e1a10')}
function table(x,y,w,h){
  rect(x+3,y+h,2,7,'#2e0e08');rect(x+w-5,y+h,2,7,'#2e0e08');
  rect(x-2,y+h+6,w+4,2,'#4a2c08');
  rect(x,y,w,3,'#dac895');rect(x,y+3,w,h-3,'#b9a577');rect(x,y+3,3,h-3,'#cdb987');
  rect(x,y+h-4,w,4,'#8d7c57');rect(x+(w>>1),y+3,1,h-4,'#a99568');}
function napkin(x,y){rect(x,y,5,1,'#e8dcb0');rect(x+1,y-2,3,2,'#d8caa0');px(x+2,y-3,'#e8dcb0')}
function wine(x,y,t,ph){rect(x,y,3,2,'#a050c0');px(x+1,y+2,'#7a7a8a');px(x+1,y+3,'#7a7a8a');
  const g=Math.sin(t*1.3+ph);if(g>.9){px(x,y,'#fff');px(x-1,y-1,'#ffe');px(x+3,y+1,'#ffe')}}
function candle(x,y,t,ph){rect(x,y,2,4,'#f0e4c0');const f=Math.sin(t*9+ph)*.6;px(x,y-1,'#ffcf50');px(x+(f>.3?1:0),y-2,'#ff9a30');
  glow(x+1,y-1,7,'#ffb040',.28+.07*Math.sin(t*11+ph))}
function frame(t){
  // sky
  for(let y=31;y<BASE+4;y++){const c=sky[cl(Math.floor(Math.pow((y-31)/49,1.3)*7),0,6)];for(let x=0;x<W;x++)px(x,y,c)}
  for(const s of stars){if(Math.sin(t*s.s+s.p)>-.1)px(s.x,s.y,'#c8b8f0')}
  // plane
  const ax=((t*5)%(W+60))-30,ay=38+ax*.04;
  px(ax,ay,'#9a8ab8');px(ax+1,ay,'#9a8ab8');
  if(((t*1.2)%1)<.3)px(ax-1,ay,'#ff4040');if(((t*2.4)%1)<.1)px(ax+2,ay-1,'#fff');
  // skyline
  for(const L of layers){
    for(const b of L.b){rect(b.x,BASE-b.h,b.w,b.h+4,L.col);rect(b.x,BASE-b.h,b.w,1,L.dim===1?'#4a1c66':'#4e1c68')}
    for(const w of L.w){if(((t/w.p+w.ph)%1)<w.duty){const c=k(w.c),f=L.dim;
      const cc=f===1?c:[c[0]*f|0,c[1]*f|0,c[2]*f|0];px(w.x,w.y,cc);px(w.x,w.y+1,cc)}}
  }
  for(const b of beacons)if(((t/1.6+b.ph)%1)<.4)px(b.x,b.y,'#ff3030');
  // window light sweep
  const sx=((t*14)%320)-60;for(let y=31;y<BASE;y++)for(let x=0;x<W;x++){const dd=Math.abs(x+y*.8-sx);if(dd<5){const i=(y*W+x)*4;d[i]+=10;d[i+1]+=6;d[i+2]+=14}}
  // ceiling
  for(let y=0;y<31;y++)for(let x=0;x<W;x++){const bm=x-y*1.4;px(x,y,(bm>8&&bm<42)?'#3e1a0e':(x>150?'#1a0805':'#2a0f08'))}
  rect(0,27,W,4,'#5a2c12');rect(0,31,W,1,'#8a5424');rect(0,26,W,1,'#3a180c');
  for(let x=34;x<W;x+=44){px(x,23,'#ffcf80');glow(x,23,7,'#ffa050',.18+.04*Math.sin(t*3+x))}
  // pillars
  for(const px0 of [88,168]){rect(px0,31,9,52,'#4a230f');rect(px0,31,1,52,'#7a4a1c');rect(px0+8,31,1,52,'#2a1208')}
  rect(0,80,W,8,'#3a190b');rect(0,80,W,1,'#6a3a14');
  // floor
  for(let y=88;y<H;y++){const rf=(y-88)/47;for(let x=0;x<W;x++){
    const v=.5+.5*Math.sin((x*.6+y*1.1)*.09-t*.25);
    px(x,y,['#6a420a','#8c5c12','#b07a1a','#d0961e'][cl(Math.floor(rf*1.6+v*2),0,3)])}}
  for(let x=0;x<W;x+=3){const a=.05+.05*Math.sin(t*1.5+x*.3);glow(x,92,6,(x%9?'#ff60c0':'#ffd060'),a)}
  // left column
  rect(0,31,24,80,'#4a230f');rect(22,31,2,80,'#8a5424');rect(0,108,24,5,'#2a1208');
  rect(4,36,16,12,'#2a1208');rect(5,37,14,10,'#5a2c14');rect(8,40,8,4,'#2a1208');
  rect(7,64,12,54,'#8a5a18');rect(8,66,10,50,'#2a3a4a');
  for(let i=0;i<40;i++){px(8+((i*7)%10),66+((i*13)%50),'#1e2a38');px(8+((i*5)%10),66+((i*11)%50),'#3c4c5c')}
  rect(10,56,6,7,'#d8a020');rect(11,57,4,4,'#ffe080');
  glow(13,60,16,'#ffb030',.5+.12*Math.sin(t*7)+.06*Math.sin(t*13));
  // back chairs
  chair(40,70);chair(100,72);chair(176,72);chair(206,70);
  // mid tables
  table(46,86,50,16);napkin(54,84);wine(70,80,t,0);candle(80,79,t,1);
  table(118,88,50,17);napkin(124,86);wine(142,82,t,2);candle(152,81,t,3);
  table(192,84,32,14);wine(204,78,t,4);candle(212,77,t,5);
  // front chairs
  chair(30,86);chair(104,88);chair(172,90);
  // foreground tables
  table(-4,102,44,24);napkin(8,100);wine(22,96,t,6);
  table(186,100,60,26);napkin(196,98);wine(214,94,t,7);candle(226,93,t,8);
  ctx.putImageData(img,0,0);
}
let last=0,sceneTime=0;function loop(ms){if(ms-last>=80){const delta=last?Math.min(ms-last,120):0;last=ms;if(!document.hidden&&!matchMedia('(prefers-reduced-motion: reduce)').matches)sceneTime+=delta/1000;frame(sceneTime);}requestAnimationFrame(loop);}frame(0);requestAnimationFrame(loop);})();