"use client";
import React from "react";
import {useRouter, useSearchParams} from "next/navigation";
import { signIn } from "next-auth/react";
import {z} from "zod";
import {LoginSchema} from "@/app/login/schema/login.schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {
    IconArrowNarrowLeft,
    IconUser,
    IconLock,
    IconEye,
    IconEyeOff,
} from "@tabler/icons-react";
import Image from "next/image";

type FormValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = React.useState<string | null>(null);
    const [showPassword, setShowPassword] = React.useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(LoginSchema),
        defaultValues: { userName: "", password: "" },
        mode: "onSubmit",
    });

    const onSubmit = async (values: FormValues) => {
        setError(null);

        const callbackUrl = searchParams.get("from") || "/dashboard";

        const res = await signIn("credentials", {
            redirect: false,
            userName: values.userName,
            password: values.password,
            callbackUrl,
        });

        if (res?.error) {
            // Puedes afinar el mensaje en base a res.error si quieres
            setError("Credenciales inválidas");
            return;
        }

        if (res?.ok) {
            router.replace(res.url ?? callbackUrl);
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center p-4"
            style={{
                backgroundColor: "#F5D547",
                backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.6) 1px, transparent 1px)
        `,
                backgroundSize: "60px 60px",
            }}
        >
            <Card className="w-full max-w-md rounded-2xl shadow-2xl border-0 bg-white/95">
                <CardHeader className="flex flex-col items-center gap-3 pb-4">
                    <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center -mt-8">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={72}
                            height={72}
                            className="rounded-full"
                        />
                    </div>
                    <CardTitle className="text-2xl font-extrabold text-[#F4511E] tracking-tight">
                        FastFoodControl
                    </CardTitle>
                    <CardDescription className="text-center text-sm">
                        Inicia sesión para gestionar tu punto de venta
                    </CardDescription>
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="absolute left-4 top-4 inline-flex items-center justify-center rounded-full border border-orange-300 bg-white/80 p-1.5 text-[#FB8C00] hover:bg-orange-50 transition-colors"
                    >
                        <IconArrowNarrowLeft className="h-4 w-4"/>
                    </button>
                </CardHeader>

                <CardContent className="pt-0">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="userName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel
                                            className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            Usuario
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span
                                                    className="absolute inset-y-0 left-3 flex items-center text-[#FB8C00]">
                                                    <IconUser className="h-4 w-4"/>
                                                </span>
                                                <Input
                                                    placeholder="Ingresa tu nombre de usuario"
                                                    autoComplete="username"
                                                    className="pl-9 h-11 rounded-lg border-gray-200 focus-visible:ring-[#FB8C00]"
                                                    {...field}
                                                />
                                            </div>
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
                                        <FormLabel
                                            className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                            Contraseña
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span
                                                    className="absolute inset-y-0 left-3 flex items-center text-[#FB8C00]">
                                                    <IconLock className="h-4 w-4"/>
                                                </span>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Ingresa tu contraseña"
                                                    autoComplete="current-password"
                                                    className="pl-9 pr-10 h-11 rounded-lg border-gray-200 focus-visible:ring-[#FB8C00]"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword((prev) => !prev)
                                                    }
                                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? (
                                                        <IconEyeOff className="h-4 w-4"/>
                                                    ) : (
                                                        <IconEye className="h-4 w-4"/>
                                                    )}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-11 rounded-full bg-gradient-to-r from-[#FF9800] to-[#FF6D00] hover:from-[#FB8C00] hover:to-[#F4511E] text-white font-semibold shadow-md border-0"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? "Iniciando..."
                                    : "Iniciar Sesión"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>

                <CardFooter className="flex justify-center pt-0 pb-4">
                    <p className="text-[11px] text-center text-muted-foreground">
                        Al continuar aceptas nuestras políticas de uso.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}