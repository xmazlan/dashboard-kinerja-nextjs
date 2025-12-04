import { AlertCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ButtonBack from "@/components/auth/button-back";

export default async function ProhibitedPage() {
  const session = await getServerSession(authOptions);
  const role = session?.data?.user?.role;
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-center">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Akses Dilarang
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan
          hubungi administrator jika Anda merasa ini adalah kesalahan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <ButtonBack />
        </div>
        <div className="text-xs text-muted-foreground space-y-2">
          <p>
            © {new Date().getFullYear()} Kominfo Kota Pekanbaru. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
