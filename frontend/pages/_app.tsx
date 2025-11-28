import "../styles/globals.css";
import type { AppProps } from "next/app";
import type { Liff } from "@line/liff";
import { useState, useEffect } from "react";
import MobileLayout from "../src/layouts/MobileLayout";

function MyApp({ Component, pageProps }: AppProps) {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    // to avoid `window is not defined` error
    console.log("Hello");
    import("@line/liff")
      .then((liff) => liff.default)
      .then((liff) => {
        console.log("LIFF init...");
        liff
          .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
          .then(() => {
            console.log("LIFF init succeeded.");
            setLiffObject(liff);
            console.log("token", liff.getIDToken());
            if (!liff.isLoggedIn()) {
              // for development
              // console.log("not login");
              // liff.login();
            }
            // use for check token
            if (liff.isLoggedIn()) {
              const idToken = liff.getIDToken();
              {
                console.log(idToken);
              }
            }
          })
          .catch((error: Error) => {
            console.log("LIFF init failed.");
            setLiffError(error.toString());
          });
      });
  }, []);

  // Provide `liff` object and `liffError` object
  // to page component as property
  pageProps.liff = liffObject;
  pageProps.liffError = liffError;
  return (
    <MobileLayout>
      <Component {...pageProps} />
    </MobileLayout>
  );
}

export default MyApp;
