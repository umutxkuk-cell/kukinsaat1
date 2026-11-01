import { metadataFor } from "@/lib/seo";
import HizmetlerPage from "@/views/Hizmetler";


export const metadata = metadataFor("/hizmetler");

export default function Page() {
  return <HizmetlerPage />;
}
