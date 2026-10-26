/* Extras RappelConso : vue partageable (URL), faits marquants, export PNG, impression,
   mode présentation.
   Chargé après le script principal de index.html (utilise STATE, getFilteredRecords, etc.). */
(function(){
'use strict';

var $=function(id){return document.getElementById(id)};
var ico=function(p){return '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'};
var ICON={
  link:ico('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
  print:ico('<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>'),
  present:ico('<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/>'),
  theme:ico('<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>'),
  refresh:ico('<path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>'),
  image:ico('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>')
};
var CHIP_LABEL={grave:'Contamination bactérienne',bacterien:'Rappels obligatoires',recent:'30 derniers jours'};
var BACT=/listeria|salmonella|e.coli|stec|botulisme|brucellome/i;

function toast(msg){
  var t=$('rcToast');
  if(!t){t=document.createElement('div');t.id='rcToast';t.className='rc-toast';t.setAttribute('role','status');document.body.appendChild(t)}
  t.textContent=msg;t.classList.add('show');
  clearTimeout(toast._t);toast._t=setTimeout(function(){t.classList.remove('show')},2200);
}
// « listeria monocytogenes (agent responsable de la listériose) » -> « Listeria monocytogenes »
function nice(t){t=String(t).replace(/\s*\(.*?\)\s*/g,' ').replace(/\s+/g,' ').trim();return t.charAt(0).toUpperCase()+t.slice(1)}
function fmtN(n){return Number(n).toLocaleString('fr-FR')}
function dataDateLabel(){
  var d=STATE.dataDate?new Date(STATE.dataDate):null;
  return d&&!isNaN(d)?d.toLocaleDateString('fr-FR'):'—';
}
function filterDesc(){
  var a=[],q=$('searchInput')&&$('searchInput').value.trim();
  if(q)a.push('Recherche « '+q+' »');
  if(STATE.filterCats&&STATE.filterCats.size)a.push('Catégories : '+Array.from(STATE.filterCats).join(', '));
  if(STATE.filterRisks&&STATE.filterRisks.size)a.push('Dangers : '+Array.from(STATE.filterRisks).join(', '));
  var lv=$('filterLegal')&&$('filterLegal').value;if(lv)a.push(lv);
  if(STATE.days>0)a.push('Période : '+STATE.days+' derniers jours');
  STATE.chips.forEach(function(c){if(c!=='all')a.push(CHIP_LABEL[c]||c)});
  return a.length?a.join(' · '):'Aucun filtre (toutes les fiches)';
}
function cardTitle(card){
  var h=card.querySelector('.card__header');if(!h)return 'Graphique';
  var c=h.cloneNode(true);
  c.querySelectorAll('button,svg,.year-btns,.skeleton,small').forEach(function(x){x.remove()});
  return c.textContent.replace(/\s+/g,' ').trim()||'Graphique';
}
function slug(s){return s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,50)}

/* ───────────── 1. Vue partageable (état dans l'URL) ───────────── */
var PENDING=(function(){
  var h=location.hash.replace(/^#/,'');if(!h)return null;
  try{return new URLSearchParams(h)}catch(e){return null}
})();
var urlReady=false;

function writeHash(){
  if(!urlReady)return;
  var p=new URLSearchParams();
  if(STATE.currentPage&&STATE.currentPage!=='dashboard')p.set('p',STATE.currentPage);
  if(STATE.filterCats.size)p.set('cat',Array.from(STATE.filterCats).join('~'));
  if(STATE.filterRisks.size)p.set('risk',Array.from(STATE.filterRisks).join('~'));
  if(STATE.days>0)p.set('d',STATE.days);
  var ch=Array.from(STATE.chips).filter(function(c){return c!=='all'});if(ch.length)p.set('c',ch.join(','));
  var lv=$('filterLegal')&&$('filterLegal').value;if(lv)p.set('l',lv);
  var q=$('searchInput')&&$('searchInput').value.trim();if(q)p.set('q',q);
  var s=p.toString();
  try{history.replaceState(null,'',location.pathname+location.search+(s?'#'+s:''))}catch(e){}
}
function applyPending(){
  var p=PENDING;PENDING=null;
  if(p){
    var split=function(k){var v=p.get(k);return v?v.split('~').filter(Boolean):[]};
    STATE.filterCats=new Set(split('cat'));STATE.filterRisks=new Set(split('risk'));
    if($('searchInput')&&p.get('q'))$('searchInput').value=p.get('q');
    if($('filterLegal')&&p.get('l'))$('filterLegal').value=p.get('l');
    var d=parseInt(p.get('d'),10);
    if(d>0){STATE.days=d;document.querySelectorAll('.date-presets .btn').forEach(function(b){b.classList.toggle('active',+b.dataset.days===d)})}
    // setSetFilter(kind,null) resynchronise cases à cocher + boutons et retire le chip « Tous »
    setSetFilter('cat',null);setSetFilter('risk',null);
    var c=(p.get('c')||'').split(',').filter(Boolean);
    if(c.length){
      STATE.chips=new Set(c);
      document.querySelectorAll('.chip').forEach(function(x){x.classList.toggle('active',STATE.chips.has(x.dataset.chip))});
    }
    var pg=p.get('p');
    if(pg&&document.querySelector('.page[data-page="'+pg+'"]'))switchPage(pg);
    STATE.page=1;onFilterChange();
  }
  urlReady=true;writeHash();
}
function copyLink(){
  writeHash();
  var url=location.href;
  var done=function(){toast('Lien de la vue copié')};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(url).then(done,function(){window.prompt('Copiez ce lien :',url)});
  else window.prompt('Copiez ce lien :',url);
}

/* ───────────── 2. Faits marquants ───────────── */
function computeFacts(d){
  var out=[];if(!d.length)return out;
  var n=d.length,minD='9999',maxD='';
  var cat={},risk={},brand={},bact=0;
  d.forEach(function(r){
    var dt=(r.date_publication||'').slice(0,10);if(dt){if(dt<minD)minD=dt;if(dt>maxD)maxD=dt}
    if(r.sous_categorie_produit)cat[r.sous_categorie_produit]=(cat[r.sous_categorie_produit]||0)+1;
    if(r.marque_produit&&!/^(sans marque|marque inconnue|non renseign)/i.test(r.marque_produit.trim()))brand[r.marque_produit]=(brand[r.marque_produit]||0)+1;
    var seen={};normalizeRisks(r.risques_encourus).forEach(function(x){if(!seen[x]){seen[x]=1;risk[x]=(risk[x]||0)+1}});
    if(BACT.test(r.risques_encourus||''))bact++;
  });
  var top=function(o){var e=Object.keys(o).map(function(k){return [k,o[k]]}).sort(function(a,b){return b[1]-a[1]});return e[0]};
  var fr=function(s){return new Date(s).toLocaleDateString('fr-FR')};
  var pc=function(x){return Math.round(x/n*100)};
  out.push('<strong>'+fmtN(n)+'</strong> rappel'+(n>1?'s':'')+(maxD?' publié'+(n>1?'s':'')+' du <strong>'+fr(minD)+'</strong> au <strong>'+fr(maxD)+'</strong>':'')+'.');
  var tc=top(cat);if(tc)out.push('Catégorie la plus touchée : <strong>'+esc(nice(tc[0]))+'</strong>, '+pc(tc[1])+' % des fiches ('+fmtN(tc[1])+').');
  var tr=top(risk);if(tr)out.push('Danger le plus cité : <strong>'+esc(nice(tr[0]))+'</strong>, présent dans '+pc(tr[1])+' % des fiches.');
  if(bact)out.push('Contaminations bactériennes graves (Listeria, Salmonella, E. coli, botulisme…) : <strong>'+pc(bact)+' %</strong> des rappels ('+fmtN(bact)+').');
  if(maxD){
    var ref=new Date(maxD).getTime(),D=90*864e5,cur=0,prev=0;
    d.forEach(function(r){var t=new Date(r.date_publication||0).getTime();if(t>ref-D)cur++;else if(t>ref-2*D)prev++});
    if(prev>=5){
      var v=Math.round((cur-prev)/prev*100);
      out.push('Sur les 90 derniers jours : <strong>'+fmtN(cur)+'</strong> rappels, <span class="'+(v>0?'up':'down')+'">'+(v>0?'+':'')+v+' %</span> par rapport aux 90 jours précédents ('+fmtN(prev)+').');
    }
  }
  var tb=top(brand);if(tb&&tb[1]>1)out.push('Marque la plus rappelée : <strong>'+esc(nice(tb[0]))+'</strong> ('+fmtN(tb[1])+' fiches).');
  return out;
}
function renderFacts(d){
  var host=$('factsBar');
  if(!host){
    var anchor=document.querySelector('.page[data-page="dashboard"] .grid-responsive');
    if(!anchor)return;
    host=document.createElement('section');host.id='factsBar';host.className='card facts-card';
    host.setAttribute('aria-label','Faits marquants');
    anchor.parentNode.insertBefore(host,anchor);
  }
  var f=computeFacts(d),page=document.querySelector('.page[data-page="dashboard"]');
  if(page)page.classList.toggle('sel-empty',!f.length);
  if(!f.length){
    host.hidden=false;
    host.innerHTML='<div class="card__header">Aucune fiche ne correspond à ces filtres</div><p class="facts-empty">Élargissez la période ou retirez un filtre. <button type="button" class="btn btn--ghost btn--sm" id="factsClear">Effacer les filtres</button></p>';
    $('factsClear').addEventListener('click',function(){$('clearFiltersBtn').click()});
    return;
  }
  host.hidden=false;
  host.innerHTML='<div class="card__header">Faits marquants</div><ul class="facts-list">'+f.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>';
}

/* ───────────── 3. Export d'un graphique en PNG ───────────── */
function exportPng(card){
  var cv=card.querySelector('canvas');
  if(!cv||!cv.width){toast('Graphique indisponible');return}
  var s=cv.clientWidth?cv.width/cv.clientWidth:1;
  var root=getComputedStyle(document.documentElement),bg=getComputedStyle(document.body).backgroundColor;
  var fg=root.getPropertyValue('--text').trim()||'#fff',mu=root.getPropertyValue('--text3').trim()||'#999';
  var pad=24*s,head=60*s,foot=64*s;
  var c=document.createElement('canvas');c.width=Math.round(cv.width+pad*2);c.height=Math.round(cv.height+head+foot);
  var x=c.getContext('2d');
  x.fillStyle=bg;x.fillRect(0,0,c.width,c.height);
  x.textBaseline='top';
  x.fillStyle=fg;x.font='700 '+(20*s)+'px Inter,Arial,sans-serif';x.fillText(cardTitle(card),pad,pad*.8);
  x.fillStyle=mu;x.font=(12*s)+'px Inter,Arial,sans-serif';
  x.fillText('Alimentation · rappels RappelConso',pad,pad*.8+26*s);
  x.drawImage(cv,pad,head);
  var line=filterDesc(),max=c.width-pad*2;
  while(line.length>4&&x.measureText(line).width>max)line=line.slice(0,-2);
  if(line!==filterDesc())line=line.replace(/\s*$/,'')+'…';
  x.fillText(line,pad,head+cv.height+10*s);
  x.fillText('Données au '+dataDateLabel()+' · '+fmtN(getFilteredRecords().length)+' fiches · visipilot.com',pad,head+cv.height+30*s);
  c.toBlob(function(b){
    if(!b){toast('Export impossible');return}
    var a=document.createElement('a');a.href=URL.createObjectURL(b);
    a.download='rappelconso-'+slug(cardTitle(card))+'-'+new Date().toISOString().slice(0,10)+'.png';
    document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},2000);
    toast('Image téléchargée');
  },'image/png');
}
function syncQueryEmpty(){
  var pg=document.querySelector('.page[data-page="query"]'),b=$('queryResultsBadge');
  if(pg&&b)pg.classList.toggle('is-empty',/^\s*0\s/.test(b.textContent));
}
function decorateCards(){
  syncQueryEmpty();
  document.querySelectorAll('.card').forEach(function(card){
    var h=card.querySelector('.card__header'),cv=card.querySelector('canvas');
    if(!h||!cv||h.closest('.card')!==card)return;
    if(!cv.getAttribute('role')){cv.setAttribute('role','img');cv.setAttribute('aria-label','Graphique : '+cardTitle(card))}
    if(h.querySelector('.png-btn'))return;
    var b=document.createElement('button');
    b.type='button';b.className='png-btn btn btn--ghost btn--xs';
    b.title='Télécharger en image (PNG)';b.setAttribute('aria-label','Télécharger le graphique en image PNG');
    b.innerHTML=ICON.image;
    b.addEventListener('click',function(e){e.stopPropagation();exportPng(card)});
    var info=h.querySelector('.info-btn');
    if(info)h.insertBefore(b,info);else h.appendChild(b);
  });
}

/* ───────────── 4. Impression / PDF ───────────── */
var printSwitched=false,prevAnim;
function ensurePrintHeader(){
  var h=$('printHeader');
  if(!h){h=document.createElement('div');h.id='printHeader';h.className='print-only';var c=$('content');c.parentNode.insertBefore(h,c)}
  var names={dashboard:'Tableau de bord',search:'Recherche',analyses:'Analyses statistiques',query:'Requêtes',about:'À propos'};
  h.innerHTML='<h1>RappelConso — '+esc(names[STATE.currentPage]||'Rapport')+'</h1><p>'+esc(filterDesc())+' · '+fmtN(getFilteredRecords().length)+' fiches · données au '+esc(dataDateLabel())+' · édité le '+new Date().toLocaleDateString('fr-FR')+' · visipilot.com</p>';
}
function beforePrint(){
  ensurePrintHeader();
  // Les graphiques sont dessinés avec la palette du thème courant : sur papier on passe en clair.
  if(typeof Chart!=='undefined'){prevAnim=Chart.defaults.animation;Chart.defaults.animation=false}
  if(document.documentElement.getAttribute('data-theme')==='dark'){printSwitched=true;toggleTheme()}
}
function afterPrint(){
  if(typeof Chart!=='undefined'&&prevAnim!==undefined)Chart.defaults.animation=prevAnim;
  if(printSwitched){printSwitched=false;toggleTheme()}
}
window.addEventListener('beforeprint',beforePrint);
window.addEventListener('afterprint',afterPrint);

/* ───────────── 5. Mode présentation ───────────── */
var PRES={i:0,slides:[],open:false,opener:null};
// Redessine le graphique sur un canvas hors écran au format d'une diapositive
// (petite taille logique + résolution x3 : textes lisibles une fois agrandis, sans flou).
function hiRes(cv){
  try{
    var live=window.cm[cv.id],cfg=live.config;
    var off=document.createElement('canvas');off.width=640;off.height=cfg.type==='doughnut'||cfg.type==='pie'?400:350;
    var opts=Object.assign({},cfg.options,{responsive:false,animation:false,devicePixelRatio:3,maintainAspectRatio:false});
    var ch=new Chart(off,{type:cfg.type,data:cfg.data,options:opts});
    var url=off.toDataURL('image/png');ch.destroy();return url;
  }catch(e){return null}
}
function buildSlides(){
  var d=getFilteredRecords(),n=d.length,s=[];
  var bact=d.filter(function(r){return BACT.test(r.risques_encourus||'')}).length;
  var mand=d.filter(function(r){return r.nature_juridique_rappel==='imposé par arrêté préfectoral'}).length;
  var brands=new Set(d.map(function(r){return r.marque_produit}).filter(Boolean)).size;
  var pc=function(x){return n?Math.round(x/n*100)+' %':'—'};
  s.push({html:'<h1 class="pres-title">Rappels alimentaires en France</h1><p class="pres-sub">'+esc(filterDesc())+'<br>Données RappelConso au '+esc(dataDateLabel())+'</p>'+
    '<div class="pres-kpis"><div class="pres-kpi"><b>'+fmtN(n)+'</b><span>rappels</span></div><div class="pres-kpi"><b>'+pc(bact)+'</b><span>contamination bactérienne</span></div><div class="pres-kpi"><b>'+pc(mand)+'</b><span>imposés par arrêté</span></div><div class="pres-kpi"><b>'+fmtN(brands)+'</b><span>marques concernées</span></div></div>'});
  var f=computeFacts(d);
  if(f.length)s.push({html:'<h2 class="pres-title">Faits marquants</h2><ul class="pres-facts">'+f.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>'});
  document.querySelectorAll('.card').forEach(function(card){
    var cv=card.querySelector('canvas');
    if(!cv||!cv.width||!window.cm||!window.cm[cv.id])return;
    var img=hiRes(cv)||cv.toDataURL('image/png');
    s.push({html:'<h2 class="pres-title">'+esc(cardTitle(card))+'</h2><img class="pres-img" alt="'+esc('Graphique : '+cardTitle(card))+'" src="'+img+'">'});
  });
  return s;
}
function ensureOverlay(){
  var o=$('presentOverlay');if(o)return o;
  o=document.createElement('div');o.id='presentOverlay';o.hidden=true;
  o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label','Mode présentation');
  o.innerHTML='<div class="pres-top"><span class="pres-brand">RappelConso · VisiPilot</span><span id="presCount" aria-live="polite"></span><button class="pres-close" id="presClose" aria-label="Quitter la présentation">×</button></div>'+
    '<div class="pres-stage" id="presStage"></div>'+
    '<div class="pres-bar"><i id="presBar"></i></div>'+
    '<div class="pres-foot"><span id="presFoot"></span><div class="pres-nav"><button id="presPrev" aria-label="Diapositive précédente">‹</button><button id="presNext" aria-label="Diapositive suivante">›</button></div></div>';
  document.body.appendChild(o);
  $('presClose').addEventListener('click',closePresent);
  $('presPrev').addEventListener('click',function(){go(-1)});
  $('presNext').addEventListener('click',function(){go(1)});
  var x0=null;
  o.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  o.addEventListener('touchend',function(e){if(x0==null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>50)go(dx<0?1:-1)},{passive:true});
  return o;
}
function showSlide(){
  var n=PRES.slides.length;PRES.i=Math.max(0,Math.min(n-1,PRES.i));
  $('presStage').innerHTML=PRES.slides[PRES.i].html;
  $('presCount').textContent=(PRES.i+1)+' / '+n;
  $('presBar').style.width=((PRES.i+1)/n*100)+'%';
  $('presPrev').disabled=PRES.i===0;$('presNext').disabled=PRES.i===n-1;
  $('presFoot').textContent=filterDesc()+' · données au '+dataDateLabel();
}
function go(step){PRES.i+=step;showSlide()}
function openPresent(){
  PRES.opener=document.activeElement;
  PRES.slides=buildSlides();PRES.i=0;
  var o=ensureOverlay();o.hidden=false;PRES.open=true;document.body.style.overflow='hidden';
  showSlide();$('presClose').focus();
  if(o.requestFullscreen)o.requestFullscreen().catch(function(){});
}
function closePresent(){
  if(!PRES.open)return;
  PRES.open=false;$('presentOverlay').hidden=true;document.body.style.overflow='';
  if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(function(){});
  if(PRES.opener&&PRES.opener.focus)PRES.opener.focus();
}
document.addEventListener('fullscreenchange',function(){if(PRES.open&&!document.fullscreenElement)closePresent()});
document.addEventListener('keydown',function(e){
  if(!PRES.open)return;
  var k=e.key;
  if(k==='Escape'){closePresent();e.preventDefault()}
  else if(k==='ArrowRight'||k==='PageDown'||k===' '){go(1);e.preventDefault()}
  else if(k==='ArrowLeft'||k==='PageUp'){go(-1);e.preventDefault()}
  else if(k==='Home'){PRES.i=0;showSlide();e.preventDefault()}
  else if(k==='End'){PRES.i=PRES.slides.length-1;showSlide();e.preventDefault()}
},true);

/* ───────────── Barre d'outils des pages ───────────── */
function addTools(){
  ['dashboard','analyses'].forEach(function(name){
    var hd=document.querySelector('.page[data-page="'+name+'"] .page-header');
    if(!hd||hd.querySelector('.page-tools'))return;
    var t=document.createElement('div');t.className='page-tools';
    t.innerHTML='<button type="button" class="btn btn--ghost btn--sm" data-act="link" title="Copier le lien de cette vue (filtres inclus)" aria-label="Copier le lien de cette vue">'+ICON.link+'<span>Lien</span></button>'+
      '<button type="button" class="btn btn--ghost btn--sm" data-act="print" title="Imprimer ou enregistrer en PDF" aria-label="Imprimer ou enregistrer en PDF">'+ICON.print+'<span>PDF</span></button>'+
      '<button type="button" class="btn btn--ghost btn--sm tool-mobile" data-act="theme" title="Basculer clair / sombre" aria-label="Basculer le thème clair ou sombre">'+ICON.theme+'<span>Thème</span></button>'+
      '<button type="button" class="btn btn--ghost btn--sm tool-mobile" data-act="refresh" title="Recharger les données" aria-label="Recharger les données">'+ICON.refresh+'<span>Actualiser</span></button>'+
      '<button type="button" class="btn btn--primary btn--sm" data-act="present" title="Mode présentation plein écran" aria-label="Lancer le mode présentation">'+ICON.present+'<span>Présenter</span></button>';
    t.addEventListener('click',function(e){
      var b=e.target.closest('button[data-act]');if(!b)return;
      if(b.dataset.act==='link')copyLink();
      else if(b.dataset.act==='theme')toggleTheme();
      else if(b.dataset.act==='refresh')refreshData();
      else if(b.dataset.act==='print')window.print();
      else openPresent();
    });
    hd.appendChild(t);
  });
}

/* ───────────── Branchements sur le script principal ───────────── */
function wrap(name,after){
  var orig=window[name];if(typeof orig!=='function')return;
  window[name]=function(){
    var r=orig.apply(this,arguments);
    try{after.apply(this,arguments)}catch(e){console.error('[extras:'+name+']',e)}
    return r;
  };
}
wrap('updateFilterSummary',writeHash);
wrap('switchPage',writeHash);
wrap('updateDashboard',function(){renderFacts(getFilteredRecords())});
// populateFilters réinitialise les filtres puis charge les facettes : on restaure l'URL juste après.
wrap('populateFilters',function(){if(!urlReady)applyPending()});
// Si les facettes n'arrivent jamais (API indisponible), on lève quand même le verrou d'écriture.
setTimeout(function(){if(!urlReady){urlReady=true;writeHash()}},15000);

addTools();
decorateCards();
var rafPending=false;
new MutationObserver(function(){
  if(rafPending)return;rafPending=true;
  requestAnimationFrame(function(){rafPending=false;decorateCards()});
}).observe($('content'),{childList:true,subtree:true});
})();
