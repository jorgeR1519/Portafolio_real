import { useEffect, useRef, useState } from 'react'
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

const portfolioProjects: Project[] = [
  {
    id: 1,
    title: 'Chat_box_WPP',
    description:
      'Chatbot de WhatsApp para agendamiento de citas con Flask, Selenium, API REST y envio de correos.',
    stack: ['Python', 'Flask', 'Selenium', 'SMTP'],
    github: 'https://github.com/jorgeR1519/Chat_box_WPP',
    demo: '',
    language: 'Python',
    updated_at: '2026-03-10',
    image:
      'https://opengraph.githubassets.com/portfolio-preview/jorgeR1519/Chat_box_WPP',
  },
  {
    id: 2,
    title: 'prueba_tecnica',
    description:
      'Aplicacion full stack con FastAPI, Vue.js, autenticacion JWT e integracion de chat con Ollama.',
    stack: ['FastAPI', 'Vue', 'JWT', 'Ollama'],
    github: 'https://github.com/jorgeR1519/prueba_tecnica',
    demo: '',
    language: 'Vue',
    updated_at: '2026-03-08',
    image:
      'https://opengraph.githubassets.com/portfolio-preview/jorgeR1519/prueba_tecnica',
  },
  {
    id: 3,
    title: 'Proyecto_Agendacion_citas',
    description:
      'Sistema de agendacion para clinica dental con FastAPI, chat con IA, exportacion Excel y reportes PDF.',
    stack: ['FastAPI', 'Ollama', 'Pandas', 'ReportLab'],
    github: 'https://github.com/jorgeR1519/Proyecto_Agendacion_citas',
    demo: '',
    language: 'Python',
    updated_at: '2026-03-07',
    image:
      'https://opengraph.githubassets.com/portfolio-preview/jorgeR1519/Proyecto_Agendacion_citas',
  },
  {
    id: 4,
    title: 'Script_Machines_HTB',
    description:
      'Coleccion de scripts para Hack The Box orientados a enumeracion, explotacion y automatizacion en pentesting.',
    stack: ['Python', 'Security', 'HTB'],
    github: 'https://github.com/jorgeR1519/Script_Machines_HTB',
    demo: '',
    language: 'Python',
    updated_at: '2026-02-24',
    image:
      'https://opengraph.githubassets.com/portfolio-preview/jorgeR1519/Script_Machines_HTB',
  },
  {
    id: 5,
    title: 'hacking_labs',
    description:
      'Repositorio de laboratorios practicos con escenarios reproducibles para aprender vectores de ataque de forma controlada y etica.',
    stack: ['Security', 'Docker', 'Labs'],
    github: 'https://github.com/jorgeR1519/hacking_labs',
    demo: '',
    language: 'Python',
    updated_at: '2026-02-02',
    image:
      'https://opengraph.githubassets.com/portfolio-preview/jorgeR1519/hacking_labs',
  },
  {
    id: 6,
    title: 'API_Rest_Node',
    description:
      'API RESTful con Node.js, TypeScript, JWT y arquitectura limpia para autenticacion y operaciones CRUD.',
    stack: ['TypeScript', 'Node.js', 'JWT'],
    github: 'https://github.com/jorgeR1519/API_Rest_Node',
    demo: '',
    language: 'TypeScript',
    updated_at: '2025-06-19',
    image:
      'https://opengraph.githubassets.com/portfolio-preview/jorgeR1519/API_Rest_Node',
  },
  {
    id: 7,
    title: 'Aplicativo-Gestion-Inventario',
    description:
      'Aplicacion web en Laravel para la gestion integral de un restaurante, incluyendo menus, pedidos, mesas y facturacion.',
    stack: ['Laravel', 'MySQL', 'Bootstrap', 'Tailwind'],
    github: 'https://github.com/jorgeR1519/Aplicativo-Gestion-Inventario',
    demo: '',
    language: 'CSS',
    updated_at: '2025-05-26',
    image:
      'https://opengraph.githubassets.com/portfolio-preview/jorgeR1519/Aplicativo-Gestion-Inventario',
  },
  {
    id: 8,
    title: 'Proyecto-Termacool',
    description:
      'Sistema web en Laravel para gestionar compras, solicitudes, aprobaciones y ordenes con control de acceso por roles.',
    stack: ['Laravel', 'MySQL', 'Security'],
    github: 'https://github.com/jorgeR1519/Proyecto-Termacool',
    demo: '',
    language: 'PHP',
    updated_at: '2025-05-26',
    image:
      'https://opengraph.githubassets.com/portfolio-preview/jorgeR1519/Proyecto-Termacool',
  },
]

