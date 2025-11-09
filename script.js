// COUNTDOWN
function updateCountdown() {
  const now = new Date();
  const target = new Date('January 1, 2026 00:00:00');
  const diff = target - now;

  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const weeks = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24 * 7));
  const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('countdown').innerHTML = `
    <div><strong>${months}</strong><div class='label'>Months</div></div>
    <div><strong>${weeks}</strong><div class='label'>Weeks</div></div>
    <div><strong>${days}</strong><div class='label'>Days</div></div>
    <div><strong>${hours}</strong><div class='label'>Hours</div></div>
    <div><strong>${minutes}</strong><div class='label'>Minutes</div></div>
    <div><strong>${seconds}</strong><div class='label'>Seconds</div></div>`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// CONTRIBUTION BUTTON
let count = localStorage.getItem('contributions') || 0;
const contributionDisplay = document.getElementById('contribution-count');
contributionDisplay.textContent = `${count} people contributing`;

document.getElementById('contribute-btn').addEventListener('click', () => {
  count++;
  localStorage.setItem('contributions', count);
  contributionDisplay.textContent = `${count} people contributing`;
  document.getElementById('contribute-btn').classList.add('glow');
  setTimeout(() => document.getElementById('contribute-btn').classList.remove('glow'), 1000);
});

// COUNTAPI (Total visits + Likes)
async function updateTotalVisits() {
  const res = await fetch('https://api.countapi.xyz/hit/great-meme-reset-2026/totalvisits');
  const data = await res.json();
  document.getElementById('totalVisits').textContent = `🌍 Total Visits: ${data.value}`;
}

// Like button
async function updateLikeCount() {
  const res = await fetch('https://api.countapi.xyz/get/great-meme-reset-2026/likes');
  const data = await res.json();
  document.getElementById('likeCount').textContent = data.value || 0;
}
document.getElementById('likeButton').addEventListener('click', async () => {
  const res = await fetch('https://api.countapi.xyz/hit/great-meme-reset-2026/likes');
  const data = await res.json();
  document.getElementById('likeCount').textContent = data.value;
  document.getElementById('likeButton').classList.add('glow');
  setTimeout(() => document.getElementById('likeButton').classList.remove('glow'), 1000);
});

// Simulated current viewer count
let currentViewers = Math.floor(Math.random() * 3) + 1;
function updateCurrentViewers() {
  // Random simulation for now
  const fluctuation = Math.floor(Math.random() * 3) - 1;
  currentViewers = Math.max(1, currentViewers + fluctuation);
  document.getElementById('currentViewers').textContent = `👁️ Current Viewers: ${currentViewers}`;
}
setInterval(updateCurrentViewers, 8000);
updateCurrentViewers();

// SHARE BUTTONS
const pageUrl = encodeURIComponent(window.location.href);
document.getElementById('shareX').href = `https://twitter.com/intent/tweet?text=The%20Great%20Meme%20Reset%202026%20is%20coming!&url=${pageUrl}`;
document.getElementById('shareReddit').href = `https://www.reddit.com/submit?url=${pageUrl}&title=The%20Great%20Meme%20Reset%202026%20is%20coming!`;

document.getElementById('copyLink').addEventListener('click', async () => {
  await navigator.clipboard.writeText(window.location.href);
  const msg = document.getElementById('copyMessage');
  msg.style.display = 'block';
  setTimeout(() => (msg.style.display = 'none'), 1500);
});

// Init
updateTotalVisits();
updateLikeCount();
