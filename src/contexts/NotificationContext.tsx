import { createContext, type ReactNode, useCallback, useState } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    title: string,
    message: string,
    type?: "info" | "success" | "warning" | "error",
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Bienvenue sur LBAL",
      message: "Votre compte a ete cree avec succes",
      type: "success",
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
    },
  ]);

  const addNotification = useCallback(
    (title: string, message: string, type: "info" | "success" | "warning" | "error" = "info") => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        title,
        message,
        type,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
    [],
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
