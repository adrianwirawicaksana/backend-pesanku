"use client";

import GoogleOAuthProviderWrapper from "./GoogleOAuthProvider";

export default function BodyWithProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProviderWrapper>
      {children}
    </GoogleOAuthProviderWrapper>
  );
}