import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail } from "lucide-react";
import { useEffect } from "react";
import { useUser } from "@/hooks/useUser";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>

        <div className="max-w-2xl">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
            <h1 className="text-3xl font-heading font-extrabold mb-8">
              Mon Profil
            </h1>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="font-semibold text-lg">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-lg">{user.email}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <Link to="/settings">
                  <Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl font-semibold">
                    Modifier les paramètres
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
