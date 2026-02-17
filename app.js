// 3D Parallax Effect
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    const x = (window.innerWidth / 2 - e.pageX) / 40;
    const y = (window.innerHeight / 2 - e.pageY) / 40;

    const content = document.querySelector('.hero-content');
    const mascot = document.querySelector('.hero-3d-mascot');

    if (content) content.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    if (mascot) mascot.style.transform = `translate(${x * 2}px, ${y * 2}px)`;
});

// Simplified Scroll To Modules
document.querySelectorAll('#hero-scroll').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
    });
});

// Options Menu Handling
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('opt-trigger')) {
        const overlay = document.getElementById('options-overlay');
        const topic = e.target.getAttribute('data-topic');
        const gfg = e.target.getAttribute('data-gfg');
        const hr = e.target.getAttribute('data-hr');

        document.getElementById('opt-title').textContent = `${topic} Path`;
        document.getElementById('gfg-link').onclick = () => window.open(gfg, '_blank');
        document.getElementById('explain-dsa').onclick = () => alert(`Loading AI Explanation for ${topic}...`);
        document.getElementById('hr-link').onclick = () => window.open(hr, '_blank');

        overlay.classList.remove('hidden');
    }

    if (e.target.classList.contains('close-opts') || e.target.id === 'options-overlay') {
        document.getElementById('options-overlay').classList.add('hidden');
    }
});

// Glitch intensity
const glitchText = document.querySelector('.glitch-text');
if (glitchText) {
    setInterval(() => {
        const offset = Math.random() * 4;
        glitchText.style.textShadow = `
            ${offset}px ${-offset}px 0 rgba(55, 118, 171, 0.7),
            ${-offset}px ${offset}px 0 rgba(255, 212, 59, 0.7)
        `;
    }, 100);
}

// Reveal animations (Existing)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.glass-card, .section-title').forEach(el => {
    el.classList.add('reveal-init');
    observer.observe(el);
});
