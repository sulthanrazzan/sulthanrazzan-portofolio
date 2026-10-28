import './style.css'

/* ===== Mode terang / gelap ===== */
const root = document.documentElement
const themeToggle = document.getElementById('theme-toggle')

themeToggle.addEventListener('click', () => {
  const isDark = root.classList.toggle('dark')
  try {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  } catch (e) {}
})

/* ===== Menu HP ===== */
const menuToggle = document.getElementById('menu-toggle')
const mobileMenu = document.getElementById('mobile-menu')
const iconOpen = document.getElementById('icon-open')
const iconClose = document.getElementById('icon-close')

function setMenu(open) {
  mobileMenu.classList.toggle('hidden', !open)
  iconOpen.classList.toggle('hidden', open)
  iconClose.classList.toggle('hidden', !open)
  menuToggle.setAttribute('aria-expanded', String(open))
}

menuToggle.addEventListener('click', () => {
  setMenu(mobileMenu.classList.contains('hidden'))
})

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false))
})