import { ClientSidebar } from "@/components/client/ClientSidebar";
import { ClientHeader } from "@/components/client/ClientHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, Mail, Bell, Shield, Palette, Save } from "lucide-react";

const ClientSettings = () => {
  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />
      
      <main className="ml-64">
        <ClientHeader 
          title="Paramètres" 
          subtitle="Configurez vos préférences de recherche et notifications"
        />
        
        <div className="p-6">
          <Tabs defaultValue="filters" className="space-y-6">
            <TabsList className="bg-secondary">
              <TabsTrigger value="filters" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </TabsTrigger>
              <TabsTrigger value="emails" className="gap-2">
                <Mail className="h-4 w-4" />
                Emails
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                Sécurité
              </TabsTrigger>
            </TabsList>

            {/* Filters Tab */}
            <TabsContent value="filters" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Critères de recherche</CardTitle>
                  <CardDescription>
                    Définissez les critères pour filtrer automatiquement les leads
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Surface */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Surface minimum</Label>
                      <Badge variant="secondary" className="mono">25 m²</Badge>
                    </div>
                    <Slider defaultValue={[25]} max={200} step={5} className="w-full" />
                  </div>

                  {/* Budget */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget-min">Loyer minimum</Label>
                      <Input id="budget-min" type="number" placeholder="500" className="bg-secondary/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget-max">Loyer maximum</Label>
                      <Input id="budget-max" type="number" placeholder="2000" className="bg-secondary/50" />
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="space-y-2">
                    <Label>Type de bien</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="bg-secondary/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="apartment">Appartement</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="house">Maison</SelectItem>
                        <SelectItem value="loft">Loft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Score Minimum */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Score minimum</Label>
                      <Badge variant="secondary" className="mono bg-success/20 text-success">70%</Badge>
                    </div>
                    <Slider defaultValue={[70]} max={100} step={5} className="w-full" />
                  </div>

                  <Button className="w-full gap-2">
                    <Save className="h-4 w-4" />
                    Sauvegarder les filtres
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Emails Tab */}
            <TabsContent value="emails" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Modèles d'emails</CardTitle>
                  <CardDescription>
                    Personnalisez les messages envoyés aux propriétaires
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email-subject">Objet de l'email</Label>
                    <Input 
                      id="email-subject" 
                      defaultValue="Proposition de location pour votre bien"
                      className="bg-secondary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-body">Corps du message</Label>
                    <Textarea 
                      id="email-body"
                      className="bg-secondary/50 min-h-48"
                      defaultValue={`Bonjour,

Je me permets de vous contacter concernant votre annonce pour le bien situé à {adresse}.

Je suis très intéressé(e) par cette location et j'aimerais en savoir plus sur les conditions.

Cordialement,
{signature}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signature">Signature</Label>
                    <Textarea 
                      id="signature"
                      className="bg-secondary/50"
                      defaultValue="Jean Dupont - Investisseur immobilier"
                    />
                  </div>

                  <Button className="w-full gap-2">
                    <Save className="h-4 w-4" />
                    Sauvegarder le modèle
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Préférences de notification</CardTitle>
                  <CardDescription>
                    Choisissez comment et quand être notifié
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Nouveaux leads</p>
                      <p className="text-sm text-muted-foreground">Notification immédiate pour chaque nouveau lead</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Réponses reçues</p>
                      <p className="text-sm text-muted-foreground">Alerte quand un propriétaire répond</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Rapport hebdomadaire</p>
                      <p className="text-sm text-muted-foreground">Résumé de votre activité chaque lundi</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Alertes concurrence</p>
                      <p className="text-sm text-muted-foreground">Notification quand d'autres regardent vos zones</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Promotions & nouveautés</p>
                      <p className="text-sm text-muted-foreground">Actualités du service PropHunter</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Sécurité du compte</CardTitle>
                  <CardDescription>
                    Gérez la sécurité de votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <Input id="current-password" type="password" className="bg-secondary/50" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nouveau mot de passe</Label>
                      <Input id="new-password" type="password" className="bg-secondary/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmer</Label>
                      <Input id="confirm-password" type="password" className="bg-secondary/50" />
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Changer le mot de passe
                  </Button>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Authentification 2FA</p>
                        <p className="text-sm text-muted-foreground">Protection supplémentaire pour votre compte</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Background Glow Effects */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default ClientSettings;
