"use client";

import Image from "next/image";
import React from "react";
import {BtnSession} from "./BtnSession";
import {useAuth} from "@/app/dashboard/users/hooks/useAuth";
import {useLogout} from "@/hooks/useLogout";

const Navbar = () => {
    const {user} = useAuth();
    const {logout, isLoggingOut} = useLogout("/login");

    return (
        <div
            className="w-full flex items-center content-center justify-between px-20 z-10 fixed h-16 backdrop-blur-sm"
        >
            <Image
                src={"/logo.png"}
                alt="Logo"
                width={50}
                height={50}
            />
            {!user ? (
                <BtnSession href="/login">Iniciar Sesión</BtnSession>
            ) : (
                <div className="flex gap-2">
                    <BtnSession href="/dashboard">Ir a Dashboard</BtnSession>
                    <BtnSession onClick={() => logout()}>

                        {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
                    </BtnSession>
                </div>
            )}
        </div>
    );
};

export default Navbar;