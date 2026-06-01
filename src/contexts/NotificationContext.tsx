import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { HubConnection } from "@microsoft/signalr";
import {
  buildNotificationConnection,
  getNotifications,
  getCountNonLues,
  marquerLue,
  marquerToutesLues,
} from "@/services/notificationService";
import { useAuth } from "@/contexts/AuthContext";

// --- Typage ---

export interface NotificationDto {
  id: number; // Changé de optional à requis pour éviter les soucis de clé (key)
  type: "MESSAGE" | "FAVORI" | "ANNONCE";
  titre: string;
  contenu: string;
  lienAction?: string;
  estLue: boolean;
  dateCreation: string;
}

// ✅ Interface pour typer les données brutes provenant de l'API ou SignalR
interface RawNotification {
  id?: number;
  Id?: number;
  idNotification?: number;
  type?: string;
  Type?: string;
  notificationType?: string;
  TypeNotification?: string;
  titre?: string;
  Titre?: string;
  title?: string;
  contenu?: string;
  Contenu?: string;
  content?: string;
  lienAction?: string | null;
  LienAction?: string | null;
  link?: string | null;
  estLue?: boolean;
  est_lu?: boolean;
  dateCreation?: string;
  DateCreation?: string;
  date_creation?: string;
}

type NotificationAddType = NotificationDto["type"] | "info" | "success" | "warning" | "error";

interface NotificationContextValue {
  notifs: NotificationDto[];
  unreadCount: number;
  nonLues: number;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (titre: string, contenu?: string, type?: NotificationAddType) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

// --- Provider ---

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAuth();
  const [notifs, setNotifs] = useState<NotificationDto[]>([]);
  const [serverUnreadCount, setServerUnreadCount] = useState<number | null>(null);
  const connRef = useRef<HubConnection | null>(null);

  // ✅ Suppression du "any" : On utilise l'interface RawNotification
  const normalizeNotification = (item: RawNotification): NotificationDto => {
    const typeValue =
      item.type ?? item.Type ?? item.notificationType ?? item.TypeNotification ?? "MESSAGE";

    const rawType = String(typeValue).toUpperCase();
    const type: NotificationDto["type"] = 
      rawType === "FAVORI" || rawType === "ANNONCE" ? rawType : "MESSAGE";

    return {
      id: item.id ?? item.Id ?? item.idNotification ?? Date.now(),
      type,
      titre: item.titre ?? item.Titre ?? item.title ?? "",
      contenu: item.contenu ?? item.Contenu ?? item.content ?? "",
      lienAction: (item.lienAction ?? item.LienAction ?? item.link) || undefined,
      estLue: typeof item.estLue === "boolean" ? item.estLue : !!item.est_lu,
      dateCreation:
        item.dateCreation ?? item.DateCreation ?? item.date_creation ?? new Date().toISOString(),
    };
  };

  useEffect(() => {
    if (!accessToken) return;

    const loadNotifications = async () => {
      try {
        const [rawNotifications, unreadCount] = await Promise.all([
          getNotifications(1, 20),
          getCountNonLues(),
        ]);
        
        // On force le cast ici car getNotifications retourne unknown[]
        const normalized = (rawNotifications as RawNotification[]).map(normalizeNotification);
        setNotifs(normalized);
        setServerUnreadCount(unreadCount);
      } catch (err) {
        console.error("[SignalR Notifications] failed to load notifications", err);
      }
    };

    loadNotifications();

    const conn = buildNotificationConnection(accessToken);
    connRef.current = conn;

    // SignalR reçoit souvent des objets qui correspondent à RawNotification
    conn.on("NouvelleNotification", (rawNotif: RawNotification) => {
      const normalized = normalizeNotification(rawNotif);
      setNotifs((prev) => [{ ...normalized, estLue: false }, ...prev]);
      setServerUnreadCount((current) => (current !== null ? current + 1 : current));
    });

    conn.start().catch((err) => console.error("[SignalR Notifications]", err));

    return () => {
      if (connRef.current) {
        connRef.current.stop();
        connRef.current = null;
      }
    };
  }, [accessToken]);

  const localUnreadCount = notifs.filter((n) => !n.estLue).length;
  const unreadCount = serverUnreadCount ?? localUnreadCount;
  const nonLues = unreadCount;

  const normalizeType = (type?: NotificationAddType): NotificationDto["type"] => {
    if (type === "MESSAGE" || type === "FAVORI" || type === "ANNONCE") {
      return type;
    }
    return "MESSAGE";
  };

  const addNotification = (titre: string, contenu = "", type?: NotificationAddType) => {
    const newNotif: NotificationDto = {
      id: Date.now(),
      type: normalizeType(type),
      titre,
      contenu,
      estLue: false,
      dateCreation: new Date().toISOString(),
    };
    setNotifs((prev) => [newNotif, ...prev]);
  };

  const markAsRead = async (id: number) => {
    try {
      await marquerLue(id);
      setServerUnreadCount((current) => (current !== null ? Math.max(current - 1, 0) : current));
      setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, estLue: true } : n)));
    } catch (err) {
      console.error("[SignalR Notifications] markAsRead failed", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await marquerToutesLues();
      setServerUnreadCount(0);
      setNotifs((prev) => prev.map((n) => ({ ...n, estLue: true })));
    } catch (err) {
      console.error("[SignalR Notifications] markAllAsRead failed", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifs, unreadCount, nonLues, markAsRead, markAllAsRead, addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotificationContext must be used inside NotificationProvider");
  return ctx;
};