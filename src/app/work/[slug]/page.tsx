import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateMetadata as genMeta } from '@/lib/seo';
import { projectDetails } from '@/lib/data';
import ProjectDetailPage from './ProjectDetailPage';

// Generate static paths for all projects
export function generateStaticParams() {
  return projectDetails.map((p) => ({ slug: p.slug }));
}

// Dynamic metadata per project
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectDetails.find((p) => p.slug === slug);

  if (!project) {
    return genMeta({ title: 'Project Not Found', pathname: `/work/${slug}` });
  }

  return genMeta({
    title: project.title,
    description: project.overview,
    pathname: `/work/${slug}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projectDetails.findIndex((p) => p.slug === slug);

  if (index === -1) {
    notFound();
  }

  const project = projectDetails[index];
  const prevProject = index > 0 ? projectDetails[index - 1] : projectDetails[projectDetails.length - 1];
  const nextProject = index < projectDetails.length - 1 ? projectDetails[index + 1] : projectDetails[0];

  return (
    <ProjectDetailPage
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
