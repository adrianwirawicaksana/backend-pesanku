import BodyWithProvider from "./components/BodyWithProvider";
import GoogleOAuthProviderWrapper from "./components/GoogleOAuthProvider";

export const metadata = {
  title: "Pesanku App",
  description: "Aplikasi Pesanku untuk mengirim pesan dengan mudah",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProviderWrapper>
          <BodyWithProvider>{children}</BodyWithProvider>
        </GoogleOAuthProviderWrapper>
      </body>
    </html>
  );
}