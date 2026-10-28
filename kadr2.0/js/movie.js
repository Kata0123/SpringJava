const ini=n=>n.split(' ').slice(0,2).map(w=>w[0]).join('');
const people=l=>l&&l.length
  ? `<div class="people">${l.map(n=>`<div class="person"><span class="pav" style="--art:${art(n)}">${ini(n)}</span>${n}</div>`).join('')}</div>`
  : '<p class="empty">Данные появятся после загрузки из базы.</p>';

(async()=>{
  const id=+new URLSearchParams(location.search).get('id'), box=$('#content');
  const d=await loadMovies(); ALL=[...d.catalog,...d.featured];
  const m=ALL.find(x=>x.id===id);
  if(!m){ box.innerHTML='<p class="lead">Фильм не найден.</p><a class="btn" href="catalog.html">В каталог</a>'; return; }
  document.title=`${m.title} — Кадр`;
  const mine=getRT()[m.id]||0, dirs=m.directors||[];
  const similar=ALL.filter(x=>x.id!==m.id)
    .map(x=>({x,s:x.genres.filter(g=>m.genres.includes(g)).length+x.tags.filter(t=>m.tags.includes(t)).length*2}))
    .filter(o=>o.s>0).sort((a,b)=>b.s-a.s).slice(0,6).map(o=>o.x);
  const more=dirs.length?ALL.filter(x=>x.id!==m.id&&(x.directors||[]).some(n=>dirs.includes(n))):[];
  const facts=[['Страна',m.country],['Студия',m.studio],['Режиссёр',dirs.join(', ')],['Жанры',m.genres.join(', ')],['Премьера',m.premiere],['Длительность',m.duration],['Бюджет',m.budget],['Возраст',m.age]];
  box.innerHTML=`<div class="mv">
    <div class="mv-bg" style="--art:${art(m.title)}"></div>
    <div class="mv-main">
      <div class="card" style="--art:${art(m.title)}">${img(m)}<b>${m.poster?'':m.title}</b></div>
      <div>
        <p class="meta">${m.type}, ${m.year}</p>
        <h1>${m.title}</h1>
        <p class="meta">Рейтинг ${m.rating}</p>
        <div class="tags">${m.genres.map(g=>`<span>${g}</span>`).join('')}${m.tags.map(t=>`<a href="catalog.html?tag=${encodeURIComponent(t)}">${t}</a>`).join('')}</div>
        <p class="meta">Ваша оценка</p>
        <div class="stars" data-id="${m.id}">${Array.from({length:10},(_,i)=>i+1).map(n=>`<button type="button" data-v="${n}" class="${n<=mine?'on':''}" aria-label="Оценка ${n} из 10">★</button>`).join('')}</div>
        <button class="btn" type="button" id="wl" data-id="${m.id}">${inWL(m.id)?'В списке':'Смотреть позже'}</button>
      </div>
    </div>
    <div class="tabs">
      <div class="tabbar" role="tablist">
        <button class="on" role="tab" type="button" data-tab="info" aria-selected="true">Информация</button>
        <button role="tab" type="button" data-tab="cast" aria-selected="false">Актёры</button>
        <button role="tab" type="button" data-tab="dirs" aria-selected="false">Режиссёры</button>
      </div>
      <div class="panel" data-panel="info">
        <div><h2>О фильме</h2><p class="ov">${m.overview||'Описание появится после загрузки данных из базы.'}</p></div>
        <dl class="facts">${facts.map(([k,v])=>`<dt>${k}</dt><dd>${v||'—'}</dd>`).join('')}</dl>
      </div>
      <div class="panel one" data-panel="cast" hidden>${people(m.cast)}</div>
      <div class="panel one" data-panel="dirs" hidden>${people(dirs)}${more.length?`<h3 class="sub">Ещё в каталоге</h3><div class="grid">${more.map(cardHTML).join('')}</div>`:''}</div>
    </div>
  </div>
  ${similar.length?`<div class="sechead"><h2>Похожее</h2></div><div class="grid">${similar.map(cardHTML).join('')}</div>`:''}`;
  startTheme(m,box.querySelector('.mv'));
})();

$('#content').addEventListener('click',e=>{
  const b=e.target.closest('[data-tab]');
  if(b){
    document.querySelectorAll('[data-tab]').forEach(x=>{ const on=x===b; x.classList.toggle('on',on); x.setAttribute('aria-selected',on); });
    document.querySelectorAll('[data-panel]').forEach(p=>{ p.hidden=p.dataset.panel!==b.dataset.tab; });
    return;
  }
  const t=e.target.closest('.grid .card[data-id]'); if(t) openMovie(t.dataset.id);
});
