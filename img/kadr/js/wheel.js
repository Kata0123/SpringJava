let LIST=[], rot=0, busy=false;

function draw(){
  const c=$('#wheel'), x=c.getContext('2d'), R=c.width/2, step=Math.PI*2/LIST.length;
  x.clearRect(0,0,c.width,c.height);
  LIST.forEach((m,i)=>{
    x.beginPath(); x.moveTo(R,R); x.arc(R,R,R-4,i*step,(i+1)*step); x.closePath();
    x.fillStyle=`hsl(${(i*137)%360} 50% ${i%2?24:30}%)`; x.fill();
    x.save(); x.translate(R,R); x.rotate((i+.5)*step);
    x.fillStyle='#eef0f6'; x.font='600 12px Manrope,sans-serif'; x.textAlign='right'; x.textBaseline='middle';
    x.fillText(m.title.length>18?m.title.slice(0,17)+'…':m.title,R-18,0);
    x.restore();
  });
}

function show(m){
  $('#result').innerHTML=`<div class="res"><div class="card" style="--art:${art(m.title)}">${img(m)}<b>${m.title}</b></div>
    <div><h3>${m.title}</h3><p class="meta">${m.type}, ${m.year}. Рейтинг ${m.rating}</p><p>${m.genres.join(', ')}</p><br>
    <button class="btn" type="button" id="more" data-id="${m.id}">Подробнее</button></div></div>`;
}

function spin(){
  if(busy||!LIST.length) return;
  busy=true; $('#spin').disabled=true;
  const i=Math.random()*LIST.length|0, step=360/LIST.length;
  const target=((270-(i+.5+(Math.random()-.5)*.8)*step)%360+360)%360;
  const dur=matchMedia('(prefers-reduced-motion: reduce)').matches?0:6000;
  rot+=360*6+((target-rot%360)+360)%360;
  const w=$('#wheel');
  w.style.transition=`transform ${dur}ms cubic-bezier(.12,.6,.1,1)`;
  w.style.transform=`rotate(${rot}deg)`;
  setTimeout(()=>{ show(LIST[i]); busy=false; $('#spin').disabled=false; },dur+150);
}

(async()=>{
  LIST=await loadRandomMovies(50); ALL=LIST;
  draw();
})();
$('#spin').addEventListener('click',spin);
$('#result').addEventListener('click',e=>{ const t=e.target.closest('#more'); if(t) openMovie(t.dataset.id); });
