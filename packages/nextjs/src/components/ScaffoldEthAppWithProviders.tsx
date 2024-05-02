"use client";

import { useEffect, useState } from "react";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { WagmiProvider, useAccount } from "wagmi";
import { DARK_THEME } from "~~/config";
import { Footer } from "~~/src/components/Footer";
import { Header } from "~~/src/components/Header";
import { BlockieAvatar } from "~~/src/components/scaffold-eth";
import { ProgressBar } from "~~/src/components/scaffold-eth/ProgressBar";
import { useNativeCurrencyPrice } from "~~/src/hooks/scaffold-eth";
import { useGlobalState } from "~~/src/services/store/store";
import { wagmiConfig } from "~~/src/services/web3/wagmiConfig";

const ScaffoldEthApp = ({ children, isDarkMode }: { children: React.ReactNode; isDarkMode: boolean }) => {
  const account = useAccount();
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }
  }, [setNativeCurrencyPrice, price]);

  console.log(isDarkMode);
  const bgClassName = "";
  /*
  const bgClassName = !isDarkMode
    ? "bg-gradient-to-r from-teal-400 to-yellow-200"
    : "bg-gradient-to-r from-slate-900 to-slate-700";
    */

  return (
    <>
      <div className={twMerge("flex flex-col min-h-screen", bgClassName)}>
        {account.isConnected && <Header />}
        <main className="relative z-10 flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === DARK_THEME;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ProgressBar />
        <RainbowKitProvider
          avatar={BlockieAvatar}
          theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
        >
          <ScaffoldEthApp isDarkMode={isDarkMode}>{children}</ScaffoldEthApp>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
