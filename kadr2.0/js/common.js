const $ = s => document.querySelector(s);
let ALL = [], state = {f:'Все', q:''};
const art = t => { let h=0; for(const c of t) h=(h*31+c.charCodeAt(0))%360;
  return `linear-gradient(160deg,hsl(${h} 55% 30%),hsl(${(h+45)%360} 60% 11%))`; };
const img = m => m.poster ? `<img src="${m.poster}" alt="Постер: ${m.title}" loading="lazy">` : '';
const openMovie=id=>{ location.href=`movie.html?id=${id}`; };

const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const USER_ICON='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>';
const getUser=()=>{try{return JSON.parse(localStorage.getItem('kadr_user'))}catch{return null}};

function renderAuth(){
  const u=getUser(), box=$('#auth');
  if(!u){ box.innerHTML='<button class="btn ghost" type="button" id="openLogin">Войти</button>'; return; }
  box.innerHTML=`<button class="profile" type="button" id="profileBtn" aria-haspopup="true" aria-expanded="false"><span class="ava">${USER_ICON}</span><span class="uname">${esc(u.name)}</span></button>
    <div class="menu" id="menu" hidden><a href="profile.html">Профиль</a><a href="catalog.html?view=watchlist">Watchlist</a><a href="ratings.html">Оценки</a><hr><button type="button" id="logout">Выйти</button></div>`;
}
function toggleMenu(open){
  const m=$('#menu'), b=$('#profileBtn');
  if(!m) return;
  m.hidden=!open; b.setAttribute('aria-expanded',open);
}
$('#auth').addEventListener('click',e=>{
  if(e.target.closest('#openLogin')) $('#loginModal').showModal();
  else if(e.target.closest('#profileBtn')) toggleMenu($('#menu').hidden);
  else if(e.target.closest('#logout')){ localStorage.removeItem('kadr_user'); renderAuth(); }
});
document.addEventListener('click',e=>{ if(!e.target.closest('#auth')) toggleMenu(false); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape') toggleMenu(false); });
$('#loginClose').addEventListener('click',()=>$('#loginModal').close());
$('#loginModal').addEventListener('click',e=>{ if(e.target.id==='loginModal') e.target.close(); });
$('#loginForm').addEventListener('submit',e=>{
  e.preventDefault();
  const n=new FormData(e.target).get('name').trim();
  if(!n) return;
  localStorage.setItem('kadr_user',JSON.stringify({name:n}));
  e.target.reset(); $('#loginModal').close(); renderAuth();
});
renderAuth();

const cardHTML=m=>`<button class="card" type="button" data-id="${m.id}" style="--art:${art(m.title)}">${img(m)}<span class="rate">${m.rating}</span><b>${m.title}</b></button>`;
const getWL=()=>{try{return JSON.parse(localStorage.getItem('kadr_wl'))||[]}catch{return[]}};
const inWL=id=>getWL().includes(+id);
function toggleWL(id){
  const l=getWL(), i=l.indexOf(+id);
  if(i<0) l.push(+id); else l.splice(i,1);
  localStorage.setItem('kadr_wl',JSON.stringify(l));
  return i<0;
}
document.addEventListener('click',e=>{
  const b=e.target.closest('#wl');
  if(b) b.textContent=toggleWL(b.dataset.id)?'В списке':'Смотреть позже';
});
const solid=()=>$('#top').classList.toggle('solid',scrollY>40||!!document.body.dataset.page);
addEventListener('scroll',solid,{passive:true});
solid();

const getRT=()=>{try{return JSON.parse(localStorage.getItem('kadr_rt'))||{}}catch{return{}}};
function setRT(id,v){
  const r=getRT();
  if(r[id]===v) delete r[id]; else r[id]=v;
  localStorage.setItem('kadr_rt',JSON.stringify(r));
  return r[id]||0;
}
document.addEventListener('click',e=>{
  const b=e.target.closest('.stars button'); if(!b) return;
  const box=b.parentElement, v=setRT(box.dataset.id,+b.dataset.v);
  box.querySelectorAll('button').forEach(s=>s.classList.toggle('on',+s.dataset.v<=v));
});
