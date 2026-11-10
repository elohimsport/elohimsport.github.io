const IMG = Object.assign({ logo: "img/logo-elohim.svg" }, window.CAMISETAS_3D);
const WHATSAPP='593981785781'; // con código de país, sin "+" ni espacios
const LINES={
  amateur:{kit:20,shirt:13,img:IMG.red,edge:'#5e0a0f',
    fill:'radial-gradient(120% 80% at 50% 0%,#e0242c,#b10f18 60%,#8a0c12)',ink:'#fff',stroke:'transparent',
    spec:'Microfibra Zidán / Holanda 100% poliéster, Dry-Fit. Costuras anti-tirón y sublimación 100% digital.'},
  semipro:{kit:23,shirt:14.5,img:IMG.black,edge:'#050505',
    fill:'linear-gradient(90deg,#b5121b 0 4%,#161618 4% 96%,#b5121b 96%)',ink:'#fff',stroke:'transparent',
    spec:'Terry Premium + micro-malla Nico transpirable. Escudos termo-adheridos y patronaje Semi-Fit.'},
  pro:{kit:38,shirt:25,img:IMG.stripe,edge:'#2b1414',
    fill:'repeating-linear-gradient(90deg,#17673a 0 26px,#f2f2f2 26px 34px,#b3141c 34px 60px,#f2f2f2 60px 68px)',ink:'#fff',stroke:'#111',
    spec:'Telas importadas de alta densidad, corte anatómico de élite y escudo TPU 3D de alta frecuencia.'}
};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 3D JERSEY ---------- */
const j3d=document.getElementById('j3d'), shadow=document.getElementById('shadow');
const DEPTH=16, N=12;
let exts=[], front, back, bname, bnum;
(function build(){
  for(let i=0;i<N;i++){
    const e=document.createElement('div'); e.className='ext';
    const z=DEPTH/2-(i+1)*(DEPTH/(N+1));
    e.style.transform=`translateZ(${z}px)`;
    j3d.appendChild(e); exts.push(e);
  }
  back=document.createElement('div'); back.className='face back';
  back.style.transform=`rotateY(180deg) translateZ(${DEPTH/2}px)`;
  back.innerHTML=`<div class="bname"></div><div class="bnum"></div><img class="blogo" src="${IMG.logo}" alt="">`;
  j3d.appendChild(back);
  front=document.createElement('div'); front.className='face front';
  front.style.transform=`translateZ(${DEPTH/2}px)`;
  front.innerHTML='<img alt="Camiseta">';
  j3d.appendChild(front);
  bname=back.querySelector('.bname'); bnum=back.querySelector('.bnum');
})();
function skin(k){
  const L=LINES[k], m=`url(${L.img})`;
  front.querySelector('img').src=L.img;
  exts.forEach((e,i)=>{e.style.webkitMaskImage=m;e.style.maskImage=m;
    const t=i/(N-1); e.style.background=L.edge; e.style.filter=`brightness(${1.25-t*0.5})`;});
  back.style.webkitMaskImage=m; back.style.maskImage=m; back.style.background=L.fill;
  [bname,bnum].forEach(el=>{el.style.color=L.ink;el.style.webkitTextStroke=L.stroke==='transparent'?'0':`2px ${L.stroke}`});
}
const S={ry:-22,rx:6,idle:1,scale:1,y:0};
function render(t){
  const sway=reduce?0:Math.sin(t/1500)*16*S.idle, bob=reduce?0:Math.sin(t/1100)*7*S.idle;
  const ry=S.ry+sway;
  j3d.style.transform=`translateY(${S.y+bob}px) rotateX(${S.rx}deg) rotateY(${ry}deg) scale(${S.scale})`;
  const c=Math.abs(Math.cos(ry*Math.PI/180));
  shadow.style.transform=`scaleX(${(0.55+0.45*c)*S.scale}) scaleY(${1-bob/40})`;
  shadow.style.opacity=0.6+0.3*S.scale-0.3;
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

const stage=document.getElementById('stage');
let drag=false,lx=0,ly=0,vel=0;
stage.addEventListener('pointerdown',e=>{
  if(e.target.closest('.stage-ui'))return;
  drag=true;lx=e.clientX;ly=e.clientY;vel=0;stage.setPointerCapture(e.pointerId);
  anime.remove(S);anime({targets:S,idle:0,duration:250,easing:'easeOutQuad'});
});
stage.addEventListener('pointermove',e=>{
  if(!drag)return;
  const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;
  S.ry+=dx*0.55; S.rx=Math.max(-28,Math.min(28,S.rx-dy*0.3)); vel=dx*0.55;
});
const endDrag=()=>{
  if(!drag)return;drag=false;
  anime.remove(S);
  anime({targets:S,ry:S.ry+vel*14,rx:6,idle:[0,0],duration:1600,easing:'easeOutQuart',
    complete:()=>anime({targets:S,idle:1,duration:1400,easing:'easeInOutSine'})});
};
stage.addEventListener('pointerup',endDrag);stage.addEventListener('pointercancel',endDrag);

function faceTo(deg){
  const target=Math.round((S.ry-deg)/360)*360+deg;
  anime.remove(S);
  anime({targets:S,ry:target,rx:4,idle:0.25,duration:1300,easing:'spring(1, 70, 11, 0)'});
}
const chips=[...document.querySelectorAll('.chip')];
const chipOn=b=>{chips.forEach(c=>c.classList.toggle('on',c===b))};
document.getElementById('bFront').onclick=e=>{chipOn(e.currentTarget);faceTo(0)};
document.getElementById('bBack').onclick=e=>{chipOn(e.currentTarget);faceTo(180)};
document.getElementById('bSpin').onclick=e=>{chipOn(e.currentTarget);anime.remove(S);
  anime({targets:S,ry:Math.round(S.ry/360)*360+360,rx:6,idle:0,duration:1800,easing:'easeInOutCubic',
    complete:()=>anime({targets:S,idle:1,duration:1000,easing:'easeInOutSine'})})};

const inName=document.getElementById('inName'), inNum=document.getElementById('inNum');
function setBack(){bname.textContent=(inName.value||'').toUpperCase();bnum.textContent=String(inNum.value||'').slice(0,2)}
inName.addEventListener('input',()=>{setBack();if(Math.abs(((S.ry%360)+360)%360-180)>60)faceTo(180)});
inNum.addEventListener('input',()=>{setBack();if(Math.abs(((S.ry%360)+360)%360-180)>60)faceTo(180)});
setBack();

/* ---------- LINE SWITCH ---------- */
let current='amateur', busy=false;
const tabs=[...document.querySelectorAll('.tab')], pill=document.querySelector('.tab-pill');
function movePill(btn,instant){
  const r=btn.getBoundingClientRect(), p=btn.parentElement.getBoundingClientRect();
  anime({targets:pill,left:r.left-p.left,width:r.width,duration:instant?0:600,easing:'spring(1, 80, 13, 0)'});
}
const fmt=(v,d)=>v.toFixed(d);
function countTo(el,to,dec){
  const o={v:parseFloat(el.textContent)||0};
  anime({targets:o,v:to,duration:900,easing:'easeOutExpo',update:()=>el.textContent=fmt(o.v,dec)});
}
function setInfo(k){
  const L=LINES[k];
  countTo(document.getElementById('hKit'),L.kit,0);
  countTo(document.getElementById('hShirt'),L.shirt,2);
  const sp=document.getElementById('hSpec');
  anime({targets:sp,opacity:[1,0],translateY:[0,-8],duration:200,easing:'easeInQuad',complete:()=>{
    sp.textContent=L.spec;anime({targets:sp,opacity:[0,1],translateY:[8,0],duration:400,easing:'easeOutQuad'})}});
}
function switchLine(k){
  if(k===current||busy)return; busy=true; current=k;
  tabs.forEach(t=>t.classList.toggle('on',t.dataset.k===k));
  movePill(tabs.find(t=>t.dataset.k===k));
  setInfo(k);
  anime.remove(S);
  const base=Math.round(S.ry/360)*360;
  anime.timeline({easing:'easeInQuad'})
    .add({targets:S,ry:base+90,scale:.82,y:-20,idle:0,rx:0,duration:380,complete:()=>skin(k)})
    .add({targets:S,ry:base+360,scale:1,y:0,rx:6,duration:1100,easing:'spring(1, 75, 12, 0)'})
    .add({targets:S,idle:1,duration:900,easing:'easeInOutSine',complete:()=>{busy=false}},'-=500');
  chipOn(document.getElementById('bFront'));
}
tabs.forEach(t=>t.onclick=()=>switchLine(t.dataset.k));

/* ---------- TILT + FLIP CARDS ---------- */
document.querySelectorAll('.card').forEach(card=>{
  const tilt=card.querySelector('.tilt'), flip=card.querySelector('.flip'), glare=card.querySelector('.glare');
  let flipped=false;
  card.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch')return;
    const r=card.getBoundingClientRect(), px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
    anime.remove(tilt);
    anime({targets:tilt,rotateY:(px-.5)*22,rotateX:(.5-py)*18,translateZ:20,duration:450,easing:'easeOutQuad'});
    if(glare){glare.style.setProperty('--gx',px*100+'%');glare.style.setProperty('--gy',py*100+'%')}
  });
  card.addEventListener('pointerleave',()=>{
    anime.remove(tilt);
    anime({targets:tilt,rotateY:0,rotateX:0,translateZ:0,duration:1100,easing:'spring(1, 60, 9, 0)'});
  });
  card.addEventListener('click',()=>{
    flipped=!flipped; anime.remove(flip);
    anime({targets:flip,rotateY:flipped?180:0,duration:1200,easing:'spring(1, 70, 12, 0)'});
  });
});

