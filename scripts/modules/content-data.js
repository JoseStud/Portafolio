// Centralized content registry for the static portfolio.
// Keeping repeated labels, project metadata, and generated lists here lets the
// markup stay focused on page structure while render-content.js owns insertion.
export const panelIds = ['work', 'studio', 'archive', 'contact'];

// Main overlay navigation. `panel` must match both `panel-${id}` in index.html
// and the scroll progress IDs used by scroll-progress.js.
export const navItems = [
  {
    panel: 'work',
    number: '01',
    text: 'Work',
    category: 'Active systems',
  },
  {
    panel: 'studio',
    number: '02',
    text: 'Profile',
    category: 'Engineering practice',
  },
  {
    panel: 'archive',
    number: '03',
    text: 'Archive',
    category: 'GitHub repos',
  },
  {
    panel: 'contact',
    number: '04',
    text: 'Contact',
    category: 'GitHub',
  },
];

// Featured project cards rendered into the Work panel.
// Optional URLs turn cards into external GitHub links.
export const workProjects = [
  {
    number: '001',
    title: 'LoRA Manager',
    category: 'FastAPI + Vue + SDNext',
    url: 'https://github.com/JoseStud/LoraAPIBackend',
  },
  {
    number: '002',
    title: 'GoodOldMeServer',
    category: 'Terraform + Ansible + Swarm',
    url: 'https://github.com/JoseStud/GoodOldMeServer',
  },
  {
    number: '003',
    title: 'PIAR Digital App',
    category: 'TypeScript workflow app',
    url: 'https://github.com/JoseStud/piar-digital-app',
  },
  {
    number: '004',
    title: 'Mainpage',
    category: 'HTML portfolio system',
    url: 'https://github.com/JoseStud/mainpage',
  },
  {
    number: '005',
    title: 'Stacks',
    category: 'Docker stack templates',
    url: 'https://github.com/JoseStud/stacks',
  },
  {
    number: '006',
    title: 'docker-ente',
    category: 'Self-hosted deployment',
    url: 'https://github.com/JoseStud/docker-ente',
  },
];

// Capability list rendered into the Studio panel.
export const studioServices = [
  { name: 'AI Workflow Automation', number: '01' },
  { name: 'Full-Stack Applications', number: '02' },
  { name: 'API & Backend Systems', number: '03' },
  { name: 'Infrastructure as Code', number: '04' },
  { name: 'Dockerized Self-Hosting', number: '05' },
  { name: 'Developer Tooling', number: '06' },
];

// Lightweight archive metadata rendered as the public repository list.
export const archiveItems = [
  { number: '001', name: 'mainpage', category: 'HTML', year: '2026' },
  { number: '002', name: 'piar-digital-app', category: 'TypeScript', year: '2026' },
  { number: '003', name: 'GoodOldMeServer', category: 'Python / HCL / Shell', year: '2026' },
  { number: '004', name: 'home-stack', category: 'Infrastructure', year: '2026' },
  { number: '005', name: 'heavy-stack', category: 'Dockerfile', year: '2026' },
  { number: '006', name: 'stacks', category: 'Go Template', year: '2026' },
  { number: '007', name: 'LoraAPIBackend', category: 'TypeScript', year: '2025' },
  { number: '008', name: 'SebasColab', category: 'Prototype', year: '2025' },
  { number: '009', name: 'docker-ente', category: 'Self-hosted stack', year: '2025' },
];

// The marquee repeats terms so the CSS translate animation loops without a
// visible empty gap at typical desktop and mobile widths.
export const marqueeItems = [
  'Software Engineering',
  'AI Automation',
  'FastAPI',
  'Vue',
  'TypeScript',
  'Docker Swarm',
  'Terraform',
  'Ansible',
  'LoRA Tooling',
  'GitHub Actions',
  'Self-Hosting',
  'Workflow Systems',
  'Software Engineering',
  'AI Automation',
  'FastAPI',
  'Vue',
  'TypeScript',
  'Docker Swarm',
  'Terraform',
  'Ansible',
];
