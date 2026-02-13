const card = document.getElementById("card");
const typedEl = document.getElementById("typed");
const replayBtn = document.getElementById("replayBtn");
const heartsBg = document.getElementById("bgHearts");

// ✍️ Edit this message however you want:
const MESSAGE =
`Happy Valentine’s Day, baby ko 💗

Thank you for being my Valentine and for loving me the way you do.
Even when we’re far, I feel your love, your effort, and your presence every day.

You make me smile like a fool, and you make life feel softer.
I’m proud of you. I adore you. I’m choosing you always.

I love you so much my babyyyyy 💘`;

let opened = false;
let timer = null;

// ---- Typewriter (always clears first)
function typeWriter(text, speed = 20) {
  if (timer) clearTimeout(timer);
  typedEl.textContent = "";
  let i = 0;

  const tick = () => {
    typedEl.textContent += text.charAt(i);
    i++;
    if (i < text.length) timer = setTimeout(tick, speed);
  };
  tick();
}

function openCard() {
  if (opened) return;
  opened = true;

  card.classList.add("flipped");
  setTimeout(() => {
    typeWriter(MESSAGE, 18);
    confettiBurst();
    burstHearts(14);
  }, 520);
}

// Click + touch safe
card.addEventListener("click", openCard);
card.addEventListener("touchstart", openCard, { passive: true });
card.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openCard();
});

// Replay (don’t flip again)
replayBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  typeWriter(MESSAGE, 16);
  burstHearts(10);
});

// ---- Hearts background (lightweight)
function spawnHeart() {
  const s = document.createElement("span");
  s.textContent = Math.random() < 0.85 ? "💗" : "💘";
  s.style.left = (Math.random() * 100) + "vw";
  s.style.fontSize = (16 + Math.random() * 16) + "px";
  s.style.animationDuration = (4 + Math.random() * 2.5) + "s";
  heartsBg.appendChild(s);
  setTimeout(() => s.remove(), 6500);
}

function burstHearts(n=10){
  for(let i=0;i<n;i++) setTimeout(spawnHeart, i*90);
}

setInterval(() => {
  if (!opened) return;
  if (document.hidden) return;
  if (Math.random() < 0.35) spawnHeart();
}, 700);

// ---- Confetti (short burst, stops)
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function confettiBurst() {
  const pieces = [];
  const count = 120;
  const stopAt = performance.now() + 1700;

  for (let i = 0; i < count; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      w: 6 + Math.random() * 7,
      h: 8 + Math.random() * 10,
      vx: -1.8 + Math.random() * 3.6,
      vy: 2.3 + Math.random() * 4.2,
      r: Math.random() * Math.PI * 2,
      vr: (-0.18 + Math.random() * 0.36),
      hue: 320 + Math.random() * 40,
      a: 1
    });
  }

  function tick(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      p.vy *= 0.99;
      p.a *= 0.992;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.globalAlpha = Math.max(0, p.a);
      ctx.fillStyle = `hsl(${p.hue} 90% 65%)`;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    }

    if (now < stopAt) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  requestAnimationFrame(tick);
}