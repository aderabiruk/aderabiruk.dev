'use client';

import { motion } from 'framer-motion';
import { Experience } from '@/lib/types';
import ProjectCard from '@/components/ui/ProjectCard';

interface ProjectsProps {
  projects: Experience[];
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="section bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="section-title text-primary">
            <span className="terminal:hidden">Featured Projects</span>
            <span className="hidden terminal:inline">ls ./projects</span>
          </h2>
          <p className="section-subtitle">
            <span className="terminal:hidden">
              A selection of my most impactful work
            </span>
            <span className="hidden terminal:inline">
              # Notable projects and case studies
            </span>
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
