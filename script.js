// Countdown Logic
function updateCountdown() {
  const now = new Date();
  const target = new Date('January 1, 2026 00:00:00');
  const diff = target - now;

  const months = Math.floor(diff / (1000*60*60*24*30));
  const weeks = Math.floor((diff % (1000*60*60*24*30)) / (1000*60*60*24*7));
  const days = Math.floor((diff % (1000*60*60*24*7)) / (1000*60*60*24));
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((diff % (1000*60)) / 1000);

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

// Persistent Contribute Button
let count = localStorage.getItem('contributions') || 0;
const contributionDisplay = document.getElementById('contribution-count');
contributionDisplay.textContent = `${count} people contributing`;

document.getElementById('contribute-btn').addEventListener('click', () => {
  count++;
  localStorage.setItem('contributions', count);
  contributionDisplay.textContent = `${count} people contributing`;
});

// CountAPI Viewer Count (global)
async function updateViewerCount() {
  try {
    const res = await fetch('https://api.countapi.xyz/hit/great-meme-reset-2026/viewers');
    const data = await res.json();
    document.getElementById('viewerCount').textContent = `👁️ Total Viewers: ${data.value}`;
  } catch (err) {
    console.error('Viewer count error:', err);
  }
}

// CountAPI Like Button
async function updateLikeCount() {
  try {
    const res = await fetch('https://api.countapi.xyz/get/great-meme-reset-2026/likes');
    const data = await res.json();
    document.getElementById('likeCount').textContent = data.value;
  } catch (err) {
    console.error('Like count error:', err);
  }
}

document.getElementById('likeButton').addEventListener('click', async () => {
  try {
    const res = await fetch('https://api.countapi.xyz/hit/great-meme-reset-2026/likes');
    const data = await res.json();
    document.getElementById('likeCount').textContent = data.value;
  } catch (err) {
    console.error('Error liking:', err);
  }
});

// Initial fetch
updateViewerCount();
updateLikeCount();
setInterval(updateViewerCount, 10000); // refresh viewers every 10 seconds