const experience = [
  {
    company: 'EXXTRA S.A.S.',
    role: 'Desarrollador Full Stack',
    period: 'Marzo 2026 - Actualidad',
    summary:
      'Migracion de backend desde Node.js a FastAPI, estructurando APIs REST por modulos. Integracion con MongoDB y manejo de logica de negocio para creditos, clientes y pagos. Implementacion de autenticacion con JWT, control de roles, integracion con Payzen y sistemas externos, ademas de desarrollo frontend con Vue.js para consumo de APIs y gestion operativa.',
  },
  {
    company: 'PRONTO S.A.S.',
    role: 'Desarrollador Full Stack',
    period: 'Marzo 2026 - Actualidad',
    summary:
      'Desarrollo de sistema de cotizacion de seguros con integracion de bots RPA. Implementacion de backend en FastAPI con autenticacion, roles y logica de estados. Integracion de procesos RPA como Fasecolda y Tarificador con trazabilidad rpaRuns, frontend en Vue.js, generacion de PDFs versionados, envio automatizado, pruebas, estabilizacion y despliegue productivo.',
  },
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

const sectionIcons: Record<string, string> = {
  about: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
  experience:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  education:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
  skills:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  projects:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  certifications:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
  contact:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
  location:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firefox/firefox-original.svg',
  email:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
  phone:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
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
  const matrixRef = useRef<HTMLCanvasElement | null>(null)
  const [projects] = useState<Project[]>(portfolioProjects)
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
    const canvas = matrixRef.current
    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    let animationFrame = 0
    let drops: number[] = []
    const fontSize = 16
    const letters = '01'

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const columns = Math.floor(canvas.width / fontSize)
      drops = Array(columns).fill(1)
    }

    const draw = () => {
      const isDay = document.documentElement.dataset.theme === 'day'
      context.fillStyle = isDay
        ? 'rgba(248, 255, 252, 0.08)'
        : 'rgba(0, 0, 0, 0.08)'
      context.fillRect(0, 0, canvas.width, canvas.height)
      context.fillStyle = isDay ? 'rgba(17, 111, 86, 0.85)' : 'rgba(255, 255, 255, 0.82)'
      context.font = `${fontSize}px "Share Tech Mono"`

      for (let index = 0; index < drops.length; index += 1) {
        const text = letters[Math.floor(Math.random() * letters.length)]
        context.fillText(text, index * fontSize, drops[index] * fontSize)

        if (drops[index] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[index] = 0
        }

        drops[index] += 1
      }

      animationFrame = window.requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
    }
  }, [theme])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSending(true)
    setFormMessage('')

    try {
      const subject = encodeURIComponent(
        `Contacto desde portafolio - ${form.name}`,
      )
      const body = encodeURIComponent(
        `Nombre: ${form.name}\nCorreo: ${form.email}\n\nMensaje:\n${form.message}`,
      )
      window.location.href = `mailto:jorgeleviakerman@gmail.com?subject=${subject}&body=${body}`
      setForm(initialForm)
      setFormMessage('Se abrio tu cliente de correo para enviar el mensaje.')
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
            <p className="terminal-prompt">jorge@portfolio:~$ perfil profesional cargado</p>
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
                <p className="inline-icon-row">
                  <img
                    className="section-icon"
                    src={sectionIcons.location}
                    alt="Icono de ubicacion"
                  />
                  <span>Santiago de Cali, Colombia</span>
                </p>
                <p className="inline-icon-row">
                  <img
                    className="section-icon"
                    src={sectionIcons.email}
                    alt="Icono de correo"
                  />
                  <span>jorgeleviakerman@gmail.com</span>
                </p>
                <p className="inline-icon-row">
                  <img
                    className="section-icon"
                    src={sectionIcons.phone}
                    alt="Icono de telefono"
                  />
                  <span>+57 3226536242</span>
                </p>
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
            <p className="terminal-prompt">jorge@portfolio:~$ cat experiencia.log</p>
          </div>
          <div className="timeline-grid">
            {experience.map((item) => (
              <article className="info-card" key={item.company}>
                <img
                  className="card-icon"
                  src={sectionIcons.experience}
                  alt="Icono de experiencia"
                />
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
            <p className="terminal-prompt">jorge@portfolio:~$ ls educacion/</p>
          </div>
          <div className="timeline-grid">
            {education.map((item) => (
              <article className="info-card" key={item.title}>
                <img
                  className="card-icon"
                  src={sectionIcons.education}
                  alt="Icono de educacion"
                />
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
            <p className="terminal-prompt">jorge@portfolio:~$ scan --skills --security</p>
          </div>
          <div className="skills-grid">
            {skillGroups.map((group) => (
              <article className="info-card" key={group.title}>
                <img
                  className="card-icon"
                  src={sectionIcons.skills}
                  alt="Icono de skill"
                />
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
                <img
                  className="card-icon"
                  src={sectionIcons.education}
                  alt="Icono de idioma"
                />
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
            <h2>Proyectos realizados</h2>
            <p className="terminal-prompt">jorge@portfolio:~$ ls proyectos-realizados</p>
          </div>
          <>
            <p className="section__text">
              Seleccion de proyectos desarrollados en backend, frontend,
              automatizacion, integracion de IA y ciberseguridad.
            </p>
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
        </section>
      )
    }

    if (activeTab === 'certifications') {
      return (
        <section className="window-pane">
          <div className="window-pane__header">
            <p className="eyebrow">Certificaciones</p>
            <h2>Credenciales y validacion tecnica</h2>
            <p className="terminal-prompt">jorge@portfolio:~$ verify --certs</p>
          </div>
          <div className="certifications-grid">
            {certifications.map((certification) => (
              <article className="cert-card" key={certification.id}>
                <img
                  className="card-icon"
                  src={sectionIcons.certifications}
                  alt="Icono de certificacion"
                />
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
          <p className="terminal-prompt">jorge@portfolio:~$ open secure_channel</p>
        </div>
        <div className="contact-summary">
          <div className="info-card">
            <img
              className="card-icon"
              src={sectionIcons.contact}
              alt="Icono de contacto"
            />
            <p className="project-card__index">Contacto directo</p>
            <h3>Datos visibles</h3>
            <p className="inline-icon-row">
              <img
                className="section-icon"
                src={sectionIcons.email}
                alt="Icono de correo"
              />
              <span>jorgeleviakerman@gmail.com</span>
            </p>
            <p className="inline-icon-row">
              <img
                className="section-icon"
                src={sectionIcons.phone}
                alt="Icono de telefono"
              />
              <span>+57 3226536242</span>
            </p>
            <p className="inline-icon-row">
              <img
                className="section-icon"
                src={sectionIcons.location}
                alt="Icono de ubicacion"
              />
              <span>Santiago de Cali, Colombia</span>
            </p>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <p className="section__text">
            En esta version desplegada en Vercel, el formulario abre tu cliente
            de correo en lugar de enviar datos a una API.
          </p>
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
      <canvas ref={matrixRef} className="matrix-canvas" aria-hidden="true" />
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
            <p className="terminal-prompt">jorge@portfolio:~$ init --full-stack --security</p>
            <p className="hero__text">
              Desarrollo aplicaciones, automatizaciones, integraciones con IA y
              soluciones seguras con enfoque full stack.
            </p>
            <div className="hero__microdata">
              <span>
                <img
                  className="section-icon"
                  src={sectionIcons.location}
                  alt="Icono de ubicacion"
                />
                <span>Santiago de Cali, Colombia</span>
              </span>
              <span>
                <img
                  className="section-icon"
                  src={sectionIcons.email}
                  alt="Icono de correo"
                />
                <span>jorgeleviakerman@gmail.com</span>
              </span>
              <span>
                <img
                  className="section-icon"
                  src={sectionIcons.phone}
                  alt="Icono de telefono"
                />
                <span>+57 3226536242</span>
              </span>
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
                <img
                  className="card-icon card-icon--small"
                  src={sectionIcons.projects}
                  alt="Icono de proyectos"
                />
                <strong>{projects.length || '08'}</strong>
                <span>Repos destacados</span>
              </div>
              <div className="stat-box">
                <img
                  className="card-icon card-icon--small"
                  src={sectionIcons.certifications}
                  alt="Icono de certificaciones"
                />
                <strong>02</strong>
                <span>Certificaciones</span>
              </div>
              <div className="stat-box">
                <img
                  className="card-icon card-icon--small"
                  src={sectionIcons.education}
                  alt="Icono de idiomas"
                />
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
              <img
                className="nav-icon"
                src={sectionIcons[tab.id]}
                alt={`Icono de ${tab.label}`}
              />
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
