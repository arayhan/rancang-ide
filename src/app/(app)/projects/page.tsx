import { redirect } from "next/navigation";

// The dashboard collapsed into the chat-first Home ('/'). Keep the route for
// bookmarks and legacy links — just send them home.
export default function ProjectsPage() {
  redirect("/");
}
