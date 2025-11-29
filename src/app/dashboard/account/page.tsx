import {redirect} from "next/navigation";
import {getServerAuthSession} from "@/lib/auth/auth";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {IconUser, IconShieldCheck, IconId} from "@tabler/icons-react";
import BadgeTagRole from "@/components/ui/BadgeTagRole";

function generateAvatar(userName: string | undefined) {
    if (!userName) return "U";
    return userName.slice(0, 2).toUpperCase();
}

export default async function AccountPage() {
    const session = await getServerAuthSession();

    if (!session || !session.user) {
        // Si no hay sesión, lo mandamos a login
        redirect("/login");
    }

    const user = session.user;

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                            <IconUser className="h-6 w-6 text-orange-600"/>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Mi cuenta</h1>
                            <p className="text-sm text-muted-foreground">
                                Información básica de tu perfil y rol en el sistema.
                            </p>
                        </div>
                    </div>
                </div>

                <Card className="flex flex-col md:flex-row md:items-stretch">
                    <CardHeader className="flex flex-row items-center gap-4 md:w-1/3">
                        <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-orange-500 text-white">
                                {generateAvatar(user.userName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <CardTitle>{user.userName}</CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 md:w-2/3 md:border-l md:border-border">
                        <div className="flex items-center gap-2 text-sm">
                            <IconId className="h-4 w-4 text-muted-foreground"/>
                            <span className="text-muted-foreground">
                                Identificador interno:{" "}
                                <span className="font-mono">{user.userId}</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <IconShieldCheck className="h-4 w-4 text-muted-foreground"/>
                            <span className="text-muted-foreground flex items-center gap-2">
                                Rol en el sistema:
                                <BadgeTagRole role={user.role}/>
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}