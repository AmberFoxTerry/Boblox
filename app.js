const menuButton = document.querySelector('.triple-bar');
const sideMenu = document.querySelector('#side-menu');
const characterCube = document.querySelector('#character-cube');
const currentColorLabel = document.querySelector('#current-color');
const buyButtons = document.querySelectorAll('.buy-button');
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view-section');

const savedState = JSON.parse(localStorage.getItem('bobloxState') || '{}');
const state = {
  color: savedState.color || 'lightgray',
  ownedColors: new Set(savedState.ownedColors || []),
};

function saveState() {
  localStorage.setItem('bobloxState', JSON.stringify({
    color: state.color,
    ownedColors: [...state.ownedColors],
  }));
}

function updateAppearance() {
  const colors = {
    lightgray: { value: '#d9d9d9', name: 'Light gray' },
    red: { value: '#ef4444', name: 'Red' },
    blue: { value: '#3b82f6', name: 'Blue' },
    green: { value: '#22c55e', name: 'Green' },
  };
  const selected = colors[state.color] || colors.lightgray;
  characterCube.style.backgroundColor = selected.value;
  currentColorLabel.textContent = selected.name;
}

function updateBuyButtons() {
  buyButtons.forEach((button) => {
    const owned = state.ownedColors.has(button.dataset.color);
    button.disabled = owned;
    button.classList.toggle('owned', owned);
    button.textContent = owned ? 'Owned' : 'Buy';
  });
}

menuButton.addEventListener('click', () => {
  const isOpen = sideMenu.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  sideMenu.setAttribute('aria-hidden', String(!isOpen));
});

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    const selectedView = item.dataset.view;
    navItems.forEach((navItem) => navItem.classList.toggle('active', navItem === item));
    views.forEach((view) => view.classList.toggle('hidden', view.id !== `${selectedView}-view`));
  });
});

buyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const color = button.dataset.color;
    state.ownedColors.add(color);
    state.color = color;
    saveState();
    updateAppearance();
    updateBuyButtons();
  });
});

updateAppearance();
updateBuyButtons();
