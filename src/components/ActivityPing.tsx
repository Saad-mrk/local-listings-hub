import { useEffect } from "react";
import { apiClient } from "@/api/client";
import { useUser } from "@/hooks/useUser";

const ACTIVITY_INTERVAL_MS = 5 * 60 * 1000;

export const ActivityPing = () => {
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      return;
    }

    let isMounted = true;

    const sendActivityPing = async () => {
      try {
        await apiClient.post("/api/Auth/activity");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const status = (error as { response?: { status?: number } }).response?.status;

        // A failing heartbeat should not immediately invalidate the session.
        // The global Axios interceptor already handles real 401s from user-facing requests.
        if (status !== 401) {
          return;
        }
      }
    };

    const intervalId = window.setInterval(() => {
      void sendActivityPing();
    }, ACTIVITY_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [user]);

  return null;
};
