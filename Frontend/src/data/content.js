export const profile = {
  name: 'Mahalakshmi Sekar',
  shortName: 'Maha',
  role: 'Full Stack Developer',
  location: 'Chennai, Tamil Nadu',
  email: 'mahanushya3001@gmail.com',
  phone: '+91 84897 87847',
  linkedin: 'https://linkedin.com/in/mahalakshmi-sekar-8b1725313',
  github: 'https://github.com/MAHALAKSHMI-SEKAR',
  tagline: 'I build full-stack products that ship.',
  summary:
    "Full stack developer with 1+ year building web and mobile products end to end — React interfaces, Spring Boot APIs, MySQL data, and AI features wired in with the ChatGPT and Claude APIs. I like taking a feature from a blank file to something real people click on.",
}

export const stats = [
  { value: '1+', label: 'year shipping production code' },
  { value: '6', label: 'full-stack products built' },
  { value: '3', label: 'AI integrations shipped' },
  { value: '2', label: 'teams worked with' },
]

export const skills = [
  { name: 'React.js', group: 'Frontend' },
  { name: 'Bootstrap', group: 'Frontend' },
  { name: 'JavaScript', group: 'Language' },
  { name: 'HTML / CSS', group: 'Frontend' },
  { name: 'Java', group: 'Language' },
  { name: 'Spring Boot', group: 'Backend' },
  { name: 'REST APIs', group: 'Backend' },
  { name: 'JWT Auth', group: 'Backend' },
  { name: 'MySQL', group: 'Database' },
  { name: 'SQL', group: 'Database' },
  { name: 'Git & GitHub', group: 'Tools' },
  { name: 'Postman', group: 'Tools' },
  { name: 'ChatGPT API', group: 'AI' },
  { name: 'Claude API', group: 'AI' }
]

export const experience = [
  {
    id: 'ethics-tech',
    company: 'Ethics Tech',
    role: 'Full Stack Developer',
    period: 'Jul 2025 — Present',
    location: 'Chennai, Tamil Nadu',
    points: [
      'Developed a mobile application using React.js and Spring Boot.',
      'Built REST APIs and integrated MySQL for data storage and CRUD operations.',
      'Implemented JWT authentication with role-based access control.',
      'Developed real-time dashboards to monitor and visualize application data.',
      'Tested and debugged application features using Postman.',
    ],
  },
  {
    id: 'nathandynamix',
    company: 'NathanDynamix',
    role: 'Full Stack Developer',
    period: 'Jan 2025 — Jun 2025',
    location: 'Chennai, Tamil Nadu',
    points: [
      'Built an eCommerce platform and a design tool using React.js, Spring Boot and MySQL.',
      'Designed responsive UI components matching design specifications.',
      'Integrated Razorpay for online and cash-on-delivery transactions.',
      'Implemented JWT authentication for admin access control.',
      'Used Git and Postman for version control and API testing.',
    ],
  },
]

export const education = [
  {
    id: 'bca',
    school: 'AVC College, Mayiladuthurai',
    credential: 'Bachelor of Computer Application (BCA)',
    period: 'Aug 2021 — May 2024',
    detail: 'CGPA 8.4 / 10',
  },
  {
    id: 'hsc',
    school: 'Sri KGS Hr Sec School, Aduthurai',
    credential: 'Higher Secondary (XII)',
    period: 'Jun 2020 — Apr 2021',
    detail: '92.16%',
  },
]

export const certifications = [
  'Front End Development with React JS — Besant Technologies',
  'Back End Development with Spring Boot — Besant Technologies',
  'MySQL Database Management — Besant Technologies',
]

export const projects = [
  {
    id: 'dineflow',
    name: 'DineFlow',
    tag: 'AI-powered restaurant operations',
    color: '#FF3EA5',
    glow: 'rgba(255,62,165,0.35)',
    description:
      "A full-stack restaurant management system with separate Admin and Staff roles, secured end to end with JWT. DineFlow handles order management, inventory tracking and billing in one place, and layers ChatGPT and Claude on top so staff can ask plain-language questions and get sales summaries and inventory recommendations back.",
    highlights: [
      'Role-based Admin & Staff access secured with JWT',
      'REST APIs for orders, inventory, billing and payments',
      'ChatGPT + Claude integration for natural-language business insights',
      'Real-time dashboards for live restaurant operations',
    ],
    stack: ['React.js', 'Spring Boot', 'MySQL', 'JWT', 'ChatGPT API', 'Claude API'],
    basedOn: 'Smart Restaurant Order Management System',
  },
  {
    id: 'nathan-lights',
    name: 'Nathan Lights',
    tag: 'Full-stack eCommerce platform',
    color: '#22D3EE',
    glow: 'rgba(34,211,238,0.35)',
    description:
      "A lighting eCommerce storefront built at NathanDynamix, with a full admin dashboard for product CRUD, server-side pagination and API caching to keep browsing fast, and Razorpay wired in for both online payments and cash-on-delivery.",
    highlights: [
      'Admin dashboard with complete product CRUD management',
      'API caching + server-side pagination for faster data fetches',
      'Razorpay integration for online and cash-on-delivery orders',
      'Responsive storefront UI built to design spec',
    ],
    stack: ['React.js', 'Spring Boot', 'MySQL', 'Razorpay'],
    basedOn: 'Light eCommerce Website',
  },
  {
    id: 'learnloop',
    name: 'LearnLoop',
    tag: 'Online course platform',
    color: '#FFB800',
    glow: 'rgba(255,184,0,0.35)',
    description:
      'A responsive online learning platform where students can browse courses, leave reviews, and reach out through a validated contact form — built to feel simple on the surface with a solid Spring Boot backend underneath.',
    highlights: [
      'Responsive learning platform UI in React.js',
      'Student reviews module',
      'Contact form with client-side validation',
      'Spring Boot backend for course data',
    ],
    stack: ['React.js', 'Spring Boot', 'MySQL'],
    basedOn: 'Online Course Platform',
  },
]

export const services = [
  {
    id: 'frontend',
    title: 'Frontend builds',
    description: 'React interfaces that match the design spec pixel for pixel and hold up on every screen size.',
    icon: 'layout',
  },
  {
    id: 'backend',
    title: 'Backend & APIs',
    description: 'Spring Boot REST APIs, MySQL schemas, and JWT auth with clean role-based access control.',
    icon: 'server',
  },
  {
    id: 'ai',
    title: 'AI features',
    description: 'ChatGPT and Claude wired into real product flows — summaries, insights, natural-language search.',
    icon: 'spark',
  }
]

export const faqs = [
  {
    q: 'What kind of projects do you take on?',
    a: "Full-stack web and mobile products — a React frontend backed by a Spring Boot API and MySQL, plus AI features when a product needs them. I'm happiest owning a feature from schema to screen.",
  },
  {
    q: "What's your usual stack?",
    a: 'React.js on the frontend, Spring Boot and REST APIs on the backend, MySQL for data, JWT for auth, and Postman for testing everything along the way. I bring in ChatGPT, Claude or Razorpay when the product calls for it.',
  },
  {
    q: 'Do you work on both web and mobile?',
    a: "Yes — I've shipped a React.js + Spring Boot mobile application at Ethics Tech alongside web platforms, so I can carry one product across both.",
  },
  {
    q: "Are you open to new roles or freelance work?",
    a: "Yes, I'm open to full-time roles, freelance builds and collaborations. Chennai-based, comfortable working remotely too — reach out and let's talk about what you're building.",
  },
]
