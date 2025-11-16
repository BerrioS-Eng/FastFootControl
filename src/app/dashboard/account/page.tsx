import { getCurrentUser } from "@/lib/auth/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function AccountPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    return (
        <div className="p-4">
            <Card className="max-w-lg">
                <CardHeader>
                    <CardTitle>Mi cuenta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div><strong>ID:</strong> {user.userId}</div>
                    <div><strong>Usuario:</strong> {user.userName}</div>
                    <div><strong>Rol:</strong> {user.role}</div>
                </CardContent>
            </Card>
        </div>
    );
}