"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form";
import {UsersService} from "@/app/dashboard/users/services/users.service";
import {UserCreateSchema} from "@/app/dashboard/users/schemas/users.schemas";
import type {z} from "zod";
import {toast} from "sonner";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: () => void;
};

type FormValues = z.infer<typeof UserCreateSchema>;

export function CreateUserModal({open, onOpenChange, onCreated}: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(UserCreateSchema),
        defaultValues: {
            userName: "",
            password: "",
            role: "WORKER",
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            setIsSubmitting(true);
            await UsersService.createUser(values);
            toast.success("Usuario creado correctamente");
            form.reset();
            onOpenChange(false);
            onCreated?.();
        } catch (error) {
            console.error(error);
            toast.error("No se pudo crear el usuario");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => !isSubmitting && onOpenChange(v)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear usuario</DialogTitle>
                    <DialogDescription>Registra un nuevo usuario en el sistema.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="userName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Usuario</FormLabel>
                                    <FormControl>
                                        <Input placeholder="ej. juan.perez" {...field} />
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
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Contraseña segura" {...field} />
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
                                                <SelectValue placeholder="Selecciona un rol"/>
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
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}
                                    disabled={isSubmitting}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Creando..." : "Crear"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}