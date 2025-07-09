import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";

import ParentProps from "@/types/common/ParentProps";
import Providers from "@/components/common/Providers";
import Titlebar from "@/components/layout/Titlebar";
import Footer from "@/components/layout/Footer";

import "@/css/globals.css";

const RootLayout = ({ children }: ParentProps) => (
    <html {...mantineHtmlProps}>
        <head>
            <ColorSchemeScript />
        </head>
        <body className="antialiased">
            <Providers>
                <div className="w-[100vw] h-[100vh] flex flex-col">
                    <Titlebar />
                    <div className="flex-grow">
                        {children}
                    </div>
                    <Footer />
                </div>
            </Providers>
        </body>
    </html>
);

export default RootLayout;