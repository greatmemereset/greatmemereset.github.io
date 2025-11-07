// public/script.js
(function(){
  const target = new Date(2026,0,1,0,0,0,0);
  const segmentsOrder = ['months','weeks','days','hours','minutes','seconds'];
  const labels = { months:'Months', weeks:'Weeks', days:'Days', hours:'Hours', minutes:'Minutes', seconds:'Seconds' };

  const countdownEl = document.getElementById('countdown');
  const tzLabel = document.getElementById('tz-label');
  const nowTimeChip = document.getElementById('now-time');
  const targetTimeChip = document.getElementById('target-time');
  const viewersCountEl = document.getElementById('viewers-count');
  const contribBtn = document.getElementById('contribBtn');
  const contribText = document.getElementById('contribText');

  // Build segments
  segmentsOrder.forEach(k=>{
    const seg = document.createElement('div');
    seg.className='segment';
    seg.id='seg-'+k;
    seg.innerHTML = `<div class="big" id="val-${k}">0</div><div class="label">${labels[k]}</div>`;
    countdownEl.appendChild(seg);
  });

  const userLocale = navigator.language || 'en-US';
  const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local Time';
  tzLabel.textContent = tzName ? `Your timezone: ${tzName}` : '';

  function pad(n){ return String(n).padStart(2,'0'); }
  function formatLocal(dt){
    try{
      return new Intl.DateTimeFormat(userLocale, { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false, timeZoneName:'short' }).format(dt);
    }catch(e){ return dt.toString(); }
  }

  targetTimeChip.textContent = 'Target: ' + formatLocal(target);

  function computeParts(now, target){
    if (now >= target) return {months:0,weeks:0,days:0,hours:0,minutes:0,seconds:0};
    let months = (target.getFullYear()-now.getFullYear())*12 + (target.getMonth()-now.getMonth());
    let test = new Date(now.getTime());
    test.setMonth(test.getMonth()+months);
    if (test > target){ months--; test = new Date(now.getTime()); test.setMonth(test.getMonth()+months); }
    let remainingMs = target - test;
    let totalSeconds = Math.floor(remainingMs/1000);
    let seconds = totalSeconds % 60;
    let totalMinutes = Math.floor(totalSeconds/60);
    let minutes = totalMinutes % 60;
    let totalHours = Math.floor(totalMinutes/60);
    let hours = totalHours % 24;
    let totalDays = Math.floor(totalHours/24);
    let weeks = Math.floor(totalDays/7);
    let days = totalDays % 7;
    return {months, weeks, days, hours, minutes, seconds};
  }

  function update(){
    const now = new Date();
    nowTimeChip.textContent = 'Now: ' + formatLocal(now);
    const parts = computeParts(now, target);
    document.getElementById('val-months').textContent = parts.months;
    document.getElementById('val-weeks').textContent = pad(parts.weeks);
    document.getElementById('val-days').textContent = pad(parts.days);
    document.getElementById('val-hours').textContent = pad(parts.hours);
    document.getElementById('val-minutes').textContent = pad(parts.minutes);
    document.getElementById('val-seconds').textContent = pad(parts.seconds);

    const note = document.getElementById('note');
    if (new Date() >= target){
      note.innerHTML = '<strong>Happy Great Meme Reset — Jan 1, 2026 has arrived in your timezone!</strong>';
      try{ confetti({ particleCount: 200, spread: 80 }); }catch(e){}
    }
  }

  update();
  setInterval(update, 250);

  // Socket.IO realtime
  const socket = io();

  socket.on('connect', ()=>{ /* connected */ });

  socket.on('viewersUpdate', d => {
    viewersCountEl.textContent = `Viewers online: ${d.count}`;
  });

  socket.on('contribUpdate', d => {
    const cnt = Number(d.count) || 0;
    contribText.textContent = `${cnt} of people contributing`;
  });

  contribBtn.addEventListener('click', ()=>{
    // optimistic UI handled by server push
    socket.emit('incrementContrib', { increment: 1 });
    // also POST as HTTP fallback
    fetch('/api/contrib', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ increment: 1 }) }).catch(()=>{});
  });

  // Also get initial global value from HTTP endpoint in case socket message was missed
  fetch('/api/contrib').then(r=>r.json()).then(d=>{ if (d && typeof d.count === 'number') contribText.textContent = `${d.count} of people contributing`; }).catch(()=>{});

})();
