import { metadataFor } from "@/lib/seo";
import GizlilikPage from "@/views/Gizlilik";


export const metadata = metadataFor("/gizlilik");

export default function Page() {
  return <GizlilikPage />;
}
