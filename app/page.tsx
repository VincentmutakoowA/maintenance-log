'use server'

import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";

export default async function Page() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	redirect(user ? "/admin" : "/login");

}