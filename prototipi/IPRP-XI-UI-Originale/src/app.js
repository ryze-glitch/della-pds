/**
 * IPRP XI - ricostruzione UI, milestone 01.
 * La homepage e' l'HTML effettivamente renderizzato dall'archivio del sito.
 * Le pagine di sportello sono anteprime interattive, NON collegamenti autentici.
 * Nessun dato digitato viene inviato o salvato.
 */
(() => {
  'use strict';
  const main = document.querySelector('main');
  const homeMarkup = main.innerHTML;
  const sidebar = document.querySelector('aside[aria-label="Menu principale"]');
  const menuButton = document.querySelector('header button[aria-label="Mostra o nascondi il menu"]');
  const initialRoute = window.location.hash.slice(1) || '/';
  let wizardStep = 0;
  let wizard = {};

  const userIcon = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v2"/><circle cx="12" cy="7" r="4"/></svg>';
  const arrow = '<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>';
  const googleIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.38-.18-2.02H12v3.83h5.39a4.61 4.61 0 0 1-2 3.02v2.5h3.24c1.89-1.74 2.97-4.3 2.97-7.33Z"/><path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.44l-3.24-2.5c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.75-5.59-4.1H3.07v2.57A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.41 13.92A6 6 0 0 1 6.1 12c0-.67.12-1.32.31-1.92V7.51H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.49l3.34-2.57Z"/><path fill="#EA4335" d="M12 5.98c1.47 0 2.79.5 3.82 1.5l2.87-2.87A9.58 9.58 0 0 0 12 2a10 10 0 0 0-8.93 5.51l3.34 2.57c.79-2.35 2.99-4.1 5.59-4.1Z"/></svg>`;
  const routeInfo = {
    '/sportello/denuncia': ['Denuncia online','Presenta una denuncia online','Compila il modulo con i dati dei fatti. Al termine riceverai un codice pratica per seguirne l’avanzamento.'],
    '/sportello/porto-darmi': ["Porto d'armi","Richiedi porto d’armi","Accedi per compilare una richiesta di rilascio o rinnovo nell’ambito del gioco di ruolo."],
    '/sportello/colloquio': ['Colloquio','Colloquio con i dirigenti','Richiedi un appuntamento con i dirigenti della Questura IPRP.'],
    '/sportello/pratica': ['Le mie pratiche','Consulta le tue pratiche','Inserisci il codice che hai ricevuto per controllare lo stato della pratica.'],
    '/notizie': ['Comunicati','Comunicati ufficiali','Avvisi e comunicazioni della Questura IPRP.'],
    '/reclutamento': ['Reclutamento','Entra nella Polizia di Stato','Informazioni sui bandi e sulle candidature in Italian Paradise XI.'],
    '/organigramma': ['Organigramma','Organigramma della Questura','Reparti, uffici e organizzazione del personale.'],
    '/login': ['Area Agenti','Area riservata agenti','Accesso al pannello interno della Questura IPRP.']
  };

  const header = (name,title,subtitle) => `<div class="iprp-header"><div class="iprp-breadcrumbs"><a href="#/">Home</a><span>›</span><span>Sportello Cittadino</span><span>›</span><span>${name}</span></div><h1 class="iprp-title">${title}</h1><p class="iprp-subtitle">${subtitle}</p></div>`;
  const tips = `<aside class="iprp-tips"><div class="iprp-aside-title">Prima di iniziare</div><ul class="iprp-checks"><li><span>⊙</span><span>Nome e cognome del tuo personaggio (IC)</span></li><li><span>⊙</span><span>Numero di telefono e documento IC</span></li><li><span>⊙</span><span>Luogo, data e ora dei fatti</span></li><li><span>⊙</span><span>Eventuali testimoni e link a screenshot o clip</span></li></ul><div class="iprp-notice"><strong>ⓘ &nbsp; Servizio in-character</strong><div>Questo modulo è parte del gioco di ruolo. Per emergenze reali chiama il 112.</div></div></aside>`;
  const safe = (x) => String(x || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const field = (name, label, opts = {}) => `<div class="iprp-field ${opts.wide?'iprp-span2':''}"><label for="w-${name}">${label}${opts.required?' <b>*</b>':''}</label>${opts.tag === 'textarea' ? `<textarea id="w-${name}" name="${name}" ${opts.required?'required':''} placeholder="${opts.placeholder||''}">${safe(wizard[name])}</textarea>` : opts.options ? `<select id="w-${name}" name="${name}" ${opts.required?'required':''}><option value="">Seleziona...</option>${opts.options.map(x=>`<option value="${x}" ${wizard[name]===x?'selected':''}>${x}</option>`).join('')}</select>` : `<input id="w-${name}" name="${name}" type="${opts.type||'text'}" ${opts.required?'required':''} value="${safe(wizard[name])}"/>`}${opts.help?`<small>${opts.help}</small>`:''}</div>`;
  const progress = () => `<div class="iprp-form-meta"><span class="iprp-meta-dot">${userIcon}<span>Personaggio dimostrativo <span class="iprp-muted">· accesso fittizio</span></span></span><span class="iprp-demo-mark">MODALITÀ DEMO</span></div><div class="iprp-progress-head"><span><strong>Passo ${wizardStep} di 3</strong> · ${['','Il personaggio','I fatti','Riepilogo'][wizardStep]}</span><span>Denuncia online</span></div><div class="iprp-progress">${[1,2,3].map(i=>`<div class="${i<=wizardStep?'active':''}"></div>`).join('')}</div>`;

  function renderDenuncia() {
    const h = routeInfo['/sportello/denuncia'];
    main.innerHTML=header(...h)+`<div class="iprp-content"><div id="iprp-denuncia-left">${wizardStep ? renderWizard() : `<div class="iprp-panel iprp-auth-panel"><div class="iprp-auth-inside"><div class="iprp-auth-icon">${userIcon}</div><h2>Accedi per continuare</h2><p>Per presentare una richiesta devi accedere con il tuo account Google. L’accesso avviene direttamente su <strong>accounts.google.com</strong>: il sito non vede la tua password.</p><button type="button" class="iprp-google" data-action="google">${googleIcon} Continua con Google</button><p class="iprp-tiny">Nome ed e-mail dell’account vengono inviati alla Questura insieme alla richiesta, per identificare chi la presenta.</p><button class="iprp-demo-link" data-action="demo" type="button">Apri il modulo dimostrativo senza autenticazione</button></div></div>`}</div>${tips}</div>`;
  }

  function renderWizard() {
    let body='';
    if(wizardStep === 1) body = `<h2>Dati del querelante</h2><div class="iprp-fields">${field('nome','Nome (IC)',{required:true})}${field('cognome','Cognome (IC)',{required:true})}${field('telefono','Numero di telefono (IC)',{required:true,help:'Il numero del tuo telefono in gioco.'})}${field('documento',"Numero documento d'identità (IC)",{required:true})}${field('discord','Discord (OOC) — facoltativo',{help:'Solo se vuoi essere ricontattato su Discord dallo staff.'})}</div>`;
    if(wizardStep === 2) body = `<h2>Descrizione dei fatti</h2><div class="iprp-fields">${field('luogo','Luogo dei fatti',{required:true})}${field('data','Data',{type:'date',required:true})}${field('ora','Ora',{type:'time',required:true})}${field('tipologia','Tipologia',{required:true,options:['Furto','Rapina','Aggressione','Truffa','Altro']})}${field('descrizione','Descrizione dei fatti',{required:true,wide:true,tag:'textarea',placeholder:'Racconta cosa è successo…'})}${field('allegati','Link a screenshot o clip (facoltativo)',{wide:true})}</div>`;
    if(wizardStep === 3) body = `<h2>Riepilogo della richiesta</h2><div class="iprp-muted"><p><strong>Personaggio:</strong> ${safe(wizard.nome)} ${safe(wizard.cognome)}</p><p><strong>Telefono:</strong> ${safe(wizard.telefono)}</p><p><strong>Documento:</strong> ${safe(wizard.documento)}</p><p><strong>Luogo:</strong> ${safe(wizard.luogo)}</p><p><strong>Tipologia:</strong> ${safe(wizard.tipologia)}</p><p><strong>Descrizione:</strong> ${safe(wizard.descrizione)}</p></div><div class="iprp-inline-alert">Anteprima locale: non verrà inviata alcuna pratica, né generato un codice reale.</div>`;
    return progress()+`<form id="iprp-wizard-form" class="iprp-panel iprp-form">${body}<div class="iprp-form-footer"><span>I campi con * sono obbligatori.</span><span class="iprp-actions">${wizardStep>1?'<button class="iprp-secondary" type="button" data-action="back">Indietro</button>':''}<button type="submit" class="iprp-primary">${wizardStep===3?'Termina anteprima':'Continua '+arrow}</button></span></div></form>`;
  }

  function renderGeneric(path) {
    const [name,title,subtitle] = routeInfo[path];
    const back = `<a class="iprp-secondary" href="#/">Torna alla Home</a>`;
    let content='';
    if(path === '/sportello/pratica') {
      content=`<h2>Stato della pratica</h2><p>La ricerca richiede il backend del sito originale. In questa anteprima puoi verificare soltanto l’interfaccia.</p><form id="iprp-lookup" class="iprp-search"><input name="codice" aria-label="Codice pratica" placeholder="Inserisci codice pratica" required/><button class="iprp-primary" type="submit">Cerca ${arrow}</button></form><div id="iprp-lookup-result"></div>`;
    } else if(path === '/login') {
      content=`<div class="iprp-auth-inside" style="margin:0 auto"><div class="iprp-auth-icon">${userIcon}</div><h2>Area Riservata Agenti</h2><p>Accedi con Discord per consultare i servizi interni.</p><div class="iprp-notice" style="text-align:left">L’accesso Discord non è collegato in questa anteprima. Nessuna autenticazione viene eseguita.</div></div>`;
    } else {
      content=`<p>Sezione predisposta con la UI originale IPRP XI. I contenuti dinamici e le relative API non sono inclusi nello ZIP esportato dal browser.</p>${back}`;
    }
    main.innerHTML = header(name,title,subtitle)+`<div class="iprp-generic"><div class="iprp-generic-card">${content}</div></div>`;
  }

  function updateNav(path) {
    sidebar?.querySelectorAll('nav a').forEach(el => {
      const active = (el.getAttribute('data-route')||'') === path;
      el.classList.toggle('bg-[#0f3947]',active);
      el.classList.toggle('text-[#3fc4d6]',active);
      el.classList.toggle('text-fg',!active);
      el.classList.toggle('hover:bg-white/5',!active);
      active ? el.setAttribute('aria-current','page') : el.removeAttribute('aria-current');
    });
    document.title = (path==='/' ? 'Home' : (routeInfo[path]?.[0]||'Home'))+' · Questura IPRP · Anteprima UI';
  }

  function render(path) {
    const next = path in routeInfo ? path : '/';
    if(next === '/') main.innerHTML = homeMarkup;
    else if(next === '/sportello/denuncia') renderDenuncia();
    else renderGeneric(next);
    updateNav(next);
    document.body.classList.remove('iprp-mobile-open');
    window.scrollTo({top:0,behavior:'instant'});
  }

  menuButton?.addEventListener('click', () => {
    if(window.matchMedia('(max-width:1023px)').matches) document.body.classList.toggle('iprp-mobile-open');
    else document.body.classList.toggle('iprp-hide-sidebar');
  });
  const overlay=document.createElement('button');
  overlay.className='iprp-menu-overlay';overlay.type='button';overlay.setAttribute('aria-label','Chiudi il menu');
  overlay.addEventListener('click',()=>document.body.classList.remove('iprp-mobile-open'));
  document.body.appendChild(overlay);

  window.addEventListener('hashchange', () => {wizardStep=0;wizard={};render(location.hash.slice(1)||'/');});
  document.addEventListener('click',(event) => {
    const button=event.target.closest('[data-action]');
    if(!button)return;
    const action=button.getAttribute('data-action');
    if(action==='google') {
      const notice=document.createElement('div');
      notice.className='iprp-inline-alert';
      notice.textContent='Google OAuth non è collegato in questa anteprima. Per visualizzare il modulo, seleziona la modalità demo.';
      button.parentElement.querySelector('.iprp-inline-alert')?.remove();
      button.parentElement.appendChild(notice);
    }
    if(action==='demo') {wizardStep=1;wizard={};renderDenuncia();}
    if(action==='back') {wizardStep=Math.max(1,wizardStep-1);renderDenuncia();}
  });
  document.addEventListener('submit',(event) => {
    if(event.target.id==='iprp-wizard-form') {
      event.preventDefault();
      const data=new FormData(event.target);
      for(const [k,v] of data.entries()) wizard[k]=v;
      if(wizardStep<3){wizardStep++;renderDenuncia();}
      else {wizardStep=0;wizard={};renderDenuncia();document.querySelector('.iprp-auth-inside')?.insertAdjacentHTML('beforeend','<div class="iprp-inline-alert">Anteprima completata. Nessuna denuncia è stata inviata.</div>');}
    }
    if(event.target.id==='iprp-lookup') {
      event.preventDefault();
      const el=document.querySelector('#iprp-lookup-result');
      if(el) el.innerHTML='<div class="iprp-inline-alert">Ricerca non disponibile: database e API non sono collegati in questa anteprima.</div>';
    }
  });
  render(initialRoute);
})();
