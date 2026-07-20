"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useUserSession() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setIsLoggedIn(!!user);
      } catch (err) {
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, []);

  return { isLoggedIn };
}
