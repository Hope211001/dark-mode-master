import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Mail, Clock, User, MessageSquare, RefreshCw } from "lucide-react";
import { apiClient } from "@/services/client";
import { useToast } from "@/components/ui/use-toast";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

const AdminContacts = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/contact");
      setContacts(res.data);
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger les messages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/contact/${id}`);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (selected?.id === id) setSelected(null);
      toast({ title: "Supprime", description: "Message supprime avec succes" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-64 transition-[margin] duration-300">
        <Header title="Messages de contact" subtitle="Messages recus via le formulaire de contact" />

        <div className="p-4 md:p-6">
          {/* Stats */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm font-mono">
                {loading ? "..." : contacts.length} message{contacts.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={fetchContacts} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-1 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>Aucun message recu.</p>
                </div>
              ) : (
                contacts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selected?.id === c.id
                        ? "bg-primary/10 border-primary/30"
                        : "bg-card border-border hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground text-sm truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">
                        {new Date(c.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground mt-2 truncate">{c.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Detail */}
            <div className="lg:col-span-2">
              {selected ? (
                <Card className="border-border bg-card h-full">
                  <CardHeader className="pb-4 border-b border-border/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold">{selected.subject}</CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {selected.name}</span>
                          <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {selected.email}</span>
                          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {formatDate(selected.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => window.open(`mailto:${selected.email}?subject=${encodeURIComponent('Re: ' + selected.subject)}`, '_self')}
                        >
                          <Mail className="h-3.5 w-3.5" /> Repondre
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(selected.id)}>
                          <Trash2 className="h-3.5 w-3.5" /> Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-border bg-card h-full">
                  <CardContent className="flex flex-col items-center justify-center py-32 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground text-lg font-medium">Selectionnez un message</p>
                    <p className="text-muted-foreground text-sm mt-1">Cliquez sur un message a gauche pour voir le detail</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminContacts;
