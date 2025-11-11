import type { Metadata } from "next/types";
import { siteConfig } from "@/config/site";

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    metadataBase: new URL(siteConfig.url.base),
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      title: override.title ?? siteConfig.name,
      description: override.description ?? siteConfig.description,
      url: siteConfig.url.base,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
      ...override.openGraph,
    },
    twitter: {
      card: siteConfig.twitterCard as "summary_large_image",
      creator: siteConfig.author,
      title: override.title ?? siteConfig.name,
      description: override.description ?? siteConfig.description,
      images: [
        {
          url: siteConfig.ogImage,
          alt: siteConfig.name,
        },
      ],
      ...override.twitter,
    },
    verification: {
      google: "",
    },
    other: {
      "msapplication-TileColor": "#ffffff",
      "msapplication-TileImage": "/mstile-144x144.png",
      "msapplication-config": "/browserconfig.xml",
      "theme-color": "#ffffff",
      "application-name": siteConfig.name,
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": siteConfig.name,
      "mobile-web-app-capable": "yes",
    },
  };
}