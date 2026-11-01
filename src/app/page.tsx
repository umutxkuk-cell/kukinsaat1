import { metadataFor } from "@/lib/seo";
import HomePage from "@/views/Home";


export const metadata = metadataFor("/");

export default function Page() {
  return <HomePage />;
}