/* ---------- SCROLL REVEAL ---------- */
const io=new IntersectionObserver(es=>es.forEach(en=>{
  if(!en.isIntersecting)return; io.unobserve(en.target);
  const items=en.target.querySelectorAll('.r');
  if(reduce){items.forEach(i=>i.style.opacity=1);return}
  anime({targets:items,opacity:[0,1],translateY:[36,0],duration:900,delay:anime.stagger(90),easing:'easeOutCubic'});
  en.target.querySelectorAll('.model img').forEach(img=>anime({targets:img,scale:[1.25,1.08],duration:1800,easing:'easeOutCubic'}));
}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(s=>io.observe(s));

/* ---------- QUOTE ---------- */
const Q={line:'amateur',type:'kit',units:12,long:false};
const qTotal=document.getElementById('qTotal'), qBreak=document.getElementById('qBreak'), qUnits=document.getElementById('qUnits');
const qObj={v:0};
function calc(){
  const L=LINES[Q.line], unit=(Q.type==='kit'?L.kit:L.shirt)+(Q.long?2:0), tot=unit*Q.units;
  qUnits.value=Q.units; qUnits.textContent=Q.units;
  qBreak.textContent=`${Q.units} × $${unit.toFixed(2)} por unidad`;
  // el botón abre WhatsApp con el pedido ya escrito
  const nombres={amateur:'Amateur',semipro:'Semi-Pro',pro:'Profesional'};
  const msg=`Hola Elohim Sport, quiero cotizar este pedido:\n`+
    `• Línea: ${nombres[Q.line]}\n`+
    `• Prenda: ${Q.type==='kit'?'Kit completo':'Solo camiseta'}${Q.long?' (manga larga)':''}\n`+
    `• Unidades: ${Q.units}\n`+
    `• Total estimado: $${tot.toFixed(2)} ($${unit.toFixed(2)} por unidad)`;
  document.getElementById('qEnviar').href=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  anime.remove(qObj);
  anime({targets:qObj,v:tot,duration:800,easing:'easeOutExpo',update:()=>qTotal.textContent=qObj.v.toFixed(2)});
}
function seg(id,key,attr){
  const btns=[...document.querySelectorAll(`#${id} button`)];
  btns.forEach(b=>b.onclick=()=>{Q[key]=b.dataset[attr];btns.forEach(x=>x.classList.toggle('on',x===b));
    anime({targets:b,scale:[.92,1],duration:500,easing:'spring(1, 90, 10, 0)'});calc()});
  return btns;
}
const lineBtns=seg('qLine','line','k'); seg('qType','type','t');
const bump=()=>anime({targets:qUnits,scale:[1.3,1],duration:500,easing:'spring(1, 90, 10, 0)'});
document.getElementById('qMinus').onclick=()=>{Q.units=Math.max(6,Q.units-1);bump();calc()};
document.getElementById('qPlus').onclick=()=>{Q.units=Math.min(500,Q.units+1);bump();calc()};
document.getElementById('qLong').onchange=e=>{Q.long=e.target.checked;calc()};
document.querySelectorAll('[data-pick]').forEach(a=>a.addEventListener('click',()=>{
  lineBtns.find(b=>b.dataset.k===a.dataset.pick).click();
}));

/* ---------- INTRO ---------- */
skin('amateur'); setInfo('amateur');
requestAnimationFrame(()=>movePill(tabs[0],true));
addEventListener('resize',()=>movePill(tabs.find(t=>t.classList.contains('on')),true));
calc();
document.querySelectorAll('.streak').forEach((s,i)=>{
  s.style.top=(30+i*18)+'%'; s.style.transform='rotate(-8deg)';
  if(!reduce)anime({targets:s,left:['-40vw','110vw'],duration:3200+i*900,delay:i*1100,easing:'easeInOutSine',loop:true});
});
if(!reduce){
  S.ry=-560;S.scale=.6;S.idle=0;S.y=-60;
  anime.timeline()
    .add({targets:'.hero-logo',clipPath:['inset(0 100% 0 0)','inset(0 0% 0 0)'],duration:1100,easing:'easeInOutQuart'})
    .add({targets:['.hero h1','.hero .lead','.tabs','.hero-meta','.hero-spec','.custom'],opacity:[0,1],translateY:[24,0],delay:anime.stagger(70),duration:800,easing:'easeOutCubic'},'-=600')
    .add({targets:S,ry:-22,scale:1,y:0,duration:2200,easing:'easeOutExpo'},0)
    .add({targets:S,idle:1,duration:1200,easing:'easeInOutSine'},'-=900');
}else{document.querySelector('.hero-logo').style.clipPath='none'}

/* ---------- PERSONALIZACIÓN EN CELULAR ---------- */
// En pantallas chicas los campos de nombre y número viven en una ventana, para no
// escribir lejos de la camiseta. Al cerrar, la camiseta gira y muestra la espalda.
(function(){
  const pers=document.getElementById('pers'), persCampos=document.getElementById('persCampos');
  const heroCustom=document.querySelector('.custom'), persVista=document.getElementById('persVista');
  const pvNombre=document.getElementById('pvNombre'), pvNum=document.getElementById('pvNum');
  const campos=[inName.closest('label'), inNum.closest('label')];
  const movil=matchMedia('(max-width:900px)');
  function ubicar(){
    if(movil.matches){persCampos.append(...campos)}
    else{if(pers.open)pers.close(); heroCustom.prepend(...campos)}
  }
  movil.addEventListener('change',ubicar); ubicar();
  function vista(){
    const L=LINES[current];
    persVista.style.background=L.fill;
    pvNombre.textContent=(inName.value||'').toUpperCase();
    pvNum.textContent=String(inNum.value||'').slice(0,2);
    [pvNombre,pvNum].forEach(el=>{el.style.webkitTextStroke=L.stroke==='transparent'?'0':`1.5px ${L.stroke}`});
  }
  inName.addEventListener('input',vista); inNum.addEventListener('input',vista);
  document.getElementById('persAbrir').onclick=()=>{vista(); pers.showModal()};
  document.getElementById('persCerrar').onclick=()=>pers.close();
  pers.addEventListener('click',e=>{   // toque fuera de la ventana
    const r=pers.getBoundingClientRect();
    if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)pers.close();
  });
  document.getElementById('persListo').onclick=()=>{
    pers.close();
    stage.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'});
    chipOn(document.getElementById('bBack')); faceTo(180);
  };
})();
