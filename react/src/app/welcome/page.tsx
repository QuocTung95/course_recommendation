import { redirect } from "next/navigation";

export default function WelcomeRedirect() {
  // Permanently redirect /welcome to root where Welcome is now served
  redirect("/");
  return null;
}
