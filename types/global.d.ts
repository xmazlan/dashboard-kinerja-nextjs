declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_WILAYAH: string;
      NEXT_PUBLIC_APP_NAME: string;
      NEXT_PUBLIC_APP_DESCRIPTION: string;
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_API_URL: string;
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      ARCJET_KEY: string;
    }
  }
}

export {};
