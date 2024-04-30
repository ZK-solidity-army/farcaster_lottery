"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function HomePage() {
  // workaround for removing non-auth page blinking
  // when user has connected wallet we would like to show blank page
  // until we get the account data
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 150);
  }, []);

  const account = useAccount();
  if (isLoading) {
    return null;
  }

  if (!account.isConnected) {
    return <DisconnectedHomePage />;
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center"></h1>
        </div>
      </div>
    </>
  );
}

function DisconnectedHomePage() {
  return (
    <div className="text-center flex flex-col flex-1 justify-center">
      <div className="mb-5 -mt-10">
        <div className="text-2xl">Welcome to</div>
        <h1 className="text-8xl leading-relaxed">Farcaster Lottery</h1>
        <p>Here you may find create a new lottery or join an existing one.</p>
      </div>
      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <button className="btn btn-wide btn-lg btn-primary mt-10 mx-auto block" onClick={openConnectModal}>
            Connect Wallet
          </button>
        )}
      </ConnectButton.Custom>
    </div>
  );
}
