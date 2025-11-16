import ExpensesModule from "./components/ExpensesModule";
import {redirect} from "next/navigation";
import {getCurrentUser} from "@/lib/auth/server";

export default async function ExpensesPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    return (
        <div className='mx-8 my-6 flex flex-col gap-5'>
            <ExpensesModule role={user.role} />
        </div>
    )
}