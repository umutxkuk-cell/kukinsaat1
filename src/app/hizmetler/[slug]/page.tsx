import { notFound } from "next/navigation";
import HizmetDetayPage from "@/views/HizmetDetay";
import { services, getService } from "@/data/services";
import { metadataFor } from "@/lib/seo";

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return metadataFor(`/hizmetler/${slug}`);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return <HizmetDetayPage slug={slug} />;
}
