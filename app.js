const COLORS = {
  lightgray: { label: 'Light gray', hex: '#cbd0d6' },
  red: { label: 'Red', hex: '#ef4444' },
  blue: { label: 'Blue', hex: '#3b82f6' },
  green: { label: 'Green', hex: '#22c55e' },
};

let saved = {};
try { saved = JSON.parse(localStorage.getItem('bobloxState') || '{}'); } catch { saved = {}; }
const state = { selected: saved.selected || null, owned: new Set(saved.owned || []) };
const save = () => localStorage.setItem('bobloxState', JSON.stringify({ selected: state.selected, owned: [...state.owned] }));
const activeColor = () => COLORS[state.selected] || COLORS.lightgray;

function paintAvatars() {
  document.querySelectorAll('.avatar').forEach((avatar) => avatar.style.setProperty('--avatar-color', activeColor().hex));
  const label = document.querySelector('#home-current-color');
  if (label) label.textContent = activeColor().label;
}

function renderShop() {
  document.querySelectorAll('.buy-button').forEach((button) => {
    const owned = state.owned.has(button.dataset.color);
    button.textContent = owned ? (state.selected === button.dataset.color ? 'Wearing' : 'Owned') : 'Get free';
    button.classList.toggle('owned', owned);
  });
}

function colorCard(color) {
  const wearing = state.selected === color;
  return `<button class="owned-item ${wearing ? 'selected' : ''}" data-color="${color}" type="button"><span class="swatch ${color}-swatch"></span><span><strong>${COLORS[color].label}</strong><small>${wearing ? 'Currently wearing · click to remove' : 'Click to wear'}</small></span><span class="check">${wearing ? '✓' : ''}</span></button>`;
}

function renderOwned() {
  const container = document.querySelector('#owned-colors');
  const home = document.querySelector('#home-owned-colors');
  const colors = [...state.owned].filter((color) => COLORS[color]);
  if (container) container.innerHTML = colors.length ? colors.map(colorCard).join('') : '<p class="empty-message">You do not own any colors yet. Visit the Shop to get one for free.</p>';
  if (home) home.innerHTML = colors.length ? colors.map((color) => `<button class="cosmetic-pill ${state.selected === color ? 'selected' : ''}" data-color="${color}" type="button"><span class="swatch ${color}-swatch"></span>${COLORS[color].label}${state.selected === color ? ' · Wearing' : ''}</button>`).join('') : '<p class="empty-message">No colors yet. Visit the Shop to claim your first free color.</p>';
  document.querySelectorAll('[data-color].owned-item, [data-color].cosmetic-pill').forEach((item) => item.addEventListener('click', () => {
    state.selected = state.selected === item.dataset.color ? null : item.dataset.color;
    save(); renderOwned(); renderShop(); paintAvatars();
  }));
}

const menu = document.querySelector('.triple-bar');
const side = document.querySelector('#side-menu');
const backdrop = document.querySelector('.menu-backdrop');
function setMenu(open) {
  if (!menu || !side) return;
  side.classList.toggle('is-open', open); if (backdrop) backdrop.classList.toggle('is-open', open);
  menu.setAttribute('aria-expanded', String(open)); side.setAttribute('aria-hidden', String(!open));
}
if (menu) menu.addEventListener('click', () => setMenu(!side.classList.contains('is-open')));
if (backdrop) backdrop.addEventListener('click', () => setMenu(false));

const previewToggle = document.querySelector('#preview-toggle');
const previewContent = document.querySelector('#preview-content');
if (previewToggle && previewContent) previewToggle.addEventListener('click', () => {
  const hidden = previewContent.classList.toggle('preview-hidden');
  previewToggle.textContent = hidden ? 'Show' : 'Hide'; previewToggle.setAttribute('aria-expanded', String(!hidden));
});

document.querySelectorAll('.buy-button').forEach((button) => button.addEventListener('click', () => {
  const color = button.dataset.color; state.owned.add(color); state.selected = color; save(); renderShop(); renderOwned(); paintAvatars();
}));
const reset = document.querySelector('#reset-state');
if (reset) reset.addEventListener('click', () => { state.selected = null; save(); renderShop(); renderOwned(); paintAvatars(); });
renderShop(); renderOwned(); paintAvatars();
