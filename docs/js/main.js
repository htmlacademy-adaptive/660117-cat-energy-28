const nav = document.querySelector('.nav');
const button = document.querySelector('.header__button');

const setNavState = () => {
  if(!nav.classList.contains('nav--open')) {
    nav.classList.add('nav--open');
    button.style.backgroundImage = 'url("../img/svg/close-menu.svg")';
    return;
  }
  nav.classList.remove('nav--open');
  button.style.backgroundImage = 'url("../img/svg/nav-button-close.svg")';
};

button.addEventListener('click', setNavState);
