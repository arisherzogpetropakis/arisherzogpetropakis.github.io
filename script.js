const sections = [...document.querySelectorAll('main section[id]')];
const navigationLinks = [...document.querySelectorAll('nav a')];
let navigationTarget = sections.find(section => `#${section.id}` === location.hash)?.id || null;
document.getElementById('year').textContent = new Date().getFullYear();

function setActiveSection(id) {
  for (const link of navigationLinks) {
    if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}

let scheduled = false;
function updateNavigation() {
  const marker = document.querySelector('.site-header').getBoundingClientRect().height + 140;
  const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= marker);
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
  setActiveSection(navigationTarget || (atBottom ? sections.at(-1).id : (current || sections[0]).id));
  scheduled = false;
}
window.addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); }
}, { passive: true });
window.addEventListener('resize', updateNavigation);
window.addEventListener('load', updateNavigation);
for (const link of navigationLinks) link.addEventListener('click', () => {
  navigationTarget = link.hash.slice(1);
  setActiveSection(navigationTarget);
});
window.addEventListener('hashchange', () => {
  navigationTarget = sections.find(section => `#${section.id}` === location.hash)?.id || null;
  updateNavigation();
});
function resumeScrollNavigation() {
  if (!navigationTarget) return;
  navigationTarget = null;
  updateNavigation();
}
for (const event of ['wheel', 'touchstart', 'pointerdown']) window.addEventListener(event, resumeScrollNavigation, { passive: true });
window.addEventListener('keydown', event => {
  if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) resumeScrollNavigation();
});
updateNavigation();
