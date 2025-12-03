import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchemaValues, loginSchema } from "./schema-login";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
export function LoginForm({ className }: React.ComponentProps<"form">) {
  const DEMO_EMAIL =
    process.env.NEXT_PUBLIC_DUMMY_EMAIL ?? "demo@kominfo.go.id";
  const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DUMMY_PASSWORD ?? "demo123";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const addLog = (msg: string) => {
    const ts = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${ts}] ${msg}`]);
  };
  const router = useRouter();
  const form = useForm<LoginSchemaValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: LoginSchemaValues) => {
    setLoading(true);
    setError(null);
    setLogs([]);
    addLog("Memulai proses login");
    try {
      addLog("Validasi input");
      const start = Date.now();
      addLog("Mengirim request credentials ke server");
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: "/dashboard",
      });
      const ms = Date.now() - start;
      addLog(`Respons diterima dalam ${ms} ms`);
      if (result?.error) {
        const code = result.error;
        const msg = (() => {
          if (code === "CredentialsSignin")
            return "Autentikasi gagal. Periksa kredensial atau coba lagi nanti.";
          if (code === "Callback")
            return "Layanan autentikasi lambat atau tidak merespons. Silakan coba lagi.";
          if (code === "AccessDenied") return "Akses ditolak.";
          if (code === "Configuration")
            return "Konfigurasi autentikasi bermasalah.";
          return code;
        })();
        setError(msg);
        toast.error(msg);
        addLog(`Gagal: ${msg}`);
        return;
      }
      toast.success("Login berhasil. Mengalihkan...");
      addLog("Login berhasil, melakukan redirect");
      router.push(result?.url || "/dashboard");
    } catch (err) {
      const ms = logs.findLast((l) => l.includes("Respons diterima"))
        ? undefined
        : undefined;
      const raw = err as unknown as { message?: string };
      const base = raw?.message || "Terjadi kesalahan jaringan.";
      const isTimeout =
        base.toLowerCase().includes("timeout") || base.includes("504");
      const msg = isTimeout
        ? "Permintaan login melebihi batas waktu. Silakan coba lagi nanti."
        : base;
      setError(msg);
      toast.error(msg);
      addLog(`Gagal: ${msg}`);
    } finally {
      setLoading(false);
      addLog("Selesai");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label>
            Email <span className="text-red-500">*</span>
          </Label>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="nama@dinas.gov.id"
                    className="h-12 bg-card border-border focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label>
                  Password <span className="text-red-500">*</span>
                </Label>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      className=" pr-10 h-12 bg-card border-border focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
                      {...field}
                      disabled={loading}
                      required
                      autoComplete="current-password"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size={"icon"}
                            className="absolute right-0 top-0 h-full px-3 py-2"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 " />
                            ) : (
                              <Eye className="h-4 w-4 " />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {showPassword
                              ? "Sembunyikan password"
                              : "Tampilkan password"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Demo credentials hint + autofill */}
        <div className="flex items-center justify-between text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg px-3 py-2.5">
          <div>
            <span className="font-semibold">Demo:</span>{" "}
            <span className="font-mono">{DEMO_EMAIL}</span> /{" "}
            <span className="font-mono">{DEMO_PASSWORD}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => {
              form.setValue("email", DEMO_EMAIL, { shouldValidate: true });
              form.setValue("password", DEMO_PASSWORD, {
                shouldValidate: true,
              });
            }}
          >
            Isi demo
          </Button>
        </div>

        {/* <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-border bg-card cursor-pointer accent-blue-600"
          />
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            Ingat saya
          </span>
        </label>
        <a
          href="#"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Lupa password?
        </a>
      </div> */}

        {error && (
          <div
            className="text-sm text-red-700 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg px-4 py-3 animate-shake"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          disabled={loading}
        >
          {loading ? (
            <span className="inline-flex items-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...
            </span>
          ) : (
            "Masuk"
          )}
        </Button>

        <div className="mt-4 bg-card border rounded-lg">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <span className="text-xs font-semibold text-muted-foreground">
              Log proses
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setLogs([])}
              >
                Bersihkan
              </Button>
            </div>
          </div>
          <ScrollArea className="max-h-48">
            <div className="px-3 py-2 font-mono text-[11px] leading-relaxed space-y-1">
              {logs.length === 0 ? (
                <div className="text-muted-foreground">Belum ada log</div>
              ) : (
                logs.map((l, i) => (
                  <div key={i} className="text-foreground/90">
                    {l}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </form>
    </Form>
  );
}
