"use client";
import React from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {http} from "@/lib/api/http";
import type {UserLoginResponse} from "@/lib/auth/types";
import {z} from "zod";
import {LoginSchema} from "@/app/login/schema/login.schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {IconArrowNarrowLeft} from '@tabler/icons-react';
import Image from "next/image";

type LoginRouteResponse = { user: UserLoginResponse };
type FormValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = React.useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {userName: "", password: ""},
        mode: "onSubmit",
    });

    const onSubmit = async (values: FormValues) => {
        setError(null);
        try {
            await http<LoginRouteResponse>("", "/api/auth/login", {
                method: "POST",
                body: JSON.stringify(values),
            });
            const from = searchParams.get("from") || "/dashboard";
            router.replace(from);
        } catch (e: any) {
            setError(e?.message || "Credenciales inválidas");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4"
             style={{
                 backgroundColor: '#F5D547',
                 backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.6) 1px, transparent 1px)
      `,
                 backgroundSize: '60px 60px'
             }}
        >
            <Card className="w-full max-w-sm">
                <Image src="/logo.png" alt="Logo" width={60} height={60} className="mx-auto"/>
                <CardHeader className="flex items-start justify-start">
                    <div>
                        <IconArrowNarrowLeft className="h-6 w-6 text-[#FB8C00] cursor-pointer border-2 rounded-2xl"
                                             onClick={() => router.push("/")}/>
                    </div>
                    <div>
                        <CardTitle>Iniciar sesión</CardTitle>
                        <CardDescription>Accede a tu cuenta para continuar</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : null}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="userName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Usuario</FormLabel>
                                        <FormControl>
                                            <Input placeholder="usuario" autoComplete="username" {...field} />
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
                                            <Input type="password" placeholder="••••••"
                                                   autoComplete="current-password" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full bg-[#FB8C00]"
                                    disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Iniciando..." : "Iniciar sesión"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                    Al continuar aceptas nuestras políticas de uso.
                </CardFooter>
            </Card>
        </div>
    );
}
