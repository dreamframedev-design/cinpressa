import { redirect } from "next/navigation";

/**
 * The site is live: the root sends visitors straight to the home page. The
 * pre-launch splash and its access code were removed at launch.
 */
export default function RootPage() {
  redirect("/home");
}
