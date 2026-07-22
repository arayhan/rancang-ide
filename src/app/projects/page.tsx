import { redirect } from "next/navigation";

// Dashboard collapsed into '/'. Keep the route for bookmarks / legacy links.
export default function ProjectsPage() {
  redirect("/");
}
