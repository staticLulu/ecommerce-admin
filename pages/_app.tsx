import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { Session } from "next-auth";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes"
interface CustomAppProps extends AppProps {
  pageProps: {
    session?: Session;
    [key: string]: any;
  };
}

export default function App({ Component, pageProps: { session, ...pageProps } }: CustomAppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider value={defaultSystem}>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <Component {...pageProps} />
        </ThemeProvider>

      </ChakraProvider>
    </SessionProvider>
  );
}
