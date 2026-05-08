# aderabiruk.dev - Personal Portfolio

A production-ready personal portfolio website built with Next.js 14, featuring an AI-powered chatbot, interactive career timeline, freelance track record, and smart contact form.

## Features

- **AI "About Me" Chatbot**: Ask questions about experience, skills, and projects. Uses RAG (Retrieval-Augmented Generation) to ground responses in site content.
- **Featured Projects**: Case studies for key professional engagements with expandable detail.
- **Freelance Track Record**: Upwork stats, badges, and curated client testimonials.
- **Career Timeline**: Interactive vertical timeline with filtering by type and tags. Supports multiple types per milestone.
- **Smart Contact Form**: Dynamic form fields based on contact category (Hiring, Collaboration, Speaking, etc.)
- **Theme Switcher**: Dark (default), Light, and Terminal themes with localStorage persistence.
- **Responsive Design**: Mobile-first approach with smooth animations via Framer Motion.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aderabiruk/aderabiruk.dev.git
   cd aderabiruk.dev
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local` with your values (see Environment Variables section below).

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | API key for sending contact form emails via Resend |
| `CONTACT_TO_EMAIL` | Email address to receive contact form submissions |
| `CALENDAR_BOOKING_URL` | URL to your calendar booking page (shown for Hiring/Collaboration) |
| `NEXT_PUBLIC_CALENDAR_BOOKING_URL` | Same as above, but accessible client-side |
| `OPENAI_API_KEY` | Enables AI-powered chat responses (uses gpt-4o-mini) |

## Content Structure

All content is stored as JSON in the `/content` directory:

```
content/
├── profile.json        # Identity, bio, tech stack, social links, Upwork stats
├── experience.json     # Professional roles (featured ones = project cards)
├── timeline.json       # Career journey milestones with multi-type support
├── testimonials.json   # Curated client reviews from Upwork
├── skills.json         # Categorized skill taxonomy
├── credentials.json    # Education, certifications, languages
└── faq.json            # Q&A pairs for RAG chatbot
```

### Editing Content

1. **Profile** (`profile.json`): Personal info, bio, tech stack, availability, and Upwork aggregate stats.

2. **Experience** (`experience.json`): Professional roles. Entries with `featured: true` appear as project cards on the homepage. Featured entries support additional fields: `overview`, `impact[]`, and `live` URL.

3. **Timeline** (`timeline.json`): Career milestones. Each milestone has:
   - `id`: Unique identifier (used for anchors)
   - `date`: YYYY or YYYY-MM format
   - `title`, `summary`, `bullets`: Content
   - `type`: String or array — `backend`, `fullstack`, `leadership`, `mobile`, or `education`
   - `tags`: Array of tags for filtering
   - `links`: Optional external links

4. **Testimonials** (`testimonials.json`): Client reviews with author, quote, rating, and featured flag.

5. **Skills** (`skills.json`): Categorized skill list (Languages, Backend, Frontend, Cloud, DevOps, etc.)

6. **FAQ** (`faq.json`): Question/answer pairs organized by category. Used by the RAG chatbot.

## Themes

The site supports three themes:

1. **Dark** (default): Easy on the eyes dark theme
2. **Light**: Clean, professional light theme
3. **Terminal**: Retro terminal aesthetic with monospace fonts and green text

The theme is persisted in localStorage.

## AI Chatbot

The chatbot uses a RAG-lite approach:

1. **Content Indexing**: All JSON content files are split into chunks
2. **Retrieval**: User queries are matched against chunks using keyword scoring
3. **Response Generation**:
   - With OpenAI: Chunks are sent as context to GPT-4o-mini with strict grounding instructions
   - Without OpenAI: Best-matching chunks are returned directly

The chatbot is designed to **never hallucinate**. If information isn't in the content, it says "I don't have that detail on the site yet."

## Contact Form

The smart contact form adapts fields based on the selected category:

| Category | Additional Fields |
|----------|------------------|
| Hiring/Contract | Company, Role, Budget, Timeline, Tech Stack |
| Collaboration | Project Type, Timeline, What You Need |
| Speaking/Interview | Event, Date, Topic |
| General | Topic |
| Website Feedback | Page, Issue |

## Deployment

The site can be deployed to any platform that supports Next.js:

- **Vercel** (recommended): Zero-config deployment
- **Netlify**: Use Next.js adapter
- **Docker**: Build and deploy container
- **Self-hosted**: Run with Node.js

## License

MIT License - feel free to use this as a template for your own portfolio!
