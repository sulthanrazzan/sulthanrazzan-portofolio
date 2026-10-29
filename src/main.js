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

/* ===== Lightbox foto ===== */
const lightbox = document.getElementById('lightbox')
const lbImg = document.getElementById('lightbox-img')
const lbCaption = document.getElementById('lightbox-caption')
const lbCounter = document.getElementById('lightbox-counter')
const lbPrev = document.getElementById('lightbox-prev')
const lbNext = document.getElementById('lightbox-next')
const lbClose = document.getElementById('lightbox-close')

let lbItems = []
let lbIndex = 0
let lbLastFocus = null

// Buat semua foto galeri bisa difokus dengan keyboard
document.querySelectorAll('[data-lightbox]').forEach((img) => {
  img.tabIndex = 0
  img.setAttribute('role', 'button')
})

function lbRender() {
  const img = lbItems[lbIndex]
  const many = lbItems.length > 1
  lbImg.src = img.currentSrc || img.src
  lbImg.alt = img.alt
  lbCaption.textContent = img.alt
  lbCounter.textContent = `${lbIndex + 1} / ${lbItems.length}`
  lbCounter.classList.toggle('hidden', !many)
  lbPrev.classList.toggle('hidden', !many)
  lbNext.classList.toggle('hidden', !many)
}

function lbOpen(img) {
  lbItems = [...document.querySelectorAll(`[data-lightbox="${img.dataset.lightbox}"]`)]
  lbIndex = lbItems.indexOf(img)
  lbLastFocus = document.activeElement
  lbRender()
  lightbox.classList.remove('hidden')
  lightbox.classList.add('flex')
  document.documentElement.style.overflow = 'hidden'
  lbClose.focus()
}

function lbHide() {
  lightbox.classList.add('hidden')
  lightbox.classList.remove('flex')
  document.documentElement.style.overflow = ''
  lbImg.removeAttribute('src')
  if (lbLastFocus) lbLastFocus.focus()
}

function lbStep(dir) {
  lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length
  lbRender()
}

document.addEventListener('click', (e) => {
  const img = e.target.closest('[data-lightbox]')
  if (img) lbOpen(img)
})

document.addEventListener('keydown', (e) => {
  const isOpen = !lightbox.classList.contains('hidden')
  if (!isOpen) {
    if (e.key === 'Enter' && e.target.matches('[data-lightbox]')) lbOpen(e.target)
    return
  }
  if (e.key === 'Escape') lbHide()
  if (e.key === 'ArrowLeft' && lbItems.length > 1) lbStep(-1)
  if (e.key === 'ArrowRight' && lbItems.length > 1) lbStep(1)
})

lbClose.addEventListener('click', lbHide)
lbPrev.addEventListener('click', () => lbStep(-1))
lbNext.addEventListener('click', () => lbStep(1))
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lbHide()
})

// Geser jari di HP
let lbTouchX = null
lightbox.addEventListener('touchstart', (e) => { lbTouchX = e.touches[0].clientX }, { passive: true })
lightbox.addEventListener('touchend', (e) => {
  if (lbTouchX === null || lbItems.length < 2) return
  const dx = e.changedTouches[0].clientX - lbTouchX
  if (Math.abs(dx) > 50) lbStep(dx < 0 ? 1 : -1)
  lbTouchX = null
})