import ExpensesModule from "./components/ExpensesModule";
import {redirect} from "next/navigation";
import {IconAlertTriangle} from "@tabler/icons-react";
import {getServerAuthSession} from "@/lib/auth/auth";
import {Role} from "@/lib/auth/types";

export default async function ExpensesPage() {
    const session = await getServerAuthSession();

    // Si no hay sesión, redirigimos a login
    if (!session) redirect("/login");

    const role = session.user.role as Role;

    // Solo ADMIN puede ver/generar gastos
    if (role !== "ADMIN") {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-md mx-auto bg-white rounded-lg border shadow-sm p-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-amber-600">
                        <IconAlertTriangle className="h-5 w-5"/>
                        <h1 className="font-semibold text-lg">Acceso restringido</h1>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Solo los usuarios con rol <span className="font-semibold">ADMIN</span> pueden
                        gestionar gastos.
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className='p-4 flex flex-col gap-5'>
            <ExpensesModule role={role}/>
        </div>
    )
}