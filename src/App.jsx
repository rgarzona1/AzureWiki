import { useMemo, useState } from 'react'
import { categories, articles } from './data/articles.js'
import './App.css'

function Icon({ name, size = 18 }) {
  const paths = {
    cloud: <><path d="M7 18h10a4 4 0 0 0 .4-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18Z" /><path d="m10 13 2-2 2 2m-2-2v5" /></>,
    identity: <><circle cx="12" cy="8" r="3" /><path d="M5 20a7 7 0 0 1 14 0M18 5l1.5 1.5L22 4" /></>,
    data: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    monitor: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4M7 12l3-3 3 3 4-5" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4 4" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22Z" /><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20M8 7h8m-8 4h8" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 1 1 8 0v3m-4 5v2" /></>,
  }

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || paths.book}
    </svg>
  )
}

function Header({ query, onQueryChange, results, onSelectArticle, onHome, onDocumentation, onCategories, selectedId, activeCategory }) {
  return (
    <header className="topbar">
      <button className="brand" type="button" onClick={onHome} aria-label="Ir al inicio de AzureWiki">
        <span className="brand-mark"><Icon name="cloud" size={22} /></span>
        <span className="brand-copy"><strong>Azure<span>Wiki</span></strong><small>Wiki de Seguridad en la Nube</small></span>
      </button>
      <nav className="top-links" aria-label="Navegación principal">
        <button type="button" className={!selectedId && !activeCategory ? 'top-link active' : 'top-link'} onClick={onHome}>Inicio</button>
        <button type="button" className={selectedId || activeCategory ? 'top-link active' : 'top-link'} onClick={onDocumentation}>Documentación</button>
        <button type="button" className="top-link" onClick={onCategories}>Categorías</button>
      </nav>
      <div className="search-wrap">
        <label className="search-box">
          <Icon name="search" size={17} />
          <input aria-label="Buscar artículos" placeholder="Buscar en la wiki..." value={query} onChange={(event) => onQueryChange(event.target.value)} />
        </label>
        {query.trim() && (
          <div className="search-results" role="listbox" aria-label="Resultados de búsqueda">
            {results.length ? results.slice(0, 7).map((article) => (
              <button type="button" role="option" aria-selected={article.id === selectedId} key={article.id} onClick={() => onSelectArticle(article)}>
                <span className="result-icon"><Icon name="book" size={16} /></span>
                <span><strong>{article.title}</strong><small>{article.categoryTitle}</small></span>
              </button>
            )) : <p className="no-results">No hay artículos que coincidan.</p>}
          </div>
        )}
      </div>
      <span className="edition"><span className="status-dot" /> Guía de estudio</span>
    </header>
  )
}

