import type { Project } from '@/components/ProjectCard'

export const PROJECTS: Project[] = [
  {
    id: 'TCK-014 · MULTI-TENANT',
    title: 'iDesk — Inspirit Ticketing System',
    description:
      'The internal helpdesk platform Inspirit runs support on. Routes tickets across product buckets, manages admin roles, logs time, and generates client quotes — live at idesk.online.',
    caseNote:
      'Rebuilt tenant routing from subdomain- to path-based across 9 files; traced a tenant-isolation bug to one interceptor that had never been saved to disk.',
    tags: ['Angular', 'Node/Express', 'MSSQL', 'Nginx'],
    filterTags: ['angular', 'node', 'mssql', 'nginx', 'multitenant'],
    screenshots: [
      { src: '/screenshots/idesk-tickets.jpg', alt: 'iDesk ticket queue' },
      { src: '/screenshots/idesk-tenants.jpg', alt: 'iDesk tenant routing management' },
      { src: '/screenshots/idesk-timelog.jpg', alt: 'iDesk time log' },
    ],
  },
  {
    id: 'TCK-027 · AUTOMATION',
    title: 'Streamline — Approval Automation',
    description:
      'An internal workflow automation platform for SMEs. Handles purchase order approvals, travel expenses, and vendor invoices through configurable multi-stage workflows with auto-escalation, audit trails, and live analytics.',
    caseNote:
      'Built a closed feedback loop: fit-score analytics gate what the automation is allowed to trigger, and automation output feeds straight back into the analytics layer.',
    tags: ['Angular', 'Node/Express', 'RxJS', 'Workflow automation'],
    filterTags: ['angular', 'node'],
    screenshots: [
      { src: '/screenshots/streamline-dashboard.jpg', alt: 'Streamline approval dashboard' },
      { src: '/screenshots/streamline-workflow.jpg', alt: 'Streamline workflow builder' },
      { src: '/screenshots/streamline-analytics.jpg', alt: 'Streamline analytics view' },
    ],
  },
  {
    id: 'TCK-033 · E-COMMERCE',
    title: 'Liquor Barn — On-Demand Delivery',
    description:
      'A full on-demand liquor delivery platform for Liquor Barn. Browse by category, add to cart, checkout with card or cash-on-delivery, and track your order live from preparation to your door.',
    tags: ['Angular', 'Node/Express', 'UX design', 'E-commerce'],
    filterTags: ['angular', 'node'],
    screenshots: [
      { src: '/screenshots/liquor-home.jpg', alt: 'Liquor Barn storefront' },
      { src: '/screenshots/liquor-checkout.jpg', alt: 'Liquor Barn checkout' },
      { src: '/screenshots/liquor-tracking.jpg', alt: 'Liquor Barn order tracking' },
    ],
  },
  {
    id: 'TCK-041 · FULL-STACK',
    title: 'Job Apply Autofill — Job Search Automation',
    description:
      'A self-hosted job-search automation platform that eliminates the most repetitive parts of job hunting. A Manifest V3 Chrome extension auto-populates application forms from a single structured profile, while the backend polls public Greenhouse and Lever APIs for new postings at watched companies and an IMAP email classifier automatically updates application statuses from recruiter emails.',
    caseNote:
      'Automation and analytics form a closed feedback loop: a 0–100 fit-score gates what the automation can do, and every automated action feeds straight back into the live funnel analytics.',
    tags: ['Node/Express', 'Chrome Extension', 'RxJS', 'IMAP', 'Analytics'],
    filterTags: ['node', 'automation'],
    screenshots: [
      { src: '/screenshots/ja-login.jpg', alt: 'Job Apply Autofill login screen' },
      { src: '/screenshots/ja-applications.jpg', alt: 'Live application tracker' },
      { src: '/screenshots/ja-analytics.jpg', alt: 'Application funnel analytics' },
      { src: '/screenshots/ja-jobsearch.jpg', alt: 'Fit-scoring and job discovery' },
      { src: '/screenshots/ja-profile.jpg', alt: 'Candidate profile and form-fill settings' },
    ],
  },
]
