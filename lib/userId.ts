import { createClient } from "@/lib/supabase";

export async function getUserId(): Promise<string> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return user.id;

  // Fallback to localStorage ID if not signed in
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("gmat_user_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("gmat_user_id", id);
  }
  return id;
}
