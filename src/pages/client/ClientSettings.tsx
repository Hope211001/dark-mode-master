import React, { useEffect, useState } from 'react';
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Cookie, User, Lock, ChevronRight, MapPin, Save } from "lucide-react";
import { authService } from '@/services/auth.service';
import { Link } from "react-router-dom";
import ErrorAlert from "@/components/alert/error";
import SuccessAlert from "@/components/alert/success";

const ClientSettings = () => {
  const [loading, setLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState({ visible: false, message: "" });
  const [successAlert, setSuccessAlert] = useState({ visible: false, message: "" });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await authService.getProfile();
      if (res && res.user) {
        setFormData(prev => ({
          ...prev,
          name: res.user.name || '',
          email: res.user.email || ''
        }));
      }
    } catch {
      setErrorAlert({ visible: true, message: "Impossible de charger le profil" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    setLoading(true);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setErrorAlert({ visible: true, message: "Les nouveaux mots de passe ne correspondent pas" });
      setLoading(false);
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      setErrorAlert({ visible: true, message: "Le mot de passe actuel est requis pour changer de mot de passe" });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        ...(formData.newPassword ? {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        } : {})
      };

      const response = await authService.updateProfile(payload);
      setSuccessAlert({ visible: true, message: "Profil mis à jour avec succès !" });

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        name: response.user.name || prev.name,
        email: response.user.email || prev.email
      }));
    } catch (error: any) {
      setErrorAlert({ visible: true, message: error.response?.data?.error || "Erreur lors de la mise à jour" });
    } finally {
      setLoading(false);
    }
  };

  const quickLinks = [
    {
      to: "/client/cookies",
      icon: Cookie,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      hoverBorder: "hover:border-amber-500/30",
      title: "Cookie de session",
      desc: "Configurer le cookie pour l'automatisation",
    },
    {
      to: "/client/zones",
      icon: MapPin,
      iconColor: "text-clay-400",
      iconBg: "bg-clay-500/10 border-clay-500/20",
      hoverBorder: "hover:border-clay-500/30",
      title: "Mes zones",
      desc: "Gérer vos zones de prospection",
    },
  ];

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
        <ClientHeader
          title="Paramètres"
          subtitle="Gérez vos informations personnelles et votre sécurité"
        />
 
        <div className="p-4 md:p-6 lg:p-8">

          {/* Raccourcis pleine largeur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-w-5xl">
            {quickLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Card className={`border-border bg-card ${link.hoverBorder} transition-all cursor-pointer group`}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg border shrink-0 ${link.iconBg}`}>
                      <link.icon className={`h-4 w-4 ${link.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{link.title}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{link.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* 2 colonnes : Profil | Mot de passe */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">

            {/* Colonne gauche — Profil */}
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Informations personnelles</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Nom et adresse email</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    className="bg-secondary/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@exemple.com"
                    className="bg-secondary/30"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Colonne droite — Mot de passe */}
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Lock className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Changer le mot de passe</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Optionnel — laissez vide pour ne pas modifier</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="bg-secondary/30"
                    placeholder="Requis pour changer de mot de passe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="bg-secondary/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-secondary/30"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sauvegarder */}
          <div className="max-w-5xl mt-6">
            <Button
              onClick={handleUpdateProfile}
              className="w-full h-11 gap-2 font-semibold"
              disabled={loading}
            >
              {loading ? "Mise à jour..." : <><Save className="h-4 w-4" /> Sauvegarder les modifications</>}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientSettings;
