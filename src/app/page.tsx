import { redirect } from "next/navigation";

/** Fallback caso o redirect do next.config não rode em dev. */
export default function HomePage() {
  redirect("https://www.grapeclinic.com.br/");
}
