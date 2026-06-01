import { env } from "@/config/env";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";

export function buildNotificationConnection(token: string): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(`${env.apiUrl}/hubs/notifications`, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();
}

export interface NotificationCreateDto {
  to?: number;
  idUtilisateur?: number;
  IdUtilisateur?: number;
  // English keys
  title?: string;
  content?: string;
  entityType?: string;
  entityId?: number;
  notificationType?: string;
  type?: string; // ✅ Ajouté
  // French/backwards-compatible keys
  titre?: string;
  contenu?: string;
  lienAction?: string | null;
  entiteType?: string | null;
  entiteId?: number | null;
  dateExpiration?: string | null;
}

// ✅ Interface pour le payload envoyé au serveur (évite Record<string, unknown>)
interface BackendNotificationPayload {
  IdUtilisateur: number | null;
  idUtilisateur: number | null;
  Titre: string;
  titre: string;
  Contenu: string;
  contenu: string;
  Type: string;
  type: string;
  LienAction: string | null;
  lienAction: string | null;
  EntiteType: string | null;
  entiteType: string | null;
  EntiteId: number | null;
  entiteId: number | null;
  DateExpiration: string | null;
  dateExpiration: string | null;
}

const API_BASE = `${env.apiUrl}/api/notifications`;

const getToken = (): string => {
  return localStorage.getItem("token") ?? "";
};

const request = async <T = unknown>(url: string, options: RequestInit = {}): Promise<T> => {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Notification API error ${response.status}: ${body || response.statusText}`);
  }

  if (response.status === 204 || response.status === 205) {
    return null as T;
  }

  return (await response.json()) as T;
};

export const getNotifications = async (page = 1, taille = 20): Promise<unknown[]> => {
  return request<unknown[]>(`${API_BASE}?page=${page}&taille=${taille}`);
};

export const getCountNonLues = async (): Promise<number> => {
  const result = await request<{ count: number }>(`${API_BASE}/count-non-lues`);
  if (typeof result?.count !== "number") {
    throw new Error("Notification API returned invalid count");
  }
  return result.count;
};

export const marquerLue = async (id: number): Promise<void> => {
  await request(`${API_BASE}/${id}/lue`, {
    method: "PATCH",
  });
};

export const marquerToutesLues = async (): Promise<void> => {
  await request(`${API_BASE}/lire-toutes`, {
    method: "PATCH",
  });
};

export const envoyerNotification = async (dto: NotificationCreateDto) => {
  const recipientId = dto.IdUtilisateur ?? dto.idUtilisateur ?? dto.to ?? null;

  // ✅ Mapping propre sans aucun "any"
  const payload: BackendNotificationPayload = {
    IdUtilisateur: recipientId,
    idUtilisateur: recipientId,
    Titre: dto.title ?? dto.titre ?? "",
    titre: dto.title ?? dto.titre ?? "",
    Contenu: dto.content ?? dto.contenu ?? "",
    contenu: dto.content ?? dto.contenu ?? "",
    Type: dto.notificationType ?? dto.type ?? "info",
    type: dto.notificationType ?? dto.type ?? "info",
    LienAction: dto.lienAction ?? null,
    lienAction: dto.lienAction ?? null,
    EntiteType: dto.entityType ?? dto.entiteType ?? null,
    entiteType: dto.entityType ?? dto.entiteType ?? null,
    EntiteId: dto.entityId ?? dto.entiteId ?? null,
    entiteId: dto.entityId ?? dto.entiteId ?? null,
    DateExpiration: dto.dateExpiration ?? null,
    dateExpiration: dto.dateExpiration ?? null,
  };

  try {
    console.debug("[notificationService] sending payload:", payload);

    const result = await request(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.debug("[notificationService] server response:", result);
    return result;
  } catch (err) {
    console.error("[notificationService] failed to send notification", err);
    throw err;
  }
};
