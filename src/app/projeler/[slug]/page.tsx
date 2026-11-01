import { notFound } from "next/navigation";
import ProjeDetayPage from "@/views/ProjeDetay";
import { projects, getProject } from "@/data/projects";
import { metadataFor } from "@/lib/seo";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return metadataFor(`/projeler/${slug}`);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return <ProjeDetayPage slug={slug} />;
}
