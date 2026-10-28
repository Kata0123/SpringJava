(async()=>{
  const id=+new URLSearchParams(location.search).get('id'), box=$('#content');
  const d=await loadMovies(); ALL=[...d.catalog,...d.featured];
  const m=ALL.find(x=>x.id===id);
  if(!m){ box.innerHTML='<p class="lead">Фильм не найден.</p><a class="btn" href="catalog.html">В каталог</a>'; return; }
  document.title=`${m.title} — Кадр`;
  const mine=getRT()[m.id]||0;
  const similar=ALL.filter(x=>x.id!==m.id)
    .map(x=>({x,s:x.genres.filter(g=>m.genres.includes(g)).length+x.tags.filter(t=>m.tags.includes(t)).length*2}))
    .filter(o=>o.s>0).sort((a,b)=>b.s-a.s).slice(0,6).map(o=>o.x);
  box.style.setProperty('--glow',m.glow||'#f4b942');
  box.innerHTML=`<div class="mv">
    <div class="mv-bg" style="--art:${art(m.title)}"></div>
    <div class="mv-main">
      <div class="card" style="--art:${art(m.title)}">${img(m)}<b>${m.poster?'':m.title}</b></div>
      <div>
        <p class="meta">${m.type}, ${m.year}</p>
        <h1>${m.title}</h1>
        <p class="meta">Рейтинг ${m.rating}</p>
        <div class="tags">${m.genres.map(g=>`<span>${g}</span>`).join('')}${m.tags.map(t=>`<a href="catalog.html?tag=${encodeURIComponent(t)}">${t}</a>`).join('')}</div>
        <p class="ov">${m.overview||'Описание появится после загрузки данных из базы.'}</p>
        <p class="meta">Ваша оценка</p>
        <div class="stars" data-id="${m.id}">${[1,2,3,4,5].map(n=>`<button type="button" data-v="${n}" class="${n<=mine?'on':''}" aria-label="Оценка ${n}">★</button>`).join('')}</div>
        <button class="btn" type="button" id="wl" data-id="${m.id}">${inWL(m.id)?'В списке':'Смотреть позже'}</button>
      </div>
    </div>
  </div>
  ${similar.length?`<div class="sechead"><h2>Похожее</h2></div><div class="grid" id="sim">${similar.map(cardHTML).join('')}</div>`:''}`;
  startTheme(m,box.querySelector('.mv'));
})();
$('#content').addEventListener('click',e=>{ const t=e.target.closest('#sim .card[data-id]'); if(t) openMovie(t.dataset.id); });
