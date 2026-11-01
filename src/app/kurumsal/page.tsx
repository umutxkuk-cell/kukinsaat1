import { metadataFor } from "@/lib/seo";
import KurumsalPage from "@/views/Kurumsal";


export const metadata = metadataFor("/kurumsal");

export default function Page() {
  return <KurumsalPage />;
}
