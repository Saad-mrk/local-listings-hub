import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Phone, MoreVertical, Search, Image } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { conversationApi, messageApi } from "@/api";
import { useUser } from "@/hooks/useUser";
import type { ConversationDto } from "@/types/conversation.types";
import type { CreateMessageRequest, MessageDto } from "@/types/message.types";

const convItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const messageVariants = {
  hidden: (sender: boolean) => ({ opacity: 0, x: sender ? 30 : -30, scale: 0.95 }),
  visible: () => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
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

const Messages = () => {
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const { user } = useUser();

  const currentUserId = useMemo<number | null>(() => {
    if (!user) return null;
    const parsed = Number(user.id);
    return Number.isFinite(parsed) ? parsed : null;
  }, [user]);

  const activeConv = useMemo(
    () => conversations.find((conv) => conv.idConversation === selectedConvId) ?? null,
    [conversations, selectedConvId],
  );

  const filteredConversations = useMemo(
    () =>
      conversations.filter((conv) => {
        const name =
          `${conv.prenomAutreUtilisateur ?? ""} ${conv.nomAutreUtilisateur ?? ""}`.trim();
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      }),
    [conversations, searchQuery],
  );

  const loadConversations = useCallback(async () => {
    setLoadingConversations(true);
    setError(null);

    try {
      const response = await conversationApi.getMyConversations();
      setConversations(response);
      if (response.length > 0 && selectedConvId === null) {
        setSelectedConvId(response[0].idConversation);
      }
    } catch (err: unknown) {
      setError("Impossible de charger vos conversations.");
      console.error(err);
    } finally {
      setLoadingConversations(false);
    }
  }, [selectedConvId]);

  const markMessagesRead = useCallback(
    async (fetchedMessages: MessageDto[]) => {
      const unreadMessages = fetchedMessages.filter((message) => {
        const isMine =
          currentUserId !== null ? message.idExpediteur === currentUserId : message.estMonMessage;
        return !message.est_lu && !isMine;
      });

      await Promise.all(
        unreadMessages.map(async (message) => {
          try {
            await messageApi.markAsRead(message.idMessage);
          } catch (err: unknown) {
            console.warn("Failed to mark message read", err);
          }
        }),
      );
    },
    [currentUserId],
  );

  const loadMessages = useCallback(
    async (conversationId: number) => {
      setLoadingMessages(true);
      setError(null);

      try {
        const response = await messageApi.getConversationMessages(conversationId);
        setMessages(response);
        await markMessagesRead(response);
        setMessages((current) =>
          current.map((message) => {
            const isMine =
              currentUserId !== null
                ? message.idExpediteur === currentUserId
                : message.estMonMessage;
            return !isMine ? { ...message, est_lu: true } : message;
          }),
        );
      } catch (err: unknown) {
        setError("Impossible de charger les messages.");
        console.error(err);
      } finally {
        setLoadingMessages(false);
      }
    },
    [markMessagesRead, currentUserId],
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (selectedConvId !== null) {
      loadMessages(selectedConvId);
    }
  }, [selectedConvId, loadMessages]);

  const contactName = activeConv
    ? `${activeConv.prenomAutreUtilisateur ?? ""} ${activeConv.nomAutreUtilisateur ?? ""}`.trim() ||
      `Conversation ${activeConv.idConversation}`
    : "Conversation";

  const handleSend = async () => {
    if (!newMessage.trim() || selectedConvId === null) return;

    const payload: CreateMessageRequest = {
      idConversation: selectedConvId,
      contenu: newMessage.trim(),
    };

    try {
      await messageApi.sendMessage(payload);
      setNewMessage("");
      await loadMessages(selectedConvId);
    } catch (err: unknown) {
      console.error("Impossible d'envoyer le message", err);
      setError("Impossible d'envoyer le message.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background flex flex-col"
    >
      <Navbar />
      <main className="flex-1 container py-6 max-w-6xl">
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden flex h-[calc(100vh-200px)] min-h-[500px]">
          <div className="w-full md:w-[340px] border-r border-border flex flex-col shrink-0">
            <motion.div
              className="p-4 border-b border-border"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="font-heading font-bold text-lg mb-3">{t("messages_title")}</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("search_messages")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl bg-muted border-secondary/20"
                />
              </div>
            </motion.div>
            <ScrollArea className="flex-1">
              {loadingConversations ? (
                <div className="p-4 text-sm text-muted-foreground">
                  Chargement des conversations...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">
                  Aucune conversation trouvée.
                </div>
              ) : (
                filteredConversations.map((conv, i) => {
                  const name =
                    `${conv.prenomAutreUtilisateur ?? ""} ${conv.nomAutreUtilisateur ?? ""}`.trim() ||
                    `Conversation ${conv.idConversation}`;
                  const time = formatTimeAgo(conv.dateCreation);
                  const isSelected = conv.idConversation === selectedConvId;

                  return (
                    <motion.button
                      key={conv.idConversation}
                      onClick={() => setSelectedConvId(conv.idConversation)}
                      className={cn(
                        "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left",
                        isSelected && "bg-secondary/10 border-l-2 border-primary",
                      )}
                      variants={convItemVariants}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      whileHover={{ backgroundColor: "hsl(var(--muted) / 0.5)" }}
                    >
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                          {name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm truncate">{name}</p>
                          <span className="text-xs text-muted-foreground shrink-0">{time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                          {conv.dateCreation
                            ? new Date(conv.dateCreation).toLocaleDateString("fr-FR")
                            : ""}
                        </p>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </ScrollArea>
          </div>

          <AnimatePresence mode="wait">
            {selectedConvId !== null && activeConv ? (
              <motion.div
                key={selectedConvId}
                className="flex-1 flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <motion.div
                  className="p-4 border-b border-border flex items-center gap-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden shrink-0"
                    onClick={() => setSelectedConvId(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="w-10 h-10 rounded-lg bg-muted/80 flex items-center justify-center text-muted-foreground shrink-0">
                    {contactName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{contactName}</p>
                    <p className="text-xs text-muted-foreground truncate">{t("messages_title")}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {loadingMessages ? (
                      <div className="text-sm text-muted-foreground">
                        Chargement des messages...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        Aucun message pour cette conversation.
                      </div>
                    ) : (
                      messages.map((msg, i) => {
                        const isMine =
                          currentUserId !== null
                            ? msg.idExpediteur === currentUserId
                            : Boolean(msg.estMonMessage);

                        return (
                          <motion.div
                            key={msg.idMessage}
                            className={cn("flex w-full", isMine ? "justify-end" : "justify-start")}
                            variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            custom={isMine}
                            transition={{ delay: i * 0.07 }}
                          >
                            <motion.div
                              className={cn(
                                "max-w-[75%] rounded-3xl px-4 py-2.5 text-sm shadow-sm",
                                isMine
                                  ? "bg-primary text-primary-foreground rounded-br-[4px] rounded-tl-[28px] rounded-tr-[28px] rounded-bl-[28px] text-right"
                                  : "bg-muted text-foreground rounded-bl-[4px] rounded-tr-[28px] rounded-tl-[28px] rounded-br-[28px]",
                              )}
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.15 }}
                            >
                              <p>{msg.contenu}</p>
                              <p
                                className={cn(
                                  "text-[10px] mt-1",
                                  isMine ? "text-primary-foreground/70" : "text-muted-foreground",
                                )}
                              >
                                {formatTimeAgo(msg.dateEnvoi)}
                              </p>
                            </motion.div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
                <motion.div
                  className="p-4 border-t border-border flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary shrink-0"
                  >
                    <Image className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder={t("write_message")}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="rounded-xl bg-muted border-secondary/20"
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      onClick={handleSend}
                      size="icon"
                      className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {loadingConversations ? "Chargement..." : t("select_conversation")}
                </motion.p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Messages;
