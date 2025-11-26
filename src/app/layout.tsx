import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";

import ParentProps from "@/types/common/ParentProps";
import Providers from "@/components/common/Providers";
import Titlebar from "@/components/layout/Titlebar";
import Footer from "@/components/layout/Footer";
import ProfileWall from "@/components/layout/ProfileWall";
import LoaderWrapper from "@/components/layout/LoaderWrapper";

import "@/css/globals.css";
import UpdaterWrapper from "@/components/layout/UpdaterWrapper";

const RootLayout = ({ children }: ParentProps) => (
    <html {...mantineHtmlProps}>
        <head>
            <ColorSchemeScript defaultColorScheme="dark" />
        </head>
        <body className="w-[100vw] h-[100vh] antialiased overflow-hidden">
            <Providers>
                <div className="w-full h-full flex flex-col">
                    <Titlebar />
                    <div className="w-[100vw] flex-grow overflow-auto">
                        <LoaderWrapper>
                            <UpdaterWrapper>
                                <ProfileWall>
                                    {children}
                                </ProfileWall>
                            </UpdaterWrapper>
                        </LoaderWrapper>
                    </div>
                    <Footer />
                </div>
            </Providers>
        </body>
    </html>
);

export default RootLayout;