import { useState, useEffect } from "react";
import { axiosPrivate } from "@/API/axios";
import { PendingAccount } from "@/types/user";

export function usePendingUsers() {
  const [pendingUsers, setPendingUsers] = useState<PendingAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await axiosPrivate.get("/pending-users");
        setPendingUsers(response.data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  return { pendingUsers, isLoading, error };
} 