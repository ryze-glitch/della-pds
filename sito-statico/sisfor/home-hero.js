// Ricerca dei servizi nella home: filtra un indice delle pagine del sito (nessun dato esterno).
(function () {
  var box = document.getElementById('hero-search');
  if (!box) return;
  var input = box.querySelector('input');
  var lista = box.querySelector('.hero-results');
  var VOCI = [
    ['Denuncia, querela, esposto', 'Come presentare una denuncia', 'denuncia.html', 'denunciare reato furto querela esposto'],
    ["Porto d'armi", 'Licenze e richieste di porto', 'porto-armi.html', 'armi licenza pistola fucile'],
    ['Prenota un colloquio', 'Scegli giorno e orario', 'prenota.html', 'appuntamento prenotazione evento autorizzazione'],
    ['Concorso pubblico', 'Entra nella Polizia di Stato', 'concorso.html', 'bando candidarsi arruolamento agente'],
    ['Stato della pratica', 'Controlla una richiesta già inviata', 'sportello/pratica', 'pratica codice richiesta stato'],
    ['Ufficio Relazioni col Pubblico', 'URP', 'urp.html', 'urp informazioni reclami'],
    ['Notizie', 'Comunicati e novità', 'notizie.html', 'comunicati news novità avvisi'],
    ['La Dirigenza', 'Questore e dirigenti', 'chi-siamo.html', 'chi siamo questore dirigenti'],
    ['Qualifiche', 'Gradi e qualifiche', 'qualifiche.html', 'gradi agente ispettore commissario'],
    ['Area Personale', 'Formazione SISFOR+ e gestione', 'sisfor', 'agenti formazione corsi quiz accesso login']
  ];
  var sel = -1, mostrati = [];
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function cerca(q) {
    q = norm(q.trim());
    if (!q) return VOCI.slice(0, 5);
    var parole = q.split(/\s+/);
    return VOCI.filter(function (v) {
      var t = norm(v.join(' '));
      return parole.every(function (p) { return t.indexOf(p) !== -1; });
    }).slice(0, 5);
  }
  function disegna() {
    mostrati = cerca(input.value);
    lista.innerHTML = '';
    if (!mostrati.length) {
      var e = document.createElement('div'); e.className = 'vuoto'; e.textContent = 'Nessun risultato per “' + input.value.trim() + '”.'; lista.appendChild(e); return;
    }
    mostrati.forEach(function (v, i) {
      var a = document.createElement('a'); a.href = v[2]; if (i === sel) a.className = 'sel';
      var b = document.createElement('b'); b.textContent = v[0];
      var s = document.createElement('span'); s.textContent = v[1];
      a.appendChild(b); a.appendChild(s); lista.appendChild(a);
    });
  }
  function apri() { sel = -1; disegna(); box.classList.add('open'); }
  function chiudi() { box.classList.remove('open'); sel = -1; }
  input.addEventListener('focus', apri);
  input.addEventListener('input', apri);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, mostrati.length - 1); disegna(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); disegna(); }
    else if (e.key === 'Enter') { var v = mostrati[sel >= 0 ? sel : 0]; if (v) window.location.href = v[2]; }
    else if (e.key === 'Escape') { chiudi(); input.blur(); }
  });
  document.addEventListener('click', function (e) { if (!box.contains(e.target)) chiudi(); });
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); input.focus(); }
  });
})();