function Sidebar({ activeCategory, selectedId, onSelectCategory, onSelectArticle, onHome }) {
  return (
    <aside className="sidebar" id="documentacion">
      <button type="button" className={`side-home ${!activeCategory ? 'selected' : ''}`} onClick={onHome}>
        <span className="nav-glyph"><Icon name="book" /></span> Inicio
      </button>
      <div className="side-label">EXPLORAR</div>
      <div className="side-categories">
        {categories.map((category) => (
          <section className="side-group" key={category.id}>
            <button type="button" onClick={() => onSelectCategory(category.id)} className={`category-trigger ${activeCategory === category.id ? 'selected' : ''}`}>
              <span className="nav-glyph"><Icon name={category.icon} /></span>
              <span>{category.title}</span>
              <span className="category-count">{category.articleIds.length}</span>
            </button>
            {activeCategory === category.id && (
              <div className="side-articles">
                {articles.filter((article) => article.categoryId === category.id).map((article) => (
                  <button type="button" key={article.id} className={selectedId === article.id ? 'side-article active' : 'side-article'} onClick={() => onSelectArticle(article)}>
                    {article.title}
                  </button>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
      <div className="sidebar-note">
        <span className="note-icon"><Icon name="lock" size={16} /></span>
        <p><strong>Aprendizaje seguro</strong><br />Conceptos para comprender, no para administrar recursos reales.</p>
      </div>
      <div className="sidebar-footer">AZUREWIKI <span>•</span> DOCUMENTACIÓN EDUCATIVA</div>
    </aside>
  )
}

function Breadcrumbs({ category, article, onHome, onCategory }) {
  return (
    <div className="breadcrumbs">
      <button type="button" onClick={onHome}>Inicio</button><span>/</span>
      {category && <><button type="button" onClick={() => onCategory(category.id)}>{category.title}</button><span>/</span></>}
      <span className="crumb-current">{article ? article.title : category ? 'Temas' : 'Centro de conocimiento'}</span>
    </div>
  )
}

function CategoryCard({ category, onClick }) {
  return (
    <button type="button" className="category-card" onClick={onClick}>
      <span className={`category-icon ${category.id}`}><Icon name={category.icon} size={22} /></span>
      <span className="card-title">{category.title}</span>
      <span className="card-description">{category.description}</span>
      <span className="card-foot">{category.articleIds.length} temas <span>→</span></span>
    </button>
  )
}

function ArticleCard({ article, onClick, featured = false }) {
  const category = categories.find((item) => item.id === article.categoryId)
  return (
    <button type="button" className={`article-card ${featured ? 'featured-card' : ''}`} onClick={onClick}>
      <span className="article-card-top"><span className={`mini-dot ${category.id}`} />{category.title}</span>
      <strong>{article.title}</strong>
      <span className="article-summary">{article.introduction}</span>
      <span className="read-link">Leer artículo <Icon name="arrow" size={15} /></span>
    </button>
  )
}

function HomePage({ onSelectCategory, onSelectArticle }) {
  const featured = ['responsabilidad-compartida', 'rbac', 'key-vault', 'activity-log']
    .map((id) => articles.find((article) => article.id === id))
    .filter(Boolean)

  return (
    <div className="home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> CENTRO DE CONOCIMIENTO</div>
          <h1>Explora la seguridad<br />de <span>Microsoft Azure</span></h1>
          <p>Una guía práctica para entender cómo se protegen las identidades, los datos y la infraestructura en la nube.</p>
          <button type="button" className="primary-button" onClick={() => onSelectCategory('cloud-security')}>Explorar documentación <Icon name="arrow" size={16} /></button>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="cloud-illustration"><Icon name="cloud" size={55} /><span className="cloud-lock"><Icon name="lock" size={22} /></span></div>
          <span className="visual-tag tag-top">IDENTIDAD VERIFICADA</span>
          <span className="visual-tag tag-bottom">CAPAS DE PROTECCIÓN <i /></span>
          <span className="visual-node node-one" /><span className="visual-node node-two" /><span className="visual-node node-three" />
        </div>
        <div className="hero-index">01 <span>/</span> 04</div>
      </section>

      <section className="category-section" id="categorias">
        <div className="section-heading">
          <div><div className="eyebrow">RUTAS DE APRENDIZAJE</div><h2>Explora por categoría</h2></div>
          <span className="section-note">Conceptos organizados para aprender paso a paso</span>
        </div>
        <div className="category-grid">{categories.map((category) => <CategoryCard key={category.id} category={category} onClick={() => onSelectCategory(category.id)} />)}</div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <div><div className="eyebrow">PARA EMPEZAR</div><h2>Temas recomendados</h2></div>
          <span className="section-note">Una selección esencial de la wiki</span>
        </div>
        <div className="featured-grid">{featured.map((article) => <ArticleCard key={article.id} article={article} featured onClick={() => onSelectArticle(article)} />)}</div>
      </section>
      <footer className="page-footer"><span>AzureWiki <span className="footer-separator">/</span> Conocimiento abierto sobre seguridad cloud</span><span>Contenido educativo · Fuentes oficiales de Microsoft Learn</span></footer>
    </div>
  )
}

function CategoryPage({ category, onSelectArticle }) {
  const items = articles.filter((article) => article.categoryId === category.id)
  return (
    <div className="category-page">
      <div className={`category-banner ${category.id}`}>
        <span className={`category-icon ${category.id}`}><Icon name={category.icon} size={23} /></span>
        <div><div className="eyebrow">CATEGORÍA</div><h1>{category.title}</h1><p>{category.description}</p></div>
        <span className="banner-count">{String(items.length).padStart(2, '0')}<small>ARTÍCULOS</small></span>
      </div>
      <div className="section-heading list-heading"><div><div className="eyebrow">CONTENIDO DE APRENDIZAJE</div><h2>Artículos de esta categoría</h2></div></div>
      <div className="article-list">{items.map((article, index) => (
        <button type="button" className="list-article" key={article.id} onClick={() => onSelectArticle(article)}>
          <span className="list-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="list-article-copy"><strong>{article.title}</strong><span>{article.introduction}</span></span>
          <span className="list-chevron">→</span>
        </button>
      ))}</div>
    </div>
  )
}

function ArticlePage({ article, category, onCategory }) {
  return (
    <article className="article-page">
      <div className="article-kicker"><span className={`mini-dot ${category.id}`} />{category.title}<span className="kicker-separator">·</span>{article.readTime}</div>
      <h1>{article.title}</h1>
      <p className="article-lede">{article.introduction}</p>
      <div className="article-callout"><span className="callout-mark"><Icon name="book" size={18} /></span><p><strong>Idea clave</strong>{article.concept}</p></div>
      <div className="article-body">
        <section><h2>¿Qué aporta?</h2><p>{article.explanation}</p></section>
        <section><h2>Características principales</h2><ul>{article.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></section>
        <section className="importance-block"><h2>Importancia para la seguridad</h2><p>{article.importance}</p></section>
        <section><h2>Ejemplo en Azure</h2><p>{article.example}</p></section>
        <section><h2>Relación con otros mecanismos</h2><p>{article.relations}</p></section>
      </div>
      <div className="article-sources">
        <div className="sources-heading"><span className="source-mark"><Icon name="book" size={17} /></span><div><h2>Referencias oficiales</h2><p>Amplía el tema en Microsoft Learn</p></div></div>
        <div className="source-links">{article.references.map((reference) => <a href={reference.url} target="_blank" rel="noreferrer" key={reference.url}>{reference.label}<span>↗</span></a>)}</div>
      </div>
      <div className="article-end"><span>Fin del artículo</span><button type="button" onClick={() => onCategory(category.id)}>Ver más en {category.title} <Icon name="arrow" size={15} /></button></div>
    </article>
  )
}

function App() {
  const [selectedId, setSelectedId] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [query, setQuery] = useState('')
  const selectedArticle = articles.find((article) => article.id === selectedId)
  const selectedCategory = selectedArticle
    ? categories.find((category) => category.id === selectedArticle.categoryId)
    : categories.find((category) => category.id === activeCategory)
  const results = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('es')
    if (!term) return []
    return articles.filter((article) => [
      article.title,
      article.introduction,
      article.concept,
      article.explanation,
      article.categoryTitle,
      ...article.keywords,
    ].join(' ').toLocaleLowerCase('es').includes(term))
  }, [query])

  function showHome() {
    setSelectedId(null)
    setActiveCategory(null)
    setQuery('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function showCategory(categoryId) {
    setSelectedId(null)
    setActiveCategory(categoryId)
    setQuery('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function showArticle(article) {
    setSelectedId(article.id)
    setActiveCategory(article.categoryId)
    setQuery('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function showCategories() {
    showHome()
    window.requestAnimationFrame(() => {
      document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  return (
    <div className="app-shell">
      <Header query={query} onQueryChange={setQuery} results={results} onSelectArticle={showArticle} onHome={showHome} onDocumentation={() => showCategory('cloud-security')} onCategories={showCategories} selectedId={selectedId} activeCategory={activeCategory} />
      <div className="workspace">
        <Sidebar activeCategory={activeCategory} selectedId={selectedId} onSelectCategory={showCategory} onSelectArticle={showArticle} onHome={showHome} />
        <main className="main-content">
          <Breadcrumbs category={selectedCategory} article={selectedArticle} onHome={showHome} onCategory={showCategory} />
          {selectedArticle
            ? <ArticlePage article={selectedArticle} category={selectedCategory} onCategory={showCategory} />
            : selectedCategory
              ? <CategoryPage category={selectedCategory} onSelectArticle={showArticle} />
              : <HomePage onSelectCategory={showCategory} onSelectArticle={showArticle} />}
        </main>
      </div>
    </div>
  )
}

export default App
