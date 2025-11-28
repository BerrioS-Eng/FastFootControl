"use client";

import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form";
import {UsersService} from "@/app/dashboard/users/services/users.service";
import {UserEditSchema} from "@/app/dashboard/users/schemas/users.schemas";
import type {z} from "zod";
import type {UserDTO} from "@/lib/auth/types";
import {toast} from "sonner";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: UserDTO | null;
    onUpdated?: () => void;
};

type FormValues = z.infer<typeof UserEditSchema>;

export function EditUserModal({open, onOpenChange, user, onUpdated}: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(UserEditSchema),
        defaultValues: {
            userName: "",
            password: "",
            role: "WORKER",
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                userName: user.userName,
                password: "",
                role: user.role,
            });
        }
    }, [user, form]);

    const onSubmit = async (values: FormValues) => {
        if (!user) return;
        try {
            setIsSubmitting(true);
            const payload: FormValues = {
                userName: values.userName,
                role: values.role,
                password: values.password || undefined,
            };
            await UsersService.editUser(user.userId, payload);
            toast.success("Usuario actualizado correctamente");
            onOpenChange(false);
            onUpdated?.();
        } catch (error) {
            console.error(error);
            toast.error("No se pudo actualizar el usuario");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !isSubmitting && onOpenChange(v)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar usuario</DialogTitle>
                    <DialogDescription>Modifica los datos del usuario seleccionado.</DialogDescription>
                </DialogHeader>

                {user && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="userName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Usuario</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Nueva contraseña (opcional)</FormLabel>
                                        <FormControl>
                                            <Input type="password"
                                                   placeholder="Dejar vacío para no cambiar" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Rol</FormLabel>
                                        <FormControl>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                                                    <SelectItem value="WORKER">WORKER</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onOpenChange(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-[#FB8C00] hover:bg-[#f57c00]"
                                >
                                    {isSubmitting ? "Guardando..." : "Guardar cambios"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}