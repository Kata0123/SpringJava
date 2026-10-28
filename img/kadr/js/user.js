const page=document.body.dataset.page;

async function render(){
  const u=getUser(), box=$('#content');
  if(!u){
    box.innerHTML='<p class="lead">Войдите, чтобы увидеть эту страницу.</p><button class="btn" type="button" id="pLogin">Войти</button>';
    return;
  }
  const d=await loadMovies(); ALL=[...d.catalog,...d.featured];
  const rt=getRT(), wl=getWL(), rated=ALL.filter(m=>rt[m.id]), saved=ALL.filter(m=>wl.includes(m.id));
  if(page==='profile'){
    const avg=rated.length?(rated.reduce((s,m)=>s+rt[m.id],0)/rated.length).toFixed(1):'—';
    box.innerHTML=`<div class="pro"><span class="ava">${USER_ICON}</span>
      <form class="namef" id="nameForm"><input name="name" value="${esc(u.name)}" required aria-label="Имя"><button class="btn">Сохранить</button></form></div>
      <div class="stats"><div class="stat"><b>${saved.length}</b>в списке</div><div class="stat"><b>${rated.length}</b>оценок</div><div class="stat"><b>${avg}</b>средняя оценка</div></div>
      <div class="sechead"><h2>Мой список</h2><a class="chip" href="catalog.html?view=watchlist">Открыть весь</a></div>
      <div class="grid">${saved.slice(0,6).map(cardHTML).join('')||'<p class="empty">Список пуст.</p>'}</div>`;
  } else {
    box.innerHTML=rated.length
      ? `<div class="grid">${rated.map(m=>`<div>${cardHTML(m)}<p class="mine">Ваша оценка: ${'★'.repeat(rt[m.id])}${'☆'.repeat(5-rt[m.id])}</p></div>`).join('')}</div>`
      : '<p class="empty">Вы ещё ничего не оценили. Откройте фильм и поставьте звёзды.</p>';
  }
}
render();
$('#content').addEventListener('click',e=>{
  if(e.target.closest('#pLogin')) return $('#loginModal').showModal();
  const t=e.target.closest('.card[data-id]'); if(t) openMovie(t.dataset.id);
});
$('#content').addEventListener('submit',e=>{
  e.preventDefault();
  const n=new FormData(e.target).get('name').trim();
  if(!n) return;
  localStorage.setItem('kadr_user',JSON.stringify({name:n})); renderAuth(); render();
});
$('#loginModal').addEventListener('close',render);
document.addEventListener('click',e=>{ if(e.target.closest('#logout')) render(); });
