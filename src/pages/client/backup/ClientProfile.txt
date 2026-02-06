import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, Mail, Phone, MapPin, Calendar, CreditCard, TrendingUp, Save } from "lucide-react";

const ClientProfile = () => {
  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />
      
      <main className="ml-64">
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
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-primary/30">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=client" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <Button 
                        size="icon" 
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Jean Dupont</h3>
                      <p className="text-sm text-muted-foreground">Investisseur immobilier</p>
                      <Badge className="mt-2 bg-primary/20 text-primary">Plan Pro</Badge>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" defaultValue="Jean" className="bg-secondary/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" defaultValue="Dupont" className="bg-secondary/50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        defaultValue="jean.dupont@email.com" 
                        className="bg-secondary/50 pl-10" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        id="phone" 
                        type="tel" 
                        defaultValue="+33 6 12 34 56 78" 
                        className="bg-secondary/50 pl-10" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Ville principale</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        id="address" 
                        defaultValue="Lyon, France" 
                        className="bg-secondary/50 pl-10" 
                      />
                    </div>
                  </div>

                  <Button className="w-full gap-2">
                    <Save className="h-4 w-4" />
                    Sauvegarder les modifications
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Subscription */}
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Abonnement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Plan actuel</span>
                      <Badge className="bg-primary text-primary-foreground">Pro</Badge>
                    </div>
                    <div className="text-2xl font-bold text-foreground">49€<span className="text-sm font-normal text-muted-foreground">/mois</span></div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Zones exclusives</span>
                      <span className="text-foreground font-medium">4 / 5</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Renouvellement: 15 Février 2025</span>
                  </div>

                  <Button variant="outline" className="w-full">
                    Gérer l'abonnement
                  </Button>
                </CardContent>
              </Card>

              {/* Stats */}
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
                    <span className="text-sm font-medium text-foreground">Juin 2024</span>
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
