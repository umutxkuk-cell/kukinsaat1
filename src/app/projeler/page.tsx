import { metadataFor } from "@/lib/seo";
import ProjelerPage from "@/views/Projeler";


export const metadata = metadataFor("/projeler");

export default function Page() {
  return <ProjelerPage />;
}
