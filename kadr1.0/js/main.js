function particles(card){
  const c=card.querySelector('canvas'), x=c.getContext('2d'), sand=card.dataset.theme==='sand';
  let W,H,ps,run=false;
  const init=()=>{ W=c.width=card.clientWidth; H=c.height=card.clientHeight;
    ps=Array.from({length:sand?110:70},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2+.5,s:Math.random()+.3,p:Math.random()*6})); };
  const tick=()=>{ if(!run) return; x.clearRect(0,0,W,H);
    for(const p of ps){ p.p+=.03;
      if(sand){ p.x+=p.s*4; p.y+=Math.sin(p.p)*.4;
        x.strokeStyle=`rgba(255,196,120,${.25+p.s*.4})`; x.lineWidth=p.r*.7;
        x.beginPath(); x.moveTo(p.x,p.y); x.lineTo(p.x-p.s*14,p.y); x.stroke();
        if(p.x>W+20) p.x=-20;
      } else { p.y-=p.s*.6; p.x+=Math.sin(p.p)*.35;
        x.fillStyle=`rgba(255,80,90,${.25+.35*Math.sin(p.p)**2})`; x.shadowColor='#ff2a40'; x.shadowBlur=10;
        x.beginPath(); x.arc(p.x,p.y,p.r,0,7); x.fill();
        if(p.y<-5){ p.y=H+5; p.x=Math.random()*W; } } }
    requestAnimationFrame(tick); };
  const on=()=>{ if(run) return; init(); run=true; tick(); }, off=()=>{ run=false; };
  card.addEventListener('pointerenter',on); card.addEventListener('focusin',on);
  card.addEventListener('pointerleave',off); card.addEventListener('focusout',off);
}

function renderFeatured(list){
  $('#featured').innerHTML = list.map(m=>`
    <article class="feat" tabindex="0" role="button" data-id="${m.id}" data-theme="${m.theme}" style="--glow:${m.glow}">
      <div class="poster">${img(m)}</div>${m.theme==='web'?webSVG():'<canvas></canvas>'}
      <div class="info"><small>${m.type}, ${m.year}</small><h3>${m.title}</h3><span>★ ${m.rating}</span></div>
    </article>`).join('');
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)
    document.querySelectorAll('.feat canvas').forEach(c=>particles(c.parentElement));
}


const shuffle=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.random()*(i+1)|0; [a[i],a[j]]=[a[j],a[i]]; } return a; };
const renderPick=()=>{ $('#grid').innerHTML=shuffle(ALL).slice(0,12).map(cardHTML).join(''); };
(async()=>{
  const d=await loadMovies(); ALL=[...d.catalog,...d.featured];
  renderFeatured(d.featured); renderPick();
})();
$('#shuffle').addEventListener('click',renderPick);
$('#heroSearch').addEventListener('submit',e=>{ e.preventDefault(); location.href='catalog.html?q='+encodeURIComponent($('#q').value.trim()); });
['#featured','#grid'].forEach(s=>$(s).addEventListener('click',e=>{ const t=e.target.closest('[data-id]'); if(t) openMovie(t.dataset.id); }));
$('#featured').addEventListener('keydown',e=>{ if(e.key==='Enter'){ const t=e.target.closest('[data-id]'); if(t) openMovie(t.dataset.id); } });
