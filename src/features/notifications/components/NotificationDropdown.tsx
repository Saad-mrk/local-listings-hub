import { Bell, X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotification } from "@/hooks/useNotification";
import type { NotificationContextType } from "@/contexts/NotificationContext";

// Fonction pour formater le temps relatif
const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "À l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Il y a ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `Il y a ${days}j`;
  return date.toLocaleDateString("fr-FR");
};

const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotification() as NotificationContextType;

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-primary hover:bg-secondary/10"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        {/* Header */}
        <div className="border-b border-border px-4 py-3 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune notification</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className={`flex gap-3 px-4 py-3 cursor-pointer ${!notif.read ? "bg-primary/5" : ""}`}
                onClick={() => markAsRead(notif.id)}
              >
                <div className="flex-shrink-0 pt-1">{getIcon(notif.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{notif.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{notif.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(notif.timestamp)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                  className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </DropdownMenuItem>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-border px-4 py-2">
            <button className="w-full text-center text-xs text-primary hover:underline py-2">
              Voir toutes les notifications
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
