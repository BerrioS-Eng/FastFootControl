import React from "react";
import {Badge} from "@/components/ui/badge";
import type {Role} from "@/lib/auth/types";

type BadgeTagRoleProps = {
    role: Role;
};

const BadgeTagRole: React.FC<BadgeTagRoleProps> = ({role}) => {
    const roleColor =
        role === "ADMIN" ? "bg-red-500 text-white" : "bg-blue-500 text-white";

    const roleLabel = role === "ADMIN" ? "Administrador" : "Trabajador";

    return <Badge className={roleColor}>{roleLabel}</Badge>;
};

export default BadgeTagRole;