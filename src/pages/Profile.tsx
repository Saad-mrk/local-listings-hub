import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail } from "lucide-react";
import { useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useLanguage } from "@/contexts/LanguageContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { t } = useLanguage();

  useEffect(() => { if (!user) navigate("/login"); }, [user, navigate]);
  if (!user) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="min-h-screen bg-background">
      <div className="container py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="h-4 w-4" />{t("back_to_home")}
        </Link>
        <div className="max-w-2xl">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
            <h1 className="text-3xl font-heading font-extrabold mb-8">{t("my_profile")}</h1>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center"><User className="h-6 w-6 text-primary" /></div>
                <div><p className="text-sm text-muted-foreground">{t("name")}</p><p className="font-semibold text-lg">{user.name}</p></div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center"><Mail className="h-6 w-6 text-primary" /></div>
                <div><p className="text-sm text-muted-foreground">{t("email")}</p><p className="font-semibold text-lg">{user.email}</p></div>
              </div>
              <div className="pt-6 border-t border-border">
                <Link to="/settings"><Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold">{t("edit_settings")}</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
