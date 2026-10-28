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
  | 'bounty'
  | 'certifications'
  | 'contact'
type ThemeMode = 'night' | 'day'

const initialForm: ContactForm = {
  name: '',
  email: '',
  message: '',
}

const linkedInUrl =
  'https://www.linkedin.com/in/jorge-enrique-renteria-mosquera-a18576247/'
const bountyRepository = 'https://github.com/jorgeR1519/Bug_bounty'

const bountyReports = [
  {
    title: 'bpost · Divulgación de información',
    platform: 'Intigriti',
    status: 'Aceptado',
    severity: 'Alta · CVSS 7.5',
    description:
      'Mi primer hallazgo aceptado: una validación incorrecta de entradas en el seguimiento de paquetes permitía divulgar información de los envíos. El equipo de seguridad de bpost validó y aceptó el reporte tras el proceso de triaje.',
    detail: 'Reportado el 28 de mayo de 2026 · Aceptado el 9 de julio de 2026',
    path: 'bpost-track-items-information-disclosure',
    featured: true,
  },
  {
    title: 'Netafim GrowSphere · Autorización de perfiles',
    platform: 'Netafim · Sin recompensa',
    status: 'Duplicado',
    severity: 'Media · 6.5',
    description:
      'Identifiqué un fallo de autorización a nivel de objeto (BOLA / IDOR) que permitía modificar el perfil de otra cuenta cambiando el identificador del usuario sin alterar la sesión autenticada. Validé el comportamiento con dos cuentas bajo mi control.',
    detail: 'Reportado el 12 de octubre de 2026 · Duplicado el 15 de octubre de 2026',
    path: 'netafim-growsphere-profile-update-idor',
    featured: false,
  },
  {
    title: 'Netafim GrowSphere · Gestión de usuarios de finca',
    platform: 'Netafim · Sin recompensa',
    status: 'Duplicado',
    severity: 'Media · 6.5',
    description:
      'Desde la gestión de usuarios de finca, documenté modificaciones de nombre, apellido y teléfono de otra cuenta mediante la API de usuarios. Los intentos de cambiar rol y correo no tuvieron éxito; no se demostró escalada de privilegios.',
    detail: 'Duplicado el 12 de octubre de 2026 · Reporte separado sobre la misma API de perfiles',
    path: 'netafim-growsphere-farm-users-access-control',
    featured: false,
  },
  {
    title: 'U.S. Treasury VDP · Inicio de sesión VPN',
    platform: 'Bugcrowd',
    status: 'Informativo',
    severity: 'Informativo · P5',
    description:
      'Evaluación de controles frente a intentos repetidos de autenticación en un portal VPN. Documenté la ausencia de limitación de intentos observable y propuse controles de protección para el flujo de acceso.',
    detail: 'Controles de acceso · Rate limiting · Reporte técnico',
    path: 'treasury-vdp-vpn-login-rate-limit-p5',
    featured: false,
  },
  {
    title: 'U.S. Treasury VDP · Recuperación de contraseña',
    platform: 'Bugcrowd',
    status: 'Revisado y reproducido',
    severity: 'Informativo · P5',
    description:
      'Análisis de la ausencia de controles observables de rate limiting en un flujo de recuperación de contraseña. Reporte revisado y reproducido durante el triaje, clasificado como informativo.',
    detail: 'Seguridad de autenticación · Análisis de solicitudes HTTP',
    path: 'treasury-vdp-rate-limit-p5',
    featured: false,
  },
]

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
    title: 'hacking_labs',
    description:
      'Colección de laboratorios reproducibles para estudiar vulnerabilidades y vectores de ataque en entornos controlados. Incluye escenarios con Docker para practicar y comprender fallos de seguridad de forma ética.',
    stack: ['Python', 'Docker', 'Security', 'Labs'],
    github: 'https://github.com/jorgeR1519/hacking_labs',
    language: 'Python',
    updated_at: '2026-10-27',
    image:
      'https://opengraph.githubassets.com/portfolio-preview/jorgeR1519/hacking_labs',
  },
  {
    id: 2,
    title: 'Cyber_Quest',
    description:
      'Proyecto académico en Python y Tkinter con cuatro misiones de seguridad digital. Separa lógica, contenido e interfaz, con gráficos en Canvas, puntuación, progreso en memoria y pruebas automatizadas de las reglas del juego.',
    stack: ['Python', 'Tkinter', 'Canvas', 'unittest'],
    github: 'https://github.com/jorgeR1519/Cyber_Quest',
    language: 'Python',
    updated_at: '2026-10-27',
    image:
      'https://opengraph.githubassets.com/portfolio-preview/jorgeR1519/Cyber_Quest',
  },
  {
    id: 3,
    title: 'barbershop-ia-whatsapp',
    description:
      'Automatización de citas para barberías con n8n, Evolution API y MySQL. Integra IA para interpretar mensajes de texto y voz, consultar disponibilidad y gestionar reservas, cambios y cancelaciones.',
    stack: ['n8n', 'Evolution API', 'MySQL', 'OpenAI', 'Whisper'],
    github: 'https://github.com/jorgeR1519/barbershop-ia-whatsapp',
    updated_at: '2026-07-05',
    image:
      'https://opengraph.githubassets.com/portfolio-preview/jorgeR1519/barbershop-ia-whatsapp',
  },
  {
    id: 4,
    title: 'API_Rest_Node',
    description:
      'API con Node.js, Express y TypeScript para gestionar clientes y productos mediante operaciones CRUD. Persistencia en MongoDB con Mongoose, organización por módulos, respuestas JSON y endpoint de verificación de estado.',
    stack: ['TypeScript', 'Node.js', 'Express', 'MongoDB'],
    github: 'https://github.com/jorgeR1519/API_Rest_Node',
    language: 'TypeScript',
    updated_at: '2026-04-25',
    image:
      'https://opengraph.githubassets.com/portfolio-preview/jorgeR1519/API_Rest_Node',
  },
  {
    id: 5,
    title: 'Chat_box_WPP',
    description:
      'Chatbot de WhatsApp Web con Python, Flask y Selenium para agendar citas, registrar usuarios y validar disponibilidad. Expone una API REST y envía confirmaciones por correo electrónico mediante SMTP.',
    stack: ['Python', 'Flask', 'Selenium', 'SMTP'],
    github: 'https://github.com/jorgeR1519/Chat_box_WPP',
    language: 'Python',
    updated_at: '2026-03-10',
    image:
      'https://opengraph.githubassets.com/portfolio-preview/jorgeR1519/Chat_box_WPP',
  },
  {
    id: 6,
    title: 'Script_Machines_HTB',
    description:
      'Scripts desarrollados al resolver máquinas y retos de Hack The Box. Automatizan tareas de enumeración, análisis de respuestas HTTP y validación de vulnerabilidades, con comentarios para su estudio en laboratorios autorizados.',
    stack: ['Python', 'Security', 'HTB'],
    github: 'https://github.com/jorgeR1519/Script_Machines_HTB',
    language: 'Python',
    updated_at: '2026-02-24',
    image:
      'https://opengraph.githubassets.com/portfolio-preview/jorgeR1519/Script_Machines_HTB',
  },
  {
    id: 7,
    title: 'Aplicativo-Gestion-Inventario',
    description:
      'Aplicación web para administrar menús, mesas, pedidos y facturación. Desarrollada con Laravel y MySQL, con roles y permisos para los distintos perfiles del restaurante, reportes y notificaciones internas.',
    stack: ['Laravel', 'MySQL', 'Bootstrap', 'Tailwind'],
    github: 'https://github.com/jorgeR1519/Aplicativo-Gestion-Inventario',
    language: 'PHP',
    updated_at: '2025-05-26',
    image:
      'https://opengraph.githubassets.com/portfolio-preview/jorgeR1519/Aplicativo-Gestion-Inventario',
  },
]

