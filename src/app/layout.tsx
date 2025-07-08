import { Metadata } from "next";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";

import ParentProps from "@/types/common/ParentProps";
import Providers from "@/components/common/Providers";

import "@/css/globals.css";

// https://seostudio.tools/meta-tag-generator
// https://www.searchenginejournal.com/important-tags-seo/156440/

export const metadata = {
    title: "Frontend template",
    description: "My preferred template for frontend projects - tailored to my needs",
    applicationName: "Frontend template",
    authors: [{
        url: "https://lars.kvihaugen.no",
        name: "Lars Kvihaugen"
    }],
    generator: "Next.js",
    keywords: [
        "next.js",
        "next",
        "react",
        "frontend",
        "development",
        "dev"
    ],
    referrer: "origin",
    creator: "Lars Kvihaugen",
    publisher: "Lars Kvihaugen",
    robots: {
        index: true,
        follow: true
    },
    alternates: {
        canonical: "https://frontend-template.kvihaugen.no",
        languages: {
            en: "https://frontend-template.kvihaugen.no",
            no: "https://no.frontend-template.kvihaugen.no"
        }
    },
    icons: {
        icon: [{
            url: "/icons/icon-128x128.png",
            sizes: "128x128"
        }],
        apple: [{
            url: "/icons/icon-apple/128x128.png",
            sizes: "128x128"
        }]
    },
    manifest: "/.well-known/app.webmanifest",
    openGraph: {
        type: "website",
        title: "Frontend template",
        description: "My preferred template for frontend projects - tailored to my needs",
        emails: ["lars@kvihaugen.no"],
        phoneNumbers: ["+00 000 00 000"],
        siteName: "Frontend template",
        locale: "en",
        alternateLocale: ["no"],
        images: [{
            url: "/images/hero.png",
            alt: "The page hero",
            width: 1920,
            height: 1080
        }],
        url: "https://frontend-template.kvihaugen.no"
    },
    metadataBase: new URL("https://frontend-template.kvihaugen.no")
} satisfies Metadata as Metadata;

const RootLayout = ({ children }: ParentProps) => (
    <html {...mantineHtmlProps}>
        <head>
            <ColorSchemeScript />
        </head>
        <body className="antialiased">
            <Providers>
                {children}
            </Providers>
        </body>
    </html>
);

export default RootLayout;