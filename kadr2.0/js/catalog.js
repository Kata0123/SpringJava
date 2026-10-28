const DEC=[['Любой год',0,9999],['2020-е',2020,2029],['2010-е',2010,2019],['2000-е',2000,2009],['1990-е',1990,1999],['До 1990',0,1989]];
const flt={q:'',g:'',y:0,t:'',tag:''};
const qs=new URLSearchParams(location.search);
const wlView=qs.get('view')==='watchlist';
let TAGS=[];

function renderTags(){
  $('#tags').innerHTML=TAGS.map(t=>`<button class="chip${t===flt.tag?' on':''}" type="button">${t}</button>`).join('');
}
function render(){
  const q=flt.q.trim().toLowerCase(), [,a,b]=DEC[flt.y], wl=getWL();
  const res=ALL.filter(m=>(!wlView||wl.includes(m.id))&&(!flt.g||m.genres.includes(flt.g))&&m.year>=a&&m.year<=b&&(!flt.t||m.type===flt.t)&&(!flt.tag||m.tags.includes(flt.tag))&&m.title.toLowerCase().includes(q));
  $('#grid').innerHTML=res.map(cardHTML).join('');
  $('#count').textContent=`Найдено: ${res.length}`;
  $('#empty').hidden=res.length>0;
}
(async()=>{
  const d=await loadMovies(); ALL=[...d.catalog,...d.featured];
  const gs=[...new Set(ALL.flatMap(m=>m.genres))].sort();
  TAGS=[...new Set(ALL.flatMap(m=>m.tags))].sort();
  $('#fg').innerHTML='<option value="">Все жанры</option>'+gs.map(g=>`<option>${g}</option>`).join('');
  $('#fy').innerHTML=DEC.map((d,i)=>`<option value="${i}">${d[0]}</option>`).join('');
  flt.q=qs.get('q')||''; flt.tag=TAGS.includes(qs.get('tag'))?qs.get('tag'):'';
  $('#fq').value=flt.q;
  if(wlView){ $('#ctitle').textContent='Мой список'; $('#empty').textContent='Список пуст. Добавляйте фильмы кнопкой «Смотреть позже».'; }
  renderTags(); render();
})();
$('#fq').addEventListener('input',e=>{ flt.q=e.target.value; render(); });
$('#fg').addEventListener('change',e=>{ flt.g=e.target.value; render(); });
$('#fy').addEventListener('change',e=>{ flt.y=+e.target.value; render(); });
$('#ft').addEventListener('change',e=>{ flt.t=e.target.value; render(); });
$('#tags').addEventListener('click',e=>{ const b=e.target.closest('.chip'); if(!b) return; flt.tag=flt.tag===b.textContent?'':b.textContent; renderTags(); render(); });
$('#grid').addEventListener('click',e=>{ const t=e.target.closest('[data-id]'); if(t) openMovie(t.dataset.id); });
