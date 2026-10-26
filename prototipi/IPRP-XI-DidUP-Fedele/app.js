(() => {
  'use strict';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const icon = (name, extra = '') => `<svg ${extra} aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const currentSite = 'https://polizia-iprp.web.app';
  const external = (path, label = 'Apri servizio attuale') => `<a class="outline-button" href="${currentSite}${path}" target="_blank" rel="noopener noreferrer">${label} ${icon('external')}</a>`;
  const crumb = (title, subtitle = '') => `<div class="page-heading"><div><h1>${title}</h1>${subtitle ? `<p>${subtitle}</p>` : ''}</div><div class="page-subhead">${icon('info')} IPRP XI · Portale roleplay</div></div>`;
  const footer = `<footer class="page-footer"><span>Questura IPRP XI · Interfaccia dimostrativa non ufficiale</span><span>UI DidUP-inspired · concept v2.0</span></footer>`;
  const alert = `<div class="warning-strip">${icon('info')} <span>Progetto di gioco di ruolo FiveM, non affiliato alla Polizia di Stato italiana. Nessuna pratica viene inviata da questa anteprima. Per emergenze reali, chiama il 112.</span></div>`;
  const cardTitle = (title, glyph, target) => `<div class="card-heading"><div class="heading-title">${icon(glyph)}<h2>${title}</h2></div>${target ? `<button class="card-icon-button" title="Apri ${title}" data-route="${target}">${icon('arrow')}</button>` : ''}</div>`;
  const routeLabels = {home:'Home',sportello:'Sportello Cittadino',denuncia:'Denuncia online',porto:"Porto d'armi",colloquio:'Colloqui',pratica:'Le mie pratiche',comunicati:'Bacheca',reclutamento:'Reclutamento',organigramma:'Organigramma',reparti:'Reparti operativi',gradi:'Qualifiche e gradi',calendario:'Calendario',modulistica:'Modulistica','area-agenti':'Area Agenti',info:'Informazioni'};
  const today = new Date();
  let activeDay = today.getDay() === 0 ? 0 : Math.min(today.getDay() - 1, 5);
  let weekShift = 0;
  let toastTimer;
  const safe = text => String(text).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const formatDate = (date, options = {day:'numeric',month:'short'}) => new Intl.DateTimeFormat('it-IT',options).format(date);
  const mondayOfWeek = () => {const d = new Date(today.getFullYear(),today.getMonth(),today.getDate()); d.setDate(d.getDate()-((d.getDay()+6)%7) + weekShift*7); return d;};
  const pages = {};

  const statements = [
    {kind:'Reclutamento',icon:'award',color:'blue',date:'Selezione aperta',title:'Concorso Agente — selezione permanente',desc:'Candidatura, colloquio in-character e formazione in Accademia.',route:'reclutamento'},
    {kind:'Reclutamento',icon:'shield',color:'orange',date:'Selezione interna',title:'Nucleo Operativo Speciale',desc:'Selezione riservata al personale con esperienza di servizio.',route:'reclutamento'},
    {kind:'Sportello',icon:'file',color:'green',date:'Servizio online',title:'Servizi del cittadino: accesso allo Sportello',desc:'Denunce, porto d’armi, colloqui e tracciamento delle pratiche.',route:'sportello'}
  ];
  const bullet = (o, i = 0) => `<div class="bullet-item"><div class="bullet-icon ${o.color || ''}">${icon(o.icon || 'file')}</div><div class="bullet-content"><div class="line-meta"><span>${safe(o.kind)}</span><span>${safe(o.date)}</span></div><strong>${safe(o.title)}</strong>${o.desc ? `<p>${safe(o.desc)}</p>` : ''}${o.tag ? `<span class="mini-tag">${safe(o.tag)}</span>` : ''}</div>${o.route ? `<button class="card-icon-button" data-route="${o.route}" title="Visualizza ${safe(o.title)}">${icon('chevron')}</button>`:''}</div>`;
  const serviceDefinitions = [
    {title:'Denuncia online',icon:'file',desc:'Presenta una denuncia in-character indicando dati del personaggio e dinamica dei fatti.',route:'denuncia'},
    {title:"Porto d'armi",icon:'shield',desc:'Richiedi il rilascio o il rinnovo del porto d’armi per il tuo personaggio.',route:'porto'},
    {title:'Colloquio con i dirigenti',icon:'calendar',desc:'Prenota un appuntamento con la dirigenza o con i responsabili dei reparti.',route:'colloquio'},
    {title:'Stato della pratica',icon:'clipboard',desc:'Consulta la sezione per verificare l’avanzamento delle richieste.',route:'pratica'}
  ];
  const divisions = [
    {title:'Reparto Volanti',subtitle:'Pronto intervento',desc:'Pattugliamento del territorio e risposta rapida alle emergenze cittadine.',icon:'shield'},
    {title:'Squadra Investigativa',subtitle:'Polizia giudiziaria',desc:'Indagini su reati complessi e attività di raccolta delle prove.',icon:'search'},
    {title:'Nucleo Operativo Speciale',subtitle:'Alto rischio',desc:'Interventi negli scenari più critici e in situazioni ad alto rischio.',icon:'shield'},
    {title:'Polizia Stradale',subtitle:'Sicurezza viaria',desc:'Controlli della circolazione e gestione degli incidenti stradali.',icon:'briefcase'},
    {title:'Ufficio Relazioni Pubbliche',subtitle:'Rapporti con il cittadino',desc:'Informazioni, segnalazioni e contatto diretto con la cittadinanza.',icon:'users'},
    {title:'Accademia & Formazione',subtitle:'Addestramento',desc:'Formazione teorica e addestramento delle nuove reclute.',icon:'book'}
  ];
  const ranks = [
    ['08','Questore','Direzione generale della Questura e coordinamento dei reparti'],
    ['07','Vice Commissario','Direzione di reparto e priorità operative'],
    ['06','Ispettore','Coordinamento di operazioni e interventi complessi'],
    ['05','Sovrintendente','Supervisione delle pattuglie e del personale'],
    ['04','Assistente Capo','Responsabilità nella gestione dei turni'],
    ['03','Assistente','Coordinamento operativo e supporto alle reclute'],
    ['02','Agente Scelto','Autonomia operativa dopo i primi periodi di servizio'],
    ['01','Agente','Primo grado dopo il percorso formativo']
  ];

  function dashboard() {
    return `${crumb('Home')}
      <div class="dashboard-grid">
        <div class="dash-column">
          <article class="card summary-card">
            <div class="summary-upper">
              <div class="summary-feature"><h3>QUESTURA IPRP</h3><div class="donut"><span>XI</span></div><p>Portale gestionale<br>Italian Paradise Roleplay</p></div>
              <div class="summary-feature"><h3>SPORTELLO</h3><div class="big-tile-icon">${icon('building')}</div><p><button class="link-button" data-route="sportello">Accedi ai servizi ${icon('arrow')}</button><br>Questura Centrale</p></div>
            </div>
            <div class="summary-divider"></div>
            <div class="counter-row">
              <div class="counter c-red"><strong>4</strong><span>Servizi</span></div>
              <div class="counter c-amber"><strong>2</strong><span>Selezioni</span></div>
              <div class="counter c-blue"><strong>6</strong><span>Reparti</span></div>
              <div class="counter c-green"><strong>8</strong><span>Gradi</span></div>
            </div>
            <div class="summary-foot"><span>Sezioni disponibili sul sito attuale</span><button class="link-button" data-route="organigramma">Vedi dettagli ${icon('arrow')}</button></div>
          </article>
          <article class="card">${cardTitle('Sportello Telematico','clipboard','sportello')}
            <div class="bullet-list">
              ${bullet({kind:'Servizio al cittadino',date:'',title:'Presenta una denuncia',desc:'Modulo di denuncia in-character',icon:'file',color:'orange',route:'denuncia'})}
              ${bullet({kind:'Servizio al cittadino',date:'',title:"Richiedi un porto d'armi",desc:'Rilascio e rinnovo in-character',icon:'shield',color:'blue',route:'porto'})}
              ${bullet({kind:'Assistenza',date:'',title:'Verifica la tua pratica',desc:'Tracciamento con codice univoco',icon:'clipboard',color:'green',route:'pratica'})}
            </div>
          </article>
        </div>
        <div class="dash-column">
          <article class="card">${cardTitle('Calendario di servizio','calendar','calendario')}
            <div id="dashboard-week"></div>
          </article>
          <article class="card">${cardTitle('Promemoria','bell','reclutamento')}
            <div class="bullet-list">
              ${bullet({kind:'Reclutamento',date:'Aperto',title:'Concorso Agente',desc:'Percorso con candidatura, colloquio e Accademia.',icon:'award',color:'blue',route:'reclutamento'})}
              ${bullet({kind:'Area personale',date:'Accesso riservato',title:'Profilo e turni',desc:'Accesso tramite il portale attuale.',icon:'lock',color:'orange',route:'area-agenti'})}
            </div>
            <div class="soft-note">Gli eventi personali richiedono l’autenticazione e non sono caricati in questa demo.</div>
          </article>
        </div>
        <div class="dash-column">
          <article class="card">${cardTitle('Bacheca','mail','comunicati')}<div class="bullet-list">${statements.map(bullet).join('')}</div><button class="link-button" data-route="comunicati" style="margin-top:8px">Vedi tutti ${icon('arrow')}</button></article>
          <article class="card">${cardTitle('Attività pianificate','clock','reparti')}
            <div class="bullet-list">
              ${bullet({kind:'Organizzazione',date:'6 reparti',title:'Struttura operativa',desc:'Volanti, Investigativa, NOS, Stradale, URP e Accademia.',icon:'users',color:'blue',route:'reparti'})}
              ${bullet({kind:'Formazione',date:'8 qualifiche',title:'Carriera e gradi',desc:'Dal grado di Agente fino al Questore.',icon:'award',color:'green',route:'gradi'})}
            </div>
          </article>
        </div>
      </div>${footer}`;
  }

  function weekWidget() {
    const start = mondayOfWeek();
    const end = new Date(start);end.setDate(end.getDate() + 5);
    const title = `${formatDate(start,{day:'numeric',month:'short',year:'numeric'})} - ${formatDate(end,{day:'numeric',month:'short',year:'numeric'})}`;
    const days = Array.from({length:6},(_,i)=>{const d=new Date(start);d.setDate(d.getDate()+i);return `<button class="day-pill ${i===activeDay?'selected':''}" data-day="${i}" aria-pressed="${i===activeDay}"><small>${['LUN','MAR','MER','GIO','VEN','SAB'][i]}</small><strong>${d.getDate()}</strong></button>`;}).join('');
    return `<div class="week-toolbar"><button class="round-control" data-week="-1" aria-label="Settimana precedente">${icon('chevron','style="transform:rotate(180deg)"')}</button><strong>${title}</strong><button class="round-control" data-week="1" aria-label="Settimana successiva">${icon('chevron')}</button></div><div class="weekdays">${days}</div><div class="calendar-detail">${icon('calendar')}<h3>Turni e appuntamenti</h3><p>Nessun evento collegato per questo giorno.<br>Il calendario si attiverà con i dati reali.</p></div>`;
  }
  function renderWeeks() { $$('#dashboard-week, #calendar-week').forEach(el=>el.innerHTML=weekWidget()); }

  pages.home = dashboard;
  pages.sportello = () => `${crumb('Sportello Cittadino','Denunce, autorizzazioni, colloqui e tracciamento delle pratiche.')} ${alert}
    <div class="section-columns">${serviceDefinitions.map(s=>`<article class="card service-card"><div class="service-icon">${icon(s.icon)}</div><h2>${s.title}</h2><p>${s.desc}</p><button class="outline-button" data-route="${s.route}">Accedi al servizio ${icon('arrow')}</button></article>`).join('')}</div>${footer}`;
  const formField = (label, placeholder, inputType='text') => `<label class="field-label">${label}<input type="${inputType}" class="field" placeholder="${placeholder}" required></label>`;
  const servicePage = (key,title,desc,fields,help) => `${crumb(title,desc)}${alert}<div class="section-columns one-small"><section class="card">
      ${cardTitle('Modulo di esempio','clipboard')}<form class="demo-form"><div class="form-grid">${fields}<label class="field-label full">Descrizione o note<textarea class="field" placeholder="Inserisci i dettagli relativi al tuo personaggio IC..."></textarea></label></div><div class="form-alert">Anteprima dell’interfaccia: i dati inseriti qui non vengono trasmessi né salvati.</div><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-top:15px"><button class="primary-button" type="submit">${icon('check')} Verifica anteprima</button>${external(`/sportello/${key}`,'Apri il modulo funzionante')}</div></form></section>
      <aside class="card">${cardTitle('Informazioni','info')}<p class="section-card-p">${help}</p><div class="soft-note">Le procedure mostrate sono esclusivamente in-character, nell'ambiente di gioco Italian Paradise XI.</div></aside></div>${footer}`;
  pages.denuncia = () => servicePage('denuncia','Presenta una denuncia online','Segnalazione dei fatti avvenuti nel contesto di gioco.',`${formField('Nome e cognome del personaggio','Nome IC')}${formField('Numero di telefono IC','Numero IC')}${formField('Luogo dei fatti','Luogo IC')}${formField('Data dei fatti','', 'date')}`,'Preparare i dati del personaggio, luogo e data dei fatti, eventuali testimoni e prove in-character.');
  pages.porto = () => servicePage('porto-darmi','Porto d’armi: rilascio e rinnovo','Richiesta di rilascio o rinnovo del PDA in-character.',`${formField('Nome e cognome del personaggio','Nome IC')}<label class="field-label">Tipo richiesta<select class="select-field"><option>Nuovo rilascio</option><option>Rinnovo</option></select></label>${formField('Motivazione','Motivo della richiesta')}<label class="field-label">Certificazione medica<select class="select-field"><option>Da presentare</option><option>Già disponibile</option></select></label>`,'Sono richiesti maggiore età IC, assenza di precedenti e idoneità psicofisica secondo le regole del server.');
  pages.colloquio = () => servicePage('colloquio','Prenota un colloquio','Richiedi un appuntamento con la dirigenza della Questura.',`${formField('Nome e cognome del personaggio','Nome IC')}<label class="field-label">Ufficio richiesto<select class="select-field"><option>Dirigenza</option><option>Ufficio Relazioni Pubbliche</option><option>Comando di reparto</option></select></label>${formField('Data preferita','','date')}<label class="field-label">Fascia oraria<select class="select-field"><option>Mattino</option><option>Pomeriggio</option><option>Sera</option></select></label>`,'Sul sito attuale puoi trasmettere la richiesta; riceverai un codice pratica per seguirla.');
  pages.pratica = () => `${crumb('Le mie pratiche','Ricerca per codice univoco e monitoraggio dello stato della richiesta.')}${alert}
    <div class="section-columns one-small"><section class="card">${cardTitle('Cerca con il codice','search')}<p class="section-card-p">Inserisci il codice di tracciamento ricevuto dal portale attuale.</p><form id="practice-form" class="demo-form"><label class="field-label">Codice pratica<input id="practice-code" class="field" placeholder="POL-2026-K7M2QX" inputmode="text" required pattern="POL-[0-9]{4}-[A-Za-z0-9]{6}" title="Formato: POL-2026-K7M2QX"></label><button class="primary-button" style="margin-top:13px" type="submit">${icon('search')} Controlla formato</button></form><div class="form-alert">Qui è possibile verificare solamente il formato. Per lo stato effettivo devi utilizzare il sito collegato.</div></section>
    <aside class="card">${cardTitle('Tracciamento ufficiale IPRP','clipboard')}<p class="section-card-p">Per motivi di riservatezza, in questa replica non recuperiamo né mostriamo pratiche reali.</p>${external('/sportello/pratica','Verifica sul sito IPRP XI')}</aside></div>${footer}`;
  pages.comunicati = () => `${crumb('Bacheca','Comunicati, avvisi e aggiornamenti della Questura IPRP XI.')}${alert}<section class="card">${cardTitle('Comunicazioni','mail')}<div class="filter-row"><label class="input-box" style="flex:1;min-width:190px">${icon('search')}<input id="board-search" type="search" placeholder="Cerca nella bacheca..." autocomplete="off"/></label><select id="board-filter" class="select-field" style="width:210px"><option value="Tutti">Tutte le categorie</option><option value="Reclutamento">Reclutamento</option><option value="Sportello">Sportello</option></select></div><div id="board-results" class="bullet-list"></div><div style="padding-top:16px">${external('/notizie','Apri i comunicati attuali')}</div></section>${footer}`;
  pages.reclutamento = () => `${crumb('Reclutamento','Bandi di concorso e selezioni per il personale del server roleplay.')}${alert}
    <div class="section-columns"><article class="card service-card"><span class="tag green">CANDIDATURE APERTE</span><h2>Concorso Agente — selezione permanente</h2><p>Compilazione della candidatura, quiz di ingresso, colloquio in-character e formazione in Accademia.</p><a class="primary-button" target="_blank" rel="noopener noreferrer" href="https://docs.google.com/forms/d/e/1FAIpQLSf7Ck4wRotaSwyLMEK0IJjAJdEMai2AfloMtVeLnV6FQPGkTA/viewform">Candidati ${icon('external')}</a></article>
    <article class="card service-card"><span class="tag green">SELEZIONE INTERNA</span><h2>Nucleo Operativo Speciale</h2><p>Selezione per Agenti con esperienza di servizio; prove fisiche e colloquio con i responsabili del reparto.</p>${external('/reclutamento','Dettagli del bando')}</article>
    <article class="card service-card"><span class="tag amber">IN ARRIVO</span><h2>Sezione Cinofila</h2><p>Assegnazioni iniziali per un reparto specializzato attualmente in costituzione.</p><button class="neutral-button" disabled>Non ancora disponibile</button></article>
    <article class="card">${cardTitle('Percorso di selezione','award')}${[['01','Candidatura','Compila il modulo e supera il quiz d’ingresso.'],['02','Colloquio IC','Partecipa al colloquio in-character.'],['03','Accademia','Segui la formazione e ottieni l’assegnazione.']].map(s=>`<div class="step-row"><span class="step-number">${s[0]}</span><div><strong>${s[1]}</strong><p>${s[2]}</p></div></div>`).join('')}</article></div>${footer}`;
  pages.organigramma = () => `${crumb('Organigramma','Gerarchia, struttura dei reparti e qualifiche della Questura IPRP XI.')}${alert}<section class="card"><div class="org-head">${icon('award')}<strong>QUESTORE</strong><p>Direzione generale della Questura e coordinamento dei sei reparti operativi.</p></div><div class="org-line"></div><div class="section-columns three">${divisions.map(d=>`<article class="card" style="box-shadow:none;border:1px solid var(--line)"><span class="tag blue">${d.subtitle}</span><h2 style="margin-top:10px">${d.title}</h2><p class="section-card-p">${d.desc}</p></article>`).join('')}</div></section><div style="margin-top:16px">${external('/organigramma','Consulta la struttura attuale')}</div>${footer}`;
  pages.reparti = () => `${crumb('Reparti operativi','Le sei divisioni della Questura Centrale.')}${alert}<div class="section-columns three">${divisions.map(d=>`<article class="card service-card"><span class="service-icon">${icon(d.icon)}</span><span class="tag blue">${d.subtitle}</span><h2>${d.title}</h2><p>${d.desc}</p></article>`).join('')}</div>${footer}`;
  pages.gradi = () => `${crumb('Qualifiche e gradi','Scala delle qualifiche in uso nella community roleplay.')}${alert}<div class="section-columns one-small"><article class="card">${cardTitle('Carriera — otto gradi','award')}${ranks.map(r=>`<div class="rank-row"><span class="rank-number">${r[0]}</span><span class="rank-copy"><strong>${r[1]}</strong><p>${r[2]}</p></span></div>`).join('')}</article><aside class="card">${cardTitle('Formazione','book')}<p class="section-card-p">Dalla prima divisa al coordinamento della Questura: la progressione valorizza esperienza e impegno del personaggio.</p>${external('/organigramma','Consulta le qualifiche')}</aside></div>${footer}`;
  pages.calendario = () => `${crumb('Calendario di servizio','Visualizzazione settimanale dei turni e degli appuntamenti.')}${alert}<div class="section-columns one-small"><article class="card">${cardTitle('Agenda settimanale','calendar')}<div id="calendar-week"></div></article><aside class="card">${cardTitle('Informazioni sul calendario','info')}<p class="section-card-p">Questa anteprima non ha accesso ai turni degli operatori. Quando sarà collegata a un backend, qui potranno essere mostrati gli appuntamenti e le assegnazioni.</p>${external('/login','Area Agenti attuale')}</aside></div>${footer}`;
  pages.modulistica = () => `${crumb('Modulistica','Procedure e richieste disponibili nel portale IPRP XI.')}${alert}<article class="card">${cardTitle('Modulistica digitale','book')}${serviceDefinitions.map(s=>`<div class="record-row"><span class="record-icon">${icon(s.icon)}</span><div class="record-content"><strong>${s.title}</strong><p>${s.desc}</p></div><button class="outline-button" data-route="${s.route}">Apri ${icon('arrow')}</button></div>`).join('')}</article>${footer}`;
  pages['area-agenti'] = () => `${crumb('Area Agenti','Accesso riservato a profilo, turni, pratiche e candidature.')}${alert}<div class="section-columns one-small"><section class="card">${cardTitle('Accesso riservato','lock')}<div style="text-align:center;padding:20px 10px 10px">${icon('shield','style="height:60px;width:60px;color:var(--primary)"')}<h2 style="margin-top:13px">Accedi con Discord</h2><p class="section-card-p">L’autenticazione resta sul tuo sito attuale: questa anteprima non raccoglie credenziali né token.</p>${external('/login','Vai all’accesso attuale')}</div></section><aside class="card">${cardTitle('Servizi per gli agenti','users')}<div class="bullet-list">${bullet({kind:'Area personale',date:'Riservato',title:'Profilo e ruoli',icon:'user',color:'blue'})}${bullet({kind:'Servizio',date:'Riservato',title:'Turni e attività',icon:'calendar',color:'green'})}${bullet({kind:'Gestione pratiche',date:'Riservato',title:'Richieste cittadine',icon:'clipboard',color:'orange'})}</div></aside></div>${footer}`;
  pages.info = () => `${crumb('Informazioni','Dettagli sul portale e sul prototipo grafico.')}
    <div class="section-columns"><article class="card">${cardTitle('Progetto IPRP XI','info')}<p class="section-card-p">Interfaccia ricreata in HTML, CSS e JavaScript, prendendo come riferimento le proporzioni, la gerarchia visiva e la palette del file DidUP condiviso per questo progetto. Non sono inclusi codice, account, marchi, loghi né dati personali del portale Argo.</p><p class="section-card-p">La struttura funzionale è basata sulle sezioni pubbliche del portale IPRP XI: Sportello, Comunicati, Reclutamento, Organigramma e Area Agenti.</p>${external('/','Apri il sito IPRP XI')}</article><article class="card">${cardTitle('Cosa funziona nella demo','check')}<div class="bullet-list">${bullet({kind:'Interfaccia',date:'Attivo',title:'Menu e navigazione',icon:'menu',color:'green'})}${bullet({kind:'Interfaccia',date:'Attivo',title:'Tema chiaro/scuro e responsive',icon:'sliders',color:'blue'})}${bullet({kind:'Anteprima',date:'Demo',title:'Ricerca, calendario e moduli locali',icon:'calendar',color:'orange'})}</div><p class="section-card-p">Accesso, notifiche, salvataggio dei moduli e pratiche richiedono integrazione con il backend del sito esistente.</p></article></div>${footer}`;

  function renderBoard() {
    const target=$('#board-results');if(!target)return;
    const query=($('#board-search')?.value||'').trim().toLocaleLowerCase('it');
    const kind=$('#board-filter')?.value||'Tutti';
    const items=statements.filter(s=>(kind==='Tutti'||s.kind===kind) && (`${s.kind} ${s.title} ${s.desc}`.toLocaleLowerCase('it').includes(query)));
    target.innerHTML=items.length?items.map(bullet).join(''):'<p class="small-empty">Nessuna comunicazione corrisponde alla ricerca.</p>';
  }
  function showToast(text) {
    const el=$('#toast');clearTimeout(toastTimer);el.textContent=text;el.classList.add('visible');toastTimer=setTimeout(()=>el.classList.remove('visible'),4700);
  }
  function setMobileMenu(open) {document.body.classList.toggle('sidebar-mobile-open',open);$('#mobile-overlay').hidden=!open;$('#sidebar-toggle').setAttribute('aria-expanded',String(open));}
  function navigate(route, updateHash=true) {
    const page=pages[route]?route:'home';
    if(updateHash && window.location.hash!==`#${page}`) history.pushState(null,'',`#${page}`);
    const root=$('#page-root'); root.innerHTML=pages[page]();
    $$('.nav-link').forEach(item=>{const active=item.dataset.route===page;item.classList.toggle('active',active);if(active)item.setAttribute('aria-current','page');else item.removeAttribute('aria-current');});
    document.title=`${routeLabels[page]} — Questura IPRP XI`;
    renderWeeks();renderBoard();window.scrollTo({top:0,behavior:'instant'});
    if(window.innerWidth<=760)setMobileMenu(false);
  }
  document.addEventListener('click',event=>{
    const routeEl=event.target.closest('[data-route]');
    if(routeEl){event.preventDefault();navigate(routeEl.dataset.route);$('#notification-popover').hidden=true;$('#notification-toggle').setAttribute('aria-expanded','false');return;}
    const day=event.target.closest('[data-day]');if(day){activeDay=Number(day.dataset.day);renderWeeks();return;}
    const shift=event.target.closest('[data-week]');if(shift){weekShift+=Number(shift.dataset.week);renderWeeks();return;}
    if(!event.target.closest('.notifications-wrap')){$('#notification-popover').hidden=true;$('#notification-toggle').setAttribute('aria-expanded','false');}
  });
  $('#sidebar-toggle').addEventListener('click',()=>{
    if(window.innerWidth<=760)setMobileMenu(!document.body.classList.contains('sidebar-mobile-open'));
    else {document.body.classList.toggle('sidebar-collapsed');$('#sidebar-toggle').setAttribute('aria-expanded',String(!document.body.classList.contains('sidebar-collapsed')));}
  });
  $('#mobile-overlay').addEventListener('click',()=>setMobileMenu(false));
  $('#theme-toggle').addEventListener('click',()=>{
    const isDark=document.body.classList.toggle('dark');
    $('#theme-toggle').innerHTML=icon(isDark?'sun':'moon');
    $('#theme-toggle').setAttribute('aria-label',isDark?'Attiva tema chiaro':'Attiva tema scuro');
  });
  $('#notification-toggle').addEventListener('click',()=>{
    const pop=$('#notification-popover');pop.hidden=!pop.hidden;$('#notification-toggle').setAttribute('aria-expanded',String(!pop.hidden));
  });
  $('#page-root').addEventListener('input',e=>{if(e.target.id==='board-search')renderBoard();});
  $('#page-root').addEventListener('change',e=>{if(e.target.id==='board-filter')renderBoard();});
  $('#page-root').addEventListener('submit',e=>{
    if(e.target.matches('.demo-form')){e.preventDefault();showToast('Anteprima validata. Nessun dato è stato salvato o inviato. Per continuare, usa il modulo sul sito IPRP XI.');}
    if(e.target.matches('#practice-form')){e.preventDefault();showToast('Il formato del codice è corretto. Per verificare lo stato reale, apri il sito IPRP XI.');}
  });
  window.addEventListener('hashchange',()=>navigate(location.hash.substring(1),false));
  window.addEventListener('resize',()=>{if(window.innerWidth>760)setMobileMenu(false);});
  navigate(location.hash.substring(1)||'home',false);
})();
