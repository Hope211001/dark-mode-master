import { useEffect, useState } from "react";
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Save, Loader2, ArrowLeft, Info, Trash2, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { cookiesService } from "@/services/cookies.service";
import ErrorAlert from "@/components/alert/error";
import SuccessAlert from "@/components/alert/success";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const FormCookies = () => {
  const [form, setForm] = useState({
    cookies: "",
    mail_leboncoin: "",
    password_leboncoin: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [errorAlert, setErrorAlert] = useState({ visible: false, message: "" });
  const [successAlert, setSuccessAlert] = useState({ visible: false, message: "" });

  useEffect(() => {
    fetchCookie();
  }, []);

  const fetchCookie = async () => {
    try {
      setLoading(true);
      const data = await cookiesService.getMyCookie();
      if (data) {
        setForm({
          cookies: data.cookies || "",
          mail_leboncoin: data.mail_leboncoin || "",
          password_leboncoin: data.password_leboncoin || "",
        });
        setIsEdit(true);
      }
    } catch {
      setErrorAlert({ visible: true, message: "Erreur lors du chargement." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await cookiesService.deleteCookie();
      setForm({ cookies: "", mail_leboncoin: "", password_leboncoin: "" });
      setIsEdit(false);
      setSuccessAlert({ visible: true, message: "Configuration supprimée !" });
    } catch {
      setErrorAlert({ visible: true, message: "Erreur lors de la suppression." });
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!form.mail_leboncoin.trim()) {
      setErrorAlert({ visible: true, message: "L'email LeBonCoin est obligatoire." });
      return;
    }
    if (!isValidEmail(form.mail_leboncoin.trim())) {
      setErrorAlert({ visible: true, message: "L'email LeBonCoin n'est pas valide." });
      return;
    }
    if (!form.password_leboncoin.trim()) {
      setErrorAlert({ visible: true, message: "Le mot de passe LeBonCoin est obligatoire." });
      return;
    }
    if (!form.cookies.trim()) {
      setErrorAlert({ visible: true, message: "Le cookie est obligatoire." });
      return;
    }
    try {
      setSaving(true);
      await cookiesService.upsertCookie({
        cookies: form.cookies.trim(),
        mail_leboncoin: form.mail_leboncoin.trim(),
        password_leboncoin: form.password_leboncoin.trim(),
      });
      setSuccessAlert({ visible: true, message: isEdit ? "Configuration mise à jour !" : "Configuration enregistrée !" });
      setIsEdit(true);
    } catch {
      setErrorAlert({ visible: true, message: "Erreur lors de la sauvegarde." });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <ErrorAlert
        message={errorAlert.message}
        visible={errorAlert.visible}
        onClose={() => setErrorAlert({ visible: false, message: "" })}
      />
      <SuccessAlert
        message={successAlert.message}
        visible={successAlert.visible}
        onClose={() => setSuccessAlert({ visible: false, message: "" })}
      />
      <ClientSidebar />

      <main className="md:ml-64 transition-[margin] duration-300">
        <ClientHeader title="Configuration LeBonCoin" subtitle="Identifiants et cookie de session" />

        <div className="p-4 md:p-6 lg:p-8 max-w-5xl">
          <Link
            to="/client/settings"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Retour aux paramètres
          </Link>

          <Card className="border-border bg-card">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <Cookie className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">
                    {isEdit ? "Modifier la configuration" : "Ajouter la configuration"}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Tous les champs sont obligatoires
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-5">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Renseignez vos identifiants LeBonCoin et votre cookie de session.
                      Ces informations sont utilisées pour l'automatisation de vos requêtes.
                    </p>
                  </div>

                  {/* 2 colonnes : Identifiants | Cookie */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Colonne gauche — Identifiants */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="mail_leboncoin" className="text-sm font-semibold flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          Email LeBonCoin <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="mail_leboncoin"
                          type="email"
                          value={form.mail_leboncoin}
                          onChange={(e) => handleChange("mail_leboncoin", e.target.value)}
                          placeholder="votre-email@exemple.com"
                          className="bg-secondary/30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password_leboncoin" className="text-sm font-semibold flex items-center gap-2">
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                          Mot de passe LeBonCoin <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="password_leboncoin"
                          type="password"
                          value={form.password_leboncoin}
                          onChange={(e) => handleChange("password_leboncoin", e.target.value)}
                          placeholder="Votre mot de passe LeBonCoin"
                          className="bg-secondary/30"
                        />
                      </div>
                    </div>

                    {/* Colonne droite — Cookie */}
                    <div className="space-y-2">
                      <Label htmlFor="cookies" className="text-sm font-semibold flex items-center gap-2">
                        <Cookie className="h-3.5 w-3.5 text-muted-foreground" />
                        Cookie de session <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="cookies"
                        value={form.cookies}
                        onChange={(e) => handleChange("cookies", e.target.value)}
                        placeholder="Collez votre cookie ici..."
                        className="bg-secondary/30 min-h-[132px] font-mono text-xs resize-none"
                      />
                    </div>
                  </div>

                  {/* Boutons */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 h-11 gap-2 font-semibold"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {isEdit ? "Mettre à jour" : "Enregistrer"}
                    </Button>
                    {isEdit && (
                      <Button
                        variant="outline"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="h-11 gap-2 font-semibold border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/40"
                      >
                        {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        Supprimer
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FormCookies;
