function webSVG(){
  const cx=300, n=8, rings=6, ang=i=>(95+i*10.5)*Math.PI/180;
  const pt=(a,r)=>[(cx+Math.cos(a)*r).toFixed(1),(Math.sin(a)*r).toFixed(1)];
  let p='';
  for(let i=0;i<n;i++) p+=`<path pathLength="1" style="--i:${i}" d="M${cx} 0L${pt(ang(i),460).join(' ')}"/>`;
  for(let k=1;k<=rings;k++){ const r=k*k*9+30;
    for(let i=0;i<n-1;i++){ const [x1,y1]=pt(ang(i),r),[x2,y2]=pt(ang(i+1),r),[mx,my]=pt((ang(i)+ang(i+1))/2,r*.86);
      p+=`<path pathLength="1" style="--i:${n+k}" d="M${x1} ${y1}Q${mx} ${my} ${x2} ${y2}"/>`; } }
  return `<svg class="web" viewBox="0 0 300 400" preserveAspectRatio="xMaxYMin slice" aria-hidden="true">${p}</svg>`;
}


const THEMES={
  upside:{fx:'spores',glow:'#e0243a',title:'#ff5a68',art:'radial-gradient(circle at 50% 0,#4a0a18,#07080d 75%)'},
  web:{fx:'web',glow:'#e23636',art:'linear-gradient(155deg,#1c3f9e,#6d0f1c)'},
  sand:{fx:'sand',glow:'#f08a2a',art:'linear-gradient(180deg,#3a2210,#c2622a 70%,#f0a85a)'},
  ember:{fx:'embers',glow:'#ff6a2a',art:'linear-gradient(180deg,#1a0705,#6b1d0a)'},
  space:{fx:'stars',glow:'#6aa8ff',art:'radial-gradient(circle at 30% 0,#14264d,#05060d 70%)'},
  rain:{fx:'rain',glow:'#4a7bd0',art:'linear-gradient(180deg,#0a1020,#1b2a44)'},
  code:{fx:'code',glow:'#27e07a',title:'#5dffa0',art:'linear-gradient(180deg,#02100a,#052b18)'},
  snow:{fx:'snow',glow:'#bfe3ff',art:'linear-gradient(180deg,#1a2a3a,#4a6178)'},
  gold:{fx:'sparks',glow:'#f4b942',art:'linear-gradient(180deg,#2a1d07,#6b4a10)'}
};
const THEME_BY_ID={1:'space',2:'rain',3:'gold',4:'rain',7:'code',10:'ember',12:'ember',15:'gold',16:'ember',17:'space',18:'rain',19:'rain',25:'gold',26:'snow',27:'gold',28:'sand',30:'ember',31:'space',32:'space'};
const GENRE_THEME={'Ужасы':'upside','Фантастика':'space','Боевик':'ember','Криминал':'rain','Фэнтези':'gold','Аниме':'snow'};
const themeOf=m=>THEMES[m.theme]?m.theme:THEME_BY_ID[m.id]||m.genres.map(g=>GENRE_THEME[g]).find(Boolean)||'gold';

const FX={
  spores:{n:60,vx:[-.1,.1],vy:[-.8,-.2],r:[.6,2.6],rgb:'255,80,90',glow:1,wob:.35},
  embers:{n:50,vx:[-.3,.3],vy:[-1.6,-.5],r:[.8,2.2],rgb:'255,140,50',glow:1,wob:.5},
  sparks:{n:40,vx:[-.4,.4],vy:[-1.2,-.3],r:[.6,1.8],rgb:'255,215,100',glow:1,wob:.3},
  snow:{n:70,vx:[-.2,.2],vy:[.3,1],r:[.8,2.4],rgb:'230,240,255',wob:.4},
  stars:{n:80,vx:[0,0],vy:[0,0],r:[.4,1.6],rgb:'200,220,255',tw:1},
  sand:{n:60,vx:[2,5],vy:[-.2,.2],r:[.5,1.4],rgb:'255,196,120',line:3},
  rain:{n:60,vx:[-.5,-.3],vy:[9,14],r:[.5,1],rgb:'150,180,255',line:1.6},
  code:{n:45,vx:[0,0],vy:[1.5,4],r:[12,16],rgb:'39,224,122',glyph:1}
};

function runFx(name){
  const o=FX[name]; if(!o) return;
  const c=document.createElement('canvas'), x=c.getContext('2d');
  c.className='fx'; document.body.appendChild(c);
  const rnd=([a,b])=>a+Math.random()*(b-a);
  let W,H,last=0,on=true;
  const size=()=>{ W=c.width=innerWidth; H=c.height=innerHeight; };
  size(); addEventListener('resize',size);
  const ps=Array.from({length:o.n},()=>({x:Math.random()*W,y:Math.random()*H,vx:rnd(o.vx),vy:rnd(o.vy),r:rnd(o.r),ph:Math.random()*6}));
  const tick=t=>{
    if(on&&t-last>33){
      last=t; x.clearRect(0,0,W,H);
      for(const p of ps){
        p.ph+=.03; p.x+=p.vx+(o.wob?Math.sin(p.ph)*o.wob:0); p.y+=p.vy;
        if(p.x>W+20) p.x=-20; if(p.x<-20) p.x=W+20; if(p.y>H+20) p.y=-20; if(p.y<-20) p.y=H+20;
        const a=o.tw?.3+.7*Math.abs(Math.sin(p.ph)):.45+.45*Math.sin(p.ph)**2;
        x.fillStyle=x.strokeStyle=`rgba(${o.rgb},${a})`;
        if(o.glyph){ x.font=`${p.r}px monospace`; x.fillText(String.fromCharCode(0x30A0+Math.random()*60|0),p.x,p.y); }
        else if(o.line){ x.lineWidth=p.r; x.beginPath(); x.moveTo(p.x,p.y); x.lineTo(p.x-p.vx*o.line,p.y-p.vy*o.line); x.stroke(); }
        else{ x.shadowColor=o.glow?`rgb(${o.rgb})`:'transparent'; x.shadowBlur=o.glow?10:0; x.beginPath(); x.arc(p.x,p.y,p.r,0,7); x.fill(); }
      }
    }
    requestAnimationFrame(tick);
  };
  document.addEventListener('visibilitychange',()=>{ on=!document.hidden; });
  requestAnimationFrame(tick);
}

function startTheme(m,host){
  const t=THEMES[themeOf(m)];
  host.style.setProperty('--glow',t.glow);
  host.querySelector('.mv-bg').style.setProperty('--art',t.art);
  host.querySelector('h1').style.cssText=`color:${t.title||'inherit'};text-shadow:0 0 28px ${t.glow}`;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(t.fx==='web'){
    host.insertAdjacentHTML('afterbegin',webSVG());
    const w=host.querySelector('.web');
    setTimeout(()=>w.classList.add('on'),60);
  } else runFx(t.fx);
}
