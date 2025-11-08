// Countdown Logic
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

// Persistent Contribution Counter
let count = localStorage.getItem('contributions') || 0;
const contributionDisplay = document.getElementById('contribution-count');
contributionDisplay.textContent = `${count} people contributing`;

document.getElementById('contribute-btn').addEventListener('click', () => {
  count++;
  localStorage.setItem('contributions', count);
  contributionDisplay.textContent = `${count} people contributing`;
});

// Viewer Count using CounterAPI (non-clickable display)
async function updateViewerCount() {
  try {
    const resp = await fetch('https://counterapi.com/api/great-meme-reset-2026/viewers', { method: 'GET' });
    const obj = await resp.json();
    document.getElementById('viewerCount').textContent = `Viewers online: ${obj.value}`;
  } catch (err) {
    console.error('Error fetching viewer count:', err);
  }
}

// Like Button Logic using CounterAPI
async function updateLikeCount() {
  try {
    const resp = await fetch('https://counterapi.com/api/great-meme-reset-2026/vote/likes');
    const obj = await resp.json();
    document.getElementById('likeCount').textContent = obj.value;
  } catch (err) {
    console.error('Error fetching like count:', err);
  }
}

document.getElementById('likeButton').addEventListener('click', async () => {
  try {
    await fetch('https://counterapi.com/api/great-meme-reset-2026/vote/likes', { method: 'POST' });
    updateLikeCount();
  } catch (err) {
    console.error('Error incrementing like count:', err);
  }
});

// Initial fetch
updateViewerCount();
updateLikeCount();
setInterval(updateViewerCount, 10000); // refresh viewers every 10 seconds
