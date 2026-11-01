import { metadataFor } from "@/lib/seo";
import IletisimPage from "@/views/Iletisim";


export const metadata = metadataFor("/iletisim");

export default function Page() {
  return <IletisimPage />;
}
