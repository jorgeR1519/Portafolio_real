import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Project = {
  id: number
  title: string
  description: string
  stack: string[]
  github: string
  demo?: string
  language?: string
  updated_at?: string
  image?: string
}

type ContactForm = {
  name: string
  email: string
  message: string
}

type WindowTab =
  | 'about'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'contact'
type ThemeMode = 'night' | 'day'

const initialForm: ContactForm = {
  name: '',
  email: '',
  message: '',
}

const certifications = [
  {
    id: 1,
    title: 'ISO 27001 Foundation',
    issuer: 'ISO/IEC 27001',
    year: '2026 - 2028',
    description:
      'Base formal en gestion de seguridad de la informacion y controles asociados a entornos organizacionales.',
  },
  {
    id: 2,
    title: 'eJPTv2',
    issuer: 'eLearnSecurity / INE Security',
    year: '2025 - 2028',
    description:
      'Certificacion enfocada en penetration testing, enumeracion, explotacion y fundamentos practicos de seguridad ofensiva.',
  },
]

const experience = [
  {
    company: 'AISEING S.A.S.',
    role: 'Gestor de proyectos / Soporte tecnico',
    period: 'Agosto 2025 - Enero 2026',
    summary:
      'Apoyo en coordinacion de soporte tecnico, gestion de tickets y administracion de mesa de ayuda. Participacion en el desarrollo de un aplicativo web en Laravel para automatizar y mejorar procesos internos.',
  },
  {
    company: 'TERMACOL S.A.S.',
    role: 'Desarrollador Full Stack',
    period: 'Enero 2025 - Junio 2025',
    summary:
      'Desarrollo de portal en Laravel para gestionar compras con roles y auditoria, reportes, notificaciones, macros en Excel para nomina, flujos en Power Automate y apps en Power Apps para optimizar la entrega de EPP.',
  },
]

const education = [
  {
    title: 'Tecnologia en Analisis y Desarrollo de Software',
    place: 'Centro de Electricidad y Automatizacion Industrial (C.E.A.I.)',
    period: '2022 - 2025',
  },
  {
    title: 'Ingenieria en Sistemas',
    place: 'Universidad Jose Antonio Camacho',
    period: 'Inicio previsto 2026',
  },
]

const skillGroups = [
  {
    title: 'Lenguajes y frameworks',
    items: [
      'PHP / Laravel',
      'Python / Django / Flask',
      'JavaScript / Node.js',
      'Dart / Flutter',
      'React',
      'FastAPI',
    ],
  },
  {
    title: 'Datos y despliegue',
    items: ['MySQL', 'Git / GitHub', 'Docker', 'APIs REST', 'Testing de endpoints'],
  },
  {
    title: 'Automatizacion e IA',
    items: [
      'Power Automate',
      'Power Apps',
      'Ollama',
      'Chatbots funcionales',
      'Bots en Python',
    ],
  },
  {
    title: 'Seguridad',
    items: [
      'OWASP Top 10',
      'Burp Suite',
      'nmap',
      'sqlmap',
      'Nikto',
      'wfuzz',
      'JWT',
      'bcrypt',
      'Sanitizacion de entradas',
    ],
  },
]

const languages = [
  { name: 'Espanol', level: 'Nativo' },
  { name: 'Ingles', level: 'B2 - Lectura de documentacion tecnica' },
]

const languageIcons: Record<string, string> = {
  Python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  TypeScript:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  Vue: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  PHP: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  Laravel:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',
  Flask: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',
  FastAPI:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  'Node.js':
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  MySQL: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  Docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  JWT: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/json/json-original.svg',
  Pandas:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
  Selenium:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg',
  Bootstrap:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
  Tailwind:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  CSS: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  Security:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
  HTB: 'https://www.hackthebox.com/images/landingv3/HTB-favicon.svg',
}

const tabs: { id: WindowTab; label: string; hint: string }[] = [
  { id: 'about', label: 'Sobre mi', hint: 'Perfil y enlaces' },
  { id: 'experience', label: 'Experiencia', hint: 'Trayectoria profesional' },
  { id: 'education', label: 'Educacion', hint: 'Formacion academica' },
  { id: 'skills', label: 'Skills', hint: 'Stack y seguridad' },
  { id: 'projects', label: 'Proyectos', hint: 'Repositorios y demos' },
  { id: 'certifications', label: 'Certificaciones', hint: 'Credenciales' },
  { id: 'contact', label: 'Contactarme', hint: 'Canal directo' },
]

