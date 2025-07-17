import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";

import ParentProps from "@/types/common/ParentProps";
import Providers from "@/components/common/Providers";
import Titlebar from "@/components/layout/Titlebar";
import Footer from "@/components/layout/Footer";
import ProfileWall from "@/components/layout/ProfileWall";

import "@/css/globals.css";

const RootLayout = ({ children }: ParentProps) => (
    <html {...mantineHtmlProps}>
        <head>
            <ColorSchemeScript />
        </head>
        <body className="w-[100vw] h-[100vh] antialiased overflow-hidden">
            <Providers>
                <div className="w-full h-full flex flex-col">
                    <Titlebar />
                    <div className="flex-grow overflow-auto">
                        <ProfileWall>
                            {children}
                        </ProfileWall>
                    </div>
                    <Footer />
                </div>
            </Providers>
        </body>
    </html>
);

export default RootLayout;