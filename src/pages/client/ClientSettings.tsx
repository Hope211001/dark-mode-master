import React, { useState } from 'react';
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner"; // Utilisation de Sonner pour les notifications
import { Filter, Mail, Bell, Shield, Save, Loader2 } from "lucide-react";

const ClientSettings = () => {
  const [loading, setLoading] = useState(false);

  // Fonction générique pour simuler ou appeler la sauvegarde
  const handleSave = async (section: string) => {
    setLoading(true);
    // Ici tu feras tes appels API (fetch ou axios)
    setTimeout(() => {
      setLoading(false);
      toast.success(`Paramètres ${section} mis à jour avec succès !`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />
      
      <main className="ml-64">
        <ClientHeader 
          title="Paramètres" 
          subtitle="Configurez vos préférences de recherche et notifications"
        />
        
        <div className="p-6 max-w-4xl">
          <Tabs defaultValue="filters" className="space-y-6">
            <TabsList className="bg-secondary/50 p-1">
              <TabsTrigger value="filters" className="gap-2">
                <Filter className="h-4 w-4" /> Filtres
              </TabsTrigger>
              <TabsTrigger value="emails" className="gap-2">
                <Mail className="h-4 w-4" /> SMS/Emails
              </TabsTrigger>
              <TabsTrigger value="autocontact" className="gap-2">
                <Bell className="h-4 w-4" /> Auto-contact
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" /> Sécurité
              </TabsTrigger>
            </TabsList>

            {/* --- ONGLET FILTRES --- */}
            <TabsContent value="filters">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Critères de recherche</CardTitle>
                  <CardDescription>Définissez vos filtres automatiques pour les leads.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="surface-min">Surface minimum (m²)</Label>
                      <Input id="surface-min" type="number" placeholder="25" className="bg-secondary/30" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget-max">Loyer maximum (€)</Label>
                      <Input id="budget-max" type="number" placeholder="1500" className="bg-secondary/30" />
                    </div>
                  </div>
                  <Button onClick={() => handleSave('Filtres')} className="w-full gap-2" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Sauvegarder les filtres
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* --- ONGLET SMS/MODÈLES --- */}
            <TabsContent value="emails">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Modèles de messages</CardTitle>
                  <CardDescription>Personnalisez le message automatique envoyé aux propriétaires.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="sms-body">Corps du SMS automatique</Label>
                    <Textarea 
                      id="sms-body"
                      className="bg-secondary/30 min-h-[150px] focus:ring-blue-500"
                      defaultValue={`Bonjour {{owner_name}}, je suis très intéressé par votre bien situé à {{ville}}. Est-il toujours disponible ?`}
                    />
                    <p className="text-xs text-muted-foreground">Utilisez {"{{owner_name}}"} et {"{{ville}}"} pour personnaliser l'envoi.</p>
                  </div>
                  <Button onClick={() => handleSave('Modèles')} className="w-full gap-2" disabled={loading}>
                    <Save className="h-4 w-4" /> Sauvegarder le modèle
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* --- ONGLET AUTO-CONTACT --- */}
            <TabsContent value="autocontact">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Automatisation</CardTitle>
                  <CardDescription>Gérez l'envoi automatique de vos messages.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl border border-white/5">
                    <div className="space-y-0.5">
                      <p className="font-medium">Auto-contact activé</p>
                      <p className="text-sm text-muted-foreground">Envoyer un SMS dès qu'un lead correspond à mes filtres.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  {/* AJOUT DU BOUTON ICI */}
                  <Button onClick={() => handleSave('Auto-contact')} className="w-full gap-2" disabled={loading}>
                    <Save className="h-4 w-4" /> Confirmer la configuration
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* --- ONGLET SÉCURITÉ (Connecté à ton API /update-profile) --- */}
            <TabsContent value="security">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Sécurité et Compte</CardTitle>
                  <CardDescription>Modifiez vos identifiants et votre mot de passe.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom complet</Label>
                            <Input id="name" placeholder="Jean Dupont" className="bg-secondary/30" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="jean@example.com" className="bg-secondary/30" />
                        </div>
                    </div>
                    
                    <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10 space-y-4">
                        <h4 className="text-sm font-semibold text-blue-400">Changer le mot de passe</h4>
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Mot de passe actuel</Label>
                            <Input id="current-password" type="password" className="bg-secondary/30" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                                <Input id="new-password" type="password" className="bg-secondary/30" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirmer</Label>
                                <Input id="confirm-password" type="password" className="bg-secondary/30" />
                            </div>
                        </div>
                    </div>
                  </div>

                  <Button onClick={() => handleSave('Sécurité')} className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                    <Shield className="h-4 w-4" /> Mettre à jour mon profil
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default ClientSettings;