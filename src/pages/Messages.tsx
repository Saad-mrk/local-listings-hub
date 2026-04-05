import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  ArrowLeft,
  Phone,
  MoreVertical,
  Search,
  Image,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const mockConversations = [
  {
    id: "1",
    user: "Youssef K.",
    avatar: "Y",
    lastMessage: "Est-ce que le prix est négociable ?",
    time: "Il y a 5 min",
    unread: 2,
    online: true,
    ad: {
      title: "iPhone 15 Pro Max",
      image:
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=80&h=80&fit=crop",
    },
  },
  {
    id: "2",
    user: "Fatima Z.",
    avatar: "F",
    lastMessage: "Je suis intéressée, on peut se rencontrer demain ?",
    time: "Il y a 1h",
    unread: 1,
    online: true,
    ad: {
      title: "MacBook Pro M3",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop",
    },
  },
  {
    id: "3",
    user: "Omar B.",
    avatar: "O",
    lastMessage: "Merci pour la réponse !",
    time: "Hier",
    unread: 0,
    online: false,
    ad: {
      title: "AirPods Pro 2",
      image:
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=80&h=80&fit=crop",
    },
  },
  {
    id: "4",
    user: "Sara M.",
    avatar: "S",
    lastMessage: "D'accord, je prends !",
    time: "Il y a 2 jours",
    unread: 0,
    online: false,
    ad: {
      title: "Samsung Galaxy S24",
      image:
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=80&h=80&fit=crop",
    },
  },
];

const mockMessages: Record<
  string,
  Array<{ id: string; text: string; sender: "me" | "other"; time: string }>
> = {
  "1": [
    {
      id: "m1",
      text: "Bonjour, votre iPhone est toujours disponible ?",
      sender: "other",
      time: "14:20",
    },
    {
      id: "m2",
      text: "Oui, il est toujours disponible !",
      sender: "me",
      time: "14:22",
    },
    {
      id: "m3",
      text: "Super ! Quel est l'état de la batterie ?",
      sender: "other",
      time: "14:23",
    },
    {
      id: "m4",
      text: "La batterie est à 95%, très bon état général avec boîte et accessoires d'origine.",
      sender: "me",
      time: "14:25",
    },
    {
      id: "m5",
      text: "Est-ce que le prix est négociable ?",
      sender: "other",
      time: "14:30",
    },
  ],
  "2": [
    {
      id: "m1",
      text: "Bonjour ! Le MacBook est encore dispo ?",
      sender: "other",
      time: "12:00",
    },
    { id: "m2", text: "Bonjour, oui il l'est.", sender: "me", time: "12:05" },
    {
      id: "m3",
      text: "Je suis intéressée, on peut se rencontrer demain ?",
      sender: "other",
      time: "12:10",
    },
  ],
  "3": [
    {
      id: "m1",
      text: "Bonjour, les AirPods sont neufs ?",
      sender: "other",
      time: "10:00",
    },
    {
      id: "m2",
      text: "Quasi neufs, utilisés 2 semaines seulement.",
      sender: "me",
      time: "10:05",
    },
    {
      id: "m3",
      text: "Merci pour la réponse !",
      sender: "other",
      time: "10:06",
    },
  ],
  "4": [
    {
      id: "m1",
      text: "Le Galaxy est débloqué tout opérateur ?",
      sender: "other",
      time: "09:00",
    },
    {
      id: "m2",
      text: "Oui, débloqué et en parfait état.",
      sender: "me",
      time: "09:10",
    },
    { id: "m3", text: "D'accord, je prends !", sender: "other", time: "09:15" },
  ],
};

const Messages = () => {
  const [selectedConv, setSelectedConv] = useState<string | null>("1");
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const activeConv = mockConversations.find((c) => c.id === selectedConv);
  const messages = selectedConv ? mockMessages[selectedConv] || [] : [];

  const filteredConversations = mockConversations.filter(
    (c) =>
      c.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ad.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // Mock send
    setNewMessage("");
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
          {/* Conversation List */}
          <div
            className={cn(
              "w-full md:w-[340px] border-r border-border flex flex-col shrink-0",
              selectedConv && "hidden md:flex",
            )}
          >
            <div className="p-4 border-b border-border">
              <h2 className="font-heading font-bold text-lg mb-3">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl bg-muted border-secondary/20"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left",
                    selectedConv === conv.id &&
                      "bg-secondary/10 border-l-2 border-primary",
                  )}
                >
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                      {conv.avatar}
                    </div>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm truncate">
                        {conv.user}
                      </p>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {conv.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {conv.ad.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))}
            </ScrollArea>
          </div>

          {/* Chat Area */}
          {selectedConv && activeConv ? (
            <div
              className={cn(
                "flex-1 flex flex-col",
                !selectedConv && "hidden md:flex",
              )}
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden shrink-0"
                  onClick={() => setSelectedConv(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <img
                  src={activeConv.ad.image}
                  alt={activeConv.ad.title}
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{activeConv.user}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activeConv.ad.title}
                  </p>
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
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.sender === "me" ? "justify-end" : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                          msg.sender === "me"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md",
                        )}
                      >
                        <p>{msg.text}</p>
                        <p
                          className={cn(
                            "text-[10px] mt-1",
                            msg.sender === "me"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground",
                          )}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary shrink-0"
                >
                  <Image className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Écrire un message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="rounded-xl bg-muted border-secondary/20"
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
              <p>Sélectionnez une conversation</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Messages;
