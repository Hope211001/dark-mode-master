import React, { useEffect, useState } from 'react';
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner"; 
import { Shield } from "lucide-react";
import { authService } from '@/services/auth.service';

const ClientSettings = () => {
  const [loading, setLoading] = useState(false);
  
  // State unique pour les informations du profil
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Charger les infos au montage
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
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger le profil");
    }
  };

  // Gestion des inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Logique de mise à jour
  const handleUpdateProfile = async () => {
    setLoading(true);
    
    // Validation mot de passe
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      toast.error("Le mot de passe actuel est requis pour changer de mot de passe");
      setLoading(false);
      return;
    }

    try {
      // Préparation du payload
      const payload = {
        name: formData.name,
        email: formData.email,
        ...(formData.newPassword ? { 
            currentPassword: formData.currentPassword, 
            newPassword: formData.newPassword 
        } : {})
      };

      const response = await authService.updateProfile(payload);
      
      toast.success("Profil mis à jour avec succès !");
      
      // Réinitialisation des champs mot de passe
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        name: response.user.name || prev.name,
        email: response.user.email || prev.email
      }));

    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.error || "Erreur lors de la mise à jour";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />
      
      <main className="ml-64">
        <ClientHeader 
          title="Paramètres" 
          subtitle="Gérez vos informations personnelles et votre sécurité"
        />
        
        <div className="p-6 max-w-4xl">
          {/* On définit 'security' comme onglet par défaut */}
          <Tabs defaultValue="security" className="space-y-6">
            <TabsList className="bg-secondary/50 p-1 w-auto inline-flex">
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" /> Sécurité & Profil
              </TabsTrigger>
            </TabsList>

            {/* --- ONGLET SÉCURITÉ / PROFIL --- */}
            <TabsContent value="security">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle>Mon Profil</CardTitle>
                  <CardDescription>Mettez à jour vos identifiants.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {/* Infos de base */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                    
                    {/* Changement de mot de passe */}
                    <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10 space-y-4">
                        <h4 className="text-sm font-semibold text-blue-400">Changer le mot de passe (Optionnel)</h4>
                        
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                            <Input 
                                id="currentPassword" 
                                type="password" 
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="bg-secondary/30" 
                                placeholder="Requis uniquement si vous changez de mot de passe"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleUpdateProfile} 
                    className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white" 
                    disabled={loading}
                  >
                    {loading ? "Mise à jour..." : <><Shield className="h-4 w-4" /> Sauvegarder les modifications</>}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ClientSettings;