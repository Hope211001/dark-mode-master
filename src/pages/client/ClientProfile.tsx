import React, { useEffect, useState } from 'react';
import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Mail, Phone, MapPin, TrendingUp, Save } from "lucide-react";
import { toast } from "sonner";
import { authService } from '@/services/auth.service';

const ClientProfile = () => {
  const [loading, setLoading] = useState(false);
  const [joinedDate, setJoinedDate] = useState(''); // Pour stocker la date d'inscription
  
  // State pour les données du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',   // Note: Non géré par le backend actuel
    address: ''  // Note: Non géré par le backend actuel
  });

  // 1. Charger les données au montage
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
          email: res.user.email || '',
          // Si vous ajoutez phone/address dans Supabase plus tard :
          // phone: res.user.phone || '',
          // address: res.user.address || ''
        }));

        // Formatage de la date d'inscription (ex: "Juin 2024")
        if (res.user.created_at) {
          const date = new Date(res.user.created_at);
          setJoinedDate(new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date));
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger le profil");
    }
  };

  // 2. Gestion des inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 3. Sauvegarde des modifications
  const handleSave = async () => {
    setLoading(true);
    try {
      // On envoie seulement name et email car le backend ne gère pas encore le reste
      const payload = {
        name: formData.name,
        email: formData.email
      };

      const response = await authService.updateProfile(payload);
      
      // Mise à jour locale pour être sûr
      setFormData(prev => ({
        ...prev,
        name: response.user.name || prev.name,
        email: response.user.email || prev.email
      }));

      toast.success("Profil mis à jour avec succès !");
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || "Erreur lors de la sauvegarde";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />
      
      <main className="md:ml-64 transition-[margin] duration-300">
        <ClientHeader 
          title="Mon Profil" 
          subtitle="Gérez vos informations personnelles et votre abonnement"
        />
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Mettez à jour vos informations de profil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar dynamique basé sur le nom */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-primary/30">
                        {/* Utilisation de l'API Dicebear avec le nom de l'utilisateur comme seed */}
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || 'user'}`} />
                        <AvatarFallback>{formData.name ? formData.name.substring(0, 2).toUpperCase() : 'JD'}</AvatarFallback>
                      </Avatar>
                      <Button 
                        size="icon" 
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                        variant="secondary"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {formData.name || 'Utilisateur'}
                      </h3>
                      <p className="text-sm text-muted-foreground">Investisseur immobilier</p>
                      <Badge className="mt-2 bg-primary/20 text-primary">Plan Pro</Badge>
                    </div>
                  </div>

                  {/* Formulaire */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        className="bg-secondary/50" 
                        placeholder="Votre nom"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          id="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleChange}
                          className="bg-secondary/50 pl-10" 
                          placeholder="email@exemple.com"
                        />
                      </div>
                    </div>

                    {/* Champs UI seulement (en attente de backend) */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          id="phone" 
                          type="tel" 
                          value={formData.phone} 
                          onChange={handleChange}
                          className="bg-secondary/50 pl-10" 
                          placeholder="+33 6..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Ville principale</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                          id="address" 
                          value={formData.address} 
                          onChange={handleChange}
                          className="bg-secondary/50 pl-10" 
                          placeholder="Paris, France"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full gap-2" 
                    onClick={handleSave} 
                    disabled={loading}
                  >
                    {loading ? "Sauvegarde..." : <><Save className="h-4 w-4" /> Sauvegarder les modifications</>}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Stats (Données statiques pour l'exemple, sauf "Membre depuis") */}
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Membre depuis</span>
                    <span className="text-sm font-medium text-foreground capitalize">
                        {joinedDate || '...'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Leads traités</span>
                    <span className="text-sm font-medium text-foreground mono">156</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Taux de conversion</span>
                    <span className="text-sm font-medium text-success mono">12%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Emails envoyés</span>
                    <span className="text-sm font-medium text-foreground mono">342</span>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="glass-card border-destructive/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-destructive">Zone de danger</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10">
                    Désactiver le compte
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Cette action suspendra votre abonnement et masquera vos données.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Background Glow Effects */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default ClientProfile;