const experience = [
  {
    company: 'PRONTO S.A.S.',
    role: 'Desarrollador Full Stack',
    period: 'Marzo 2026 - Mayo 2026',
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
    title: 'Ingeniería en Sistemas',
    place: 'Universidad Jose Antonio Camacho',
    period: '2026 - Actualidad · En curso',
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
  bounty:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
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
  { id: 'bounty', label: 'Bug Bounty', hint: 'bpost y divulgación responsable' },
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

    const paint = () => {
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

        if (drops[index] * fontSize > canvas.height) {
          drops[index] = 0
        }

        drops[index] += 1
      }

    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const columns = Math.ceil(canvas.width / fontSize)
      const rows = Math.ceil(canvas.height / fontSize)
      // Stagger streams across the viewport instead of starting a single wave.
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * rows))
      // Populate the trails immediately, including after resizing the viewport.
      for (let frame = 0; frame < 40; frame += 1) {
        paint()
      }
    }

    const draw = () => {
      paint()
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
                Tecnólogo en Análisis y Desarrollo de Software y estudiante de
                Ingeniería en Sistemas. Desarrollo aplicaciones full stack,
                automatizaciones e integraciones con IA con Laravel, FastAPI,
                Python y React. Tengo experiencia en APIs REST, autenticación,
                gestión de roles y soluciones que mejoran procesos de negocio.
              </p>
              <p className="section__text">
                Busco oportunidades como desarrollador para aportar en la
                construcción de aplicaciones, automatización y entrega de
                soluciones funcionales. Como actividad complementaria, participo
                en bug bounty y cuento con las certificaciones eJPTv2 e ISO/IEC
                27001 Foundation: conocimientos que aplico al desarrollo seguro.
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
                  Publico writeups y análisis técnicos de máquinas y
                  laboratorios para compartir mi aprendizaje en seguridad ofensiva.
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
                  <a href={linkedInUrl} target="_blank" rel="noreferrer" className="button button--ghost">
                    LinkedIn
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
            <h2>Proyectos de desarrollo destacados</h2>
            <p className="terminal-prompt">jorge@portfolio:~$ ls proyectos-realizados</p>
          </div>
          <>
            <p className="section__text">
              Aplicaciones web, APIs, automatizaciones y un videojuego educativo
              en Python, junto con laboratorios y scripts que complementan mi
              experiencia de desarrollo con conocimientos de seguridad.
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

    if (activeTab === 'bounty') {
      return (
        <section className="window-pane" aria-labelledby="bounty-title">
          <div className="window-pane__header">
            <p className="eyebrow">Actividad complementaria · Bug Bounty</p>
            <h2 id="bounty-title">Hallazgos con impacto real</h2>
            <p className="terminal-prompt">jorge@portfolio:~$ cat responsible-disclosure.log</p>
            <p className="section__text">
              Complemento mi trabajo como desarrollador con investigación de
              seguridad en aplicaciones web y APIs. Esta práctica me ayuda a
              mejorar la validación de entradas, la autenticación y los controles
              de acceso de las soluciones que construyo.
            </p>
          </div>
          <div className="bounty-summary" aria-label="Resultados de bug bounty">
            <div className="stat-box"><strong>01</strong><span>Hallazgo aceptado · bpost</span></div>
            <div className="stat-box"><strong>7.5</strong><span>CVSS · Severidad alta</span></div>
            <div className="stat-box"><strong>{String(bountyReports.filter((report) => report.status === 'Duplicado').length).padStart(2, '0')}</strong><span>Reportes duplicados · Netafim</span></div>
          </div>
          <div className="bounty-reports">
            {bountyReports.map((report) => (
              <article className={`project-card${report.featured ? ' bounty-card--featured' : ''}`} key={report.path}>
                <div className="bounty-card__labels">
                  <span className="bounty-status">{report.status}</span>
                  <span>{report.severity}</span>
                </div>
                <p className="project-card__index">{report.platform}</p>
                <h3>{report.title}</h3>
                <p>{report.description}</p>
                <p className="bounty-card__detail">{report.detail}</p>
                <div className="project-card__links">
                  <a href={`${bountyRepository}/tree/main/${report.path}`} target="_blank" rel="noreferrer">
                    Leer reporte público<span className="sr-only">: {report.title}</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
          <div className="blog-card bounty-methodology">
            <h3>Metodología y divulgación responsable</h3>
            <p>
              Utilizo Burp Suite, análisis de solicitudes HTTP y pruebas manuales
              para validar el comportamiento observado y documentar su impacto.
              Los reportes públicos omiten datos sensibles y evidencias privadas.
              Los duplicados se presentan con su estado y clasificación propios.
              Los dos reportes de Netafim corresponden a flujos distintos sobre
              la misma API de perfiles; se cuentan como dos reportes, sin afirmar
              que sean dos causas raíz independientes.
            </p>
            <ul className="stack-list">
              <li>Burp Suite</li><li>OWASP Top 10</li><li>Web &amp; API Security</li><li>Reportes técnicos</li>
            </ul>
            <div className="project-card__links">
              <a href={bountyRepository} target="_blank" rel="noreferrer">Explorar repositorio de Bug Bounty</a>
            </div>
          </div>
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
            <p><a href={linkedInUrl} target="_blank" rel="noreferrer">Contactar por LinkedIn</a></p>
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
              Desarrollo aplicaciones web, APIs REST, automatizaciones e
              integraciones con IA. Tecnólogo en Desarrollo de Software y
              estudiante de Ingeniería en Sistemas, en búsqueda de oportunidades
              como desarrollador.
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
              <button type="button" className="button button--ghost" onClick={() => setActiveTab('bounty')}>
                Logros en Bug Bounty
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
              <a href={linkedInUrl} className="button button--ghost" target="_blank" rel="noreferrer">
                LinkedIn
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
                <strong>{String(projects.length).padStart(2, '0')}</strong>
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
              aria-current={activeTab === tab.id ? 'page' : undefined}
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