const PROJECTS_PER_PAGE = 4

function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [projectsError, setProjectsError] = useState('')
  const [form, setForm] = useState<ContactForm>(initialForm)
  const [sending, setSending] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [activeTab, setActiveTab] = useState<WindowTab>('about')
  const [theme, setTheme] = useState<ThemeMode>('night')
  const [currentProjectPage, setCurrentProjectPage] = useState(1)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects')

        if (!response.ok) {
          throw new Error('No se pudieron cargar los proyectos.')
        }

        const data: Project[] = await response.json()
        setProjects(data)
        setCurrentProjectPage(1)
      } catch (error) {
        setProjectsError(
          error instanceof Error
            ? error.message
            : 'Ocurrio un error al consultar la API.',
        )
      } finally {
        setLoadingProjects(false)
      }
    }

    void loadProjects()
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSending(true)
    setFormMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('No fue posible enviar el mensaje.')
      }

      const data: { message?: string } = await response.json()
      setForm(initialForm)
      setFormMessage(data.message ?? 'Mensaje enviado correctamente.')
    } catch (error) {
      setFormMessage(
        error instanceof Error
          ? error.message
          : 'Ocurrio un error al enviar el formulario.',
      )
    } finally {
      setSending(false)
    }
  }

  const totalProjectPages = Math.max(
    1,
    Math.ceil(projects.length / PROJECTS_PER_PAGE),
  )
  const paginatedProjects = projects.slice(
    (currentProjectPage - 1) * PROJECTS_PER_PAGE,
    currentProjectPage * PROJECTS_PER_PAGE,
  )

  const renderWindow = () => {
    if (activeTab === 'about') {
      return (
        <section className="window-pane">
          <div className="window-pane__header">
            <p className="eyebrow">Sobre mi</p>
            <h2>Jorge Enrique Renteria Mosquera</h2>
          </div>
          <div className="about-layout">
            <div className="about-card">
              <img
                className="hero__avatar hero__avatar--large"
                src="https://avatars.githubusercontent.com/u/130851745?v=4"
                alt="Avatar de GitHub de Jorge"
              />
              <div className="pulse-ring" aria-hidden="true" />
            </div>
            <div className="about-card about-card--wide">
              <div className="identity-block">
                <h3>Desarrollador Full Stack</h3>
                <p>Santiago de Cali, Colombia</p>
                <p>jorgeleviakerman@gmail.com</p>
                <p>+57 3226536242</p>
              </div>
              <p className="section__text">
                Tecnologo en Analisis y Desarrollo de Software con foco en
                desarrollo de aplicaciones, automatizacion y soluciones con
                integracion de IA. Experiencia practica en proyectos Full Stack
                usando Laravel, Django, Flask, Node.js y herramientas modernas
                de despliegue; ademas de experiencia en pruebas de seguridad
                como complemento para entregar software robusto y seguro.
              </p>
              <p className="section__text">
                Busco roles centrados en desarrollo de software donde aportar
                buenas practicas, automatizacion y entrega continua.
              </p>
              <ul className="stack-list stack-list--spaced">
                <li>FastAPI</li>
                <li>React</li>
                <li>Laravel</li>
                <li>Django</li>
                <li>Node.js</li>
                <li>Seguridad</li>
              </ul>
              <div className="blog-card">
                <p className="project-card__index">Portafolio / Writeups</p>
                <h3>Blog de Hack The Box</h3>
                <p>
                  Publicas writeups y analisis tecnicos de maquinas y
                  laboratorios, reforzando tu perfil de desarrollo con enfoque
                  en seguridad.
                </p>
                <div className="hero__actions hero__actions--compact">
                  <a
                    href="https://jorger1519.github.io/"
                    target="_blank"
                    rel="noreferrer"
                    className="button button--secondary"
                  >
                    Abrir blog
                  </a>
                  <a
                    href="https://github.com/jorgeR1519"
                    target="_blank"
                    rel="noreferrer"
                    className="button button--ghost"
                  >
                    Abrir GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )
    }

    if (activeTab === 'experience') {
      return (
        <section className="window-pane">
          <div className="window-pane__header">
            <p className="eyebrow">Experiencia</p>
            <h2>Trayectoria profesional</h2>
          </div>
          <div className="timeline-grid">
            {experience.map((item) => (
              <article className="info-card" key={item.company}>
                <p className="project-card__index">{item.period}</p>
                <h3>{item.company}</h3>
                <p className="info-card__subtitle">{item.role}</p>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </section>
      )
    }

    if (activeTab === 'education') {
      return (
        <section className="window-pane">
          <div className="window-pane__header">
            <p className="eyebrow">Educacion</p>
            <h2>Formacion academica</h2>
          </div>
          <div className="timeline-grid">
            {education.map((item) => (
              <article className="info-card" key={item.title}>
                <p className="project-card__index">{item.period}</p>
                <h3>{item.title}</h3>
                <p className="info-card__subtitle">{item.place}</p>
              </article>
            ))}
          </div>
        </section>
      )
    }

    if (activeTab === 'skills') {
      return (
        <section className="window-pane">
          <div className="window-pane__header">
            <p className="eyebrow">Skills</p>
            <h2>Stack, automatizacion y seguridad</h2>
          </div>
          <div className="skills-grid">
            {skillGroups.map((group) => (
              <article className="info-card" key={group.title}>
                <h3>{group.title}</h3>
                <ul className="stack-list stack-list--spaced">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="timeline-grid timeline-grid--small">
            {languages.map((item) => (
              <article className="info-card" key={item.name}>
                <p className="project-card__index">Idioma</p>
                <h3>{item.name}</h3>
                <p className="info-card__subtitle">{item.level}</p>
              </article>
            ))}
          </div>
        </section>
      )
    }

    if (activeTab === 'projects') {
      return (
        <section className="window-pane">
          <div className="window-pane__header">
            <p className="eyebrow">Proyectos</p>
            <h2>Repositorios cargados desde la API</h2>
          </div>
          {loadingProjects ? (
            <p className="status-card">Cargando proyectos...</p>
          ) : projectsError ? (
            <p className="status-card status-card--error">{projectsError}</p>
          ) : (
            <>
              <div className="projects-grid">
                {paginatedProjects.map((project) => (
                  <article className="project-card" key={project.id}>
                    {project.image ? (
                      <img
                        className="project-card__image"
                        src={project.image}
                        alt={`Vista previa del repositorio ${project.title}`}
                        loading="lazy"
                      />
                    ) : null}
                    <p className="project-card__index">Proyecto {project.id}</p>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-card__meta">
                      {project.language ? <span>{project.language}</span> : null}
                      {project.updated_at ? (
                        <span>Actualizado {project.updated_at}</span>
                      ) : null}
                    </div>
                    <ul className="project-card__stack">
                      {project.stack.map((item) => (
                        <li key={item}>
                          {languageIcons[item] ? (
                            <img
                              className="tech-icon"
                              src={languageIcons[item]}
                              alt={`Icono de ${item}`}
                              loading="lazy"
                            />
                          ) : null}
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="project-card__links">
                      <a href={project.github} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                      {project.demo ? (
                        <a href={project.demo} target="_blank" rel="noreferrer">
                          Demo
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
              <div className="pagination" aria-label="Paginacion de proyectos">
                <button
                  type="button"
                  className="pagination__button"
                  onClick={() =>
                    setCurrentProjectPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentProjectPage === 1}
                >
                  Anterior
                </button>
                <span className="pagination__status">
                  Pagina {currentProjectPage} de {totalProjectPages}
                </span>
                <button
                  type="button"
                  className="pagination__button"
                  onClick={() =>
                    setCurrentProjectPage((page) =>
                      Math.min(totalProjectPages, page + 1),
                    )
                  }
                  disabled={currentProjectPage === totalProjectPages}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </section>
      )
    }

    if (activeTab === 'certifications') {
      return (
        <section className="window-pane">
          <div className="window-pane__header">
            <p className="eyebrow">Certificaciones</p>
            <h2>Credenciales y validacion tecnica</h2>
          </div>
          <div className="certifications-grid">
            {certifications.map((certification) => (
              <article className="cert-card" key={certification.id}>
                <div className="cert-card__badge">{certification.year}</div>
                <p className="project-card__index">Certificacion</p>
                <h3>{certification.title}</h3>
                <p className="cert-card__issuer">{certification.issuer}</p>
                <p>{certification.description}</p>
              </article>
            ))}
          </div>
        </section>
      )
    }

    return (
      <section className="window-pane">
        <div className="window-pane__header">
          <p className="eyebrow">Canal seguro</p>
          <h2>Ventana de contacto</h2>
        </div>
        <div className="contact-summary">
          <div className="info-card">
            <p className="project-card__index">Contacto directo</p>
            <h3>Datos visibles</h3>
            <p>jorgeleviakerman@gmail.com</p>
            <p>+57 3226536242</p>
            <p>Santiago de Cali, Colombia</p>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Nombre
            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              required
            />
          </label>
          <label>
            Correo
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              required
            />
          </label>
          <label>
            Mensaje
            <textarea
              value={form.message}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  message: event.target.value,
                }))
              }
              rows={5}
              required
            />
          </label>
          <button
            className="button button--primary"
            type="submit"
            disabled={sending}
          >
            {sending ? 'Enviando...' : 'Enviar mensaje'}
          </button>
          {formMessage ? <p className="form-feedback">{formMessage}</p> : null}
        </form>
      </section>
    )
  }

  return (
    <main className="page">
      <div className="page__glow page__glow--left" aria-hidden="true" />
      <div className="page__glow page__glow--right" aria-hidden="true" />
      <div className="page__glow page__glow--center" aria-hidden="true" />

      <section className="hero-window">
        <div className="hero-window__topbar">
          <div className="window-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="theme-toggle">
            <button
              type="button"
              className={
                theme === 'day'
                  ? 'theme-toggle__button is-active'
                  : 'theme-toggle__button'
              }
              onClick={() => setTheme('day')}
            >
              Dia
            </button>
            <button
              type="button"
              className={
                theme === 'night'
                  ? 'theme-toggle__button is-active'
                  : 'theme-toggle__button'
              }
              onClick={() => setTheme('night')}
            >
              Noche
            </button>
          </div>
        </div>

        <div className="hero-window__body">
          <div className="hero-window__copy">
            <p className="eyebrow">Terminal Portfolio</p>
            <h1>Jorge Enrique Renteria Mosquera</h1>
            <p className="hero__lead">Desarrollador Full Stack</p>
            <p className="hero__text">
              Desarrollo aplicaciones, automatizaciones, integraciones con IA y
              soluciones seguras con enfoque full stack.
            </p>
            <div className="hero__microdata">
              <span>Santiago de Cali, Colombia</span>
              <span>jorgeleviakerman@gmail.com</span>
              <span>+57 3226536242</span>
            </div>
            <div className="hero__actions">
              <button
                type="button"
                className="button button--primary"
                onClick={() => setActiveTab('projects')}
              >
                Abrir proyectos
              </button>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => setActiveTab('experience')}
              >
                Ver experiencia
              </button>
              <a
                href="https://github.com/jorgeR1519?tab=repositories"
                className="button button--ghost"
                target="_blank"
                rel="noreferrer"
              >
                Ver GitHub
              </a>
              <a
                href="https://jorger1519.github.io/"
                className="button button--ghost"
                target="_blank"
                rel="noreferrer"
              >
                Ver blog HTB
              </a>
            </div>
          </div>

          <aside className="hero-window__panel">
            <div className="hero-window__stats">
              <span className="hero__badge">Sistema activo</span>
              <div className="stat-box">
                <strong>{projects.length || '08'}</strong>
                <span>Repos destacados</span>
              </div>
              <div className="stat-box">
                <strong>02</strong>
                <span>Certificaciones</span>
              </div>
              <div className="stat-box">
                <strong>B2</strong>
                <span>Ingles tecnico</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="desktop-shell">
        <nav className="window-nav" aria-label="Secciones del portafolio">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={
                activeTab === tab.id ? 'window-tab is-active' : 'window-tab'
              }
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="window-tab__label">{tab.label}</span>
              <span className="window-tab__hint">{tab.hint}</span>
            </button>
          ))}
        </nav>

        <div className="window-frame">
          <div className="window-frame__topbar">
            <div className="window-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="window-frame__title">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </div>
          </div>
          <div className="window-frame__content" key={activeTab}>
            {renderWindow()}
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
