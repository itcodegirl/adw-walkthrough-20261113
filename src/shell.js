// Shared site shell: header (site name + nav) and footer.
// Every page imports this through main.js and tells it which page it is.
// All markup here is static and authored in this file, so innerHTML is safe.
// The page key is only compared against NAV keys, never inserted into markup.

const SITE_NAME = 'Jenna Studio'
const YEAR = '2026'

const NAV = [
  { key: 'home', label: 'Home', href: 'index.html' },
  { key: 'about', label: 'About', href: 'about.html' },
  { key: 'contact', label: 'Contact', href: 'index.html#contact' },
]

export function renderShell(page) {
  const header = document.querySelector('header')
  const footer = document.querySelector('footer')
  if (!header || !footer) return

  const links = NAV.map(({ key, label, href }) => {
    const current = key === page ? ' aria-current="page"' : ''
    return `<li><a href="${href}"${current}>${label}</a></li>`
  }).join('')

  header.innerHTML = `
    <a class="site-name" href="index.html">${SITE_NAME}</a>
    <nav class="site-nav" aria-label="Main">
      <ul role="list">${links}</ul>
    </nav>
  `

  footer.textContent = `${SITE_NAME} · Built with care · ${YEAR}`
}
