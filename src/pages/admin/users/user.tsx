import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit, Loader2, Search, Lock, Ban, UserCheck, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userService, User, UserRole, UserStatus } from "@/services/user.services";
import { useToast } from "@/components/ui/use-toast";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import Swal from 'sweetalert2';

interface UserFormData {
    name: string;
    email: string;
    role: UserRole;
    statut: UserStatus;
    password?: string;
    confirmPassword?: string;
}

const ListUser = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const [formData, setFormData] = useState<UserFormData>({
        name: "", email: "", role: "client", statut: "ACTIF", password: "", confirmPassword: ""
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAll(currentPage, 10, searchTerm, statusFilter, roleFilter);
            setUsers(response.data);
            setTotalPages(response.totalPages);
            setTotalCount(response.totalCount);
        } catch (error) {
            toast({ title: "Erreur", description: "Impossible de charger les données", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(fetchUsers, 400);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm, currentPage, statusFilter, roleFilter]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser && formData.password !== formData.confirmPassword) {
            return Swal.fire("Erreur", "Mots de passe différents", "error");
        }

        try {
            if (editingUser) {
                await userService.update(editingUser.id, formData);
                toast({ title: "Succès", description: "Utilisateur mis à jour" });
            } else {
                await userService.create(formData);
                Swal.fire("Succès", "Utilisateur créé, email d'activation envoyé.", "success");
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error: any) {
            Swal.fire("Erreur", error.response?.data?.error || "Action échouée", "error");
        }
    };

    const handleBlock = async (id: string, currentStatus: string) => {
        const action = currentStatus === 'BLOQUE' ? 'réactiver' : 'bloquer';
        const result = await Swal.fire({
            title: `Voulez-vous ${action} cet utilisateur ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            confirmButtonColor: '#f97316'
        });

        if (result.isConfirmed) {
            try {
                await userService.blocked(id);
                toast({ title: "Succès", description: `Utilisateur ${action}é` });
                fetchUsers();
            } catch (error) {
                toast({ title: "Erreur", description: "Action impossible", variant: "destructive" });
            }
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Supprimer définitivement ?',
            text: "L'utilisateur sera masqué de la plateforme.",
            icon: 'error',
            showCancelButton: true,
            confirmButtonText: 'Supprimer',
            confirmButtonColor: '#ef4444'
        });

        if (result.isConfirmed) {
            try {
                await userService.delete(id);
                fetchUsers();
            } catch (error) {
                toast({ title: "Erreur", description: "Suppression impossible", variant: "destructive" });
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 md:ml-64 transition-[margin] duration-300 p-4 md:p-6 space-y-6">
                <Header title="Utilisateurs" subtitle="Gestion des comptes utilisateurs" />
                <div className="flex justify-end">
                    <Button onClick={() => { setEditingUser(null); setIsModalOpen(true); }} className="gap-2">
                        <Plus className="h-4 w-4" /> Ajouter
                    </Button>
                </div>

                <div className="flex gap-4 bg-card p-4 rounded-xl border shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Rechercher..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Rôle" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les rôles</SelectItem>
                            <SelectItem value="client">Client</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Statut" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous (actifs)</SelectItem>
                            <SelectItem value="ACTIF">Actifs</SelectItem>
                            <SelectItem value="BLOQUE">Bloqués</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="border rounded-xl bg-card/50 backdrop-blur-sm overflow-hidden shadow-lg border-border">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="hover:bg-transparent border-border">
                                <TableHead className="text-muted-foreground font-bold">Utilisateur</TableHead>
                                <TableHead className="text-muted-foreground font-bold">Rôle</TableHead>
                                <TableHead className="text-muted-foreground font-bold">Leads</TableHead>
                                <TableHead className="text-muted-foreground font-bold">Statut</TableHead>
                                <TableHead className="text-right text-muted-foreground font-bold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-20">
                                        <Loader2 className="animate-spin mx-auto text-primary h-8 w-8" />
                                        <p className="text-sm text-muted-foreground mt-2">Chargement des données...</p>
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                                        Aucun utilisateur trouvé.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((u) => (
                                    <TableRow
                                        key={u.id}
                                        // hover:bg-muted/50 fonctionne parfaitement en dark et light mode
                                        className="hover:bg-muted/40 transition-colors border-border"
                                    >
                                        <TableCell>
                                            <div className="flex flex-col">
                                                {/* text-foreground s'adapte (blanc en dark, noir en light) */}
                                                <span className="font-semibold text-foreground tracking-tight">
                                                    {u.name}
                                                </span>
                                                {/* text-muted-foreground pour le texte secondaire */}
                                                <span className="text-xs text-muted-foreground">
                                                    {u.email}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant="outline" className={`font-medium ${u.role === 'admin'
                                                ? "border-amber-500/20 bg-amber-500/10 text-amber-500"
                                                : "border-cyan-500/20 bg-cyan-500/10 text-cyan-500"
                                            }`}>
                                                {u.role}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 border-0 h-7 text-xs font-bold"
                                                onClick={() => navigate(`/admin/user/${u.id}/leads?name=${encodeURIComponent(u.name)}`)}
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                {u.leads_count || 0} leads
                                            </Button>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant={u.statut === 'ACTIF' ? "default" : "secondary"}
                                                className={
                                                    u.statut === 'ACTIF'
                                                        ? "bg-clay-500/15 text-clay-500 hover:bg-clay-500/25 border-clay-500/20"
                                                        : u.statut === 'BLOQUE'
                                                            ? "bg-orange-500/15 text-orange-500 hover:bg-orange-500/25 border-orange-500/20"
                                                            : ""
                                                }
                                            >
                                                {u.statut}
                                            </Badge>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                                <Button
                                                    size="sm"
                                                    className="gap-1.5 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-0 h-7 text-xs"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setEditingUser(u);
                                                        setFormData({ name: u.name, email: u.email, role: u.role, statut: u.statut });
                                                        setIsModalOpen(true);
                                                    }}
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                    Modifier
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className={`gap-1.5 h-7 text-xs border-0 ${u.statut === 'BLOQUE'
                                                        ? "bg-clay-500/10 text-clay-500 hover:bg-clay-500/20"
                                                        : "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                                                    }`}
                                                    onClick={() => handleBlock(u.id, u.statut)}
                                                >
                                                    {u.statut === 'BLOQUE' ? <UserCheck className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                                                    {u.statut === 'BLOQUE' ? 'Réactiver' : 'Bloquer'}
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="gap-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 border-0 h-7 text-xs"
                                                    onClick={() => handleDelete(u.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Supprimer
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    <div className="bg-muted/30 p-4 border-t border-border">
                        <DataTablePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalCount={totalCount}
                            onPageChange={setCurrentPage}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* MODALE CREATE / UPDATE */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="sm:max-w-[450px]">
                        <form onSubmit={handleSave} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle>{editingUser ? "Modifier" : "Créer"}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-3">
                                <div><Label>Nom</Label><Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                                <div><Label>Email</Label><Input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>

                                {!editingUser && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div><Label>Mot de passe</Label><Input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} /></div>
                                        <div><Label>Confirmation</Label><Input type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} /></div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label>Rôle</Label>
                                        <Select value={formData.role} onValueChange={(v: UserRole) => setFormData({ ...formData, role: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="client">Client</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Statut</Label>
                                        <Select value={formData.statut} onValueChange={(v: UserStatus) => setFormData({ ...formData, statut: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIF">Actif</SelectItem>
                                                <SelectItem value="BLOQUE">Bloqué</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter><Button type="submit" className="w-full">{editingUser ? "Mettre à jour" : "Créer l'utilisateur"}</Button></DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
};

export default ListUser;