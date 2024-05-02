import React from "react";
import { hardhat } from "viem/chains";
import { HeartIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/src/components/SwitchTheme";
import { useTargetNetwork } from "~~/src/hooks/scaffold-eth/useTargetNetwork";

export const Footer = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0 z-10">
      <div className="fixed flex justify-end items-center w-full  p-4 bottom-0 left-0 pointer-events-none">
        <SwitchTheme className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} />
      </div>
      <ul className="menu menu-horizontal w-full ">
        <div className="flex justify-center items-center gap-2 text-sm w-full">
          <div className="text-center">
            <a
              href="https://github.com/ZK-solidity-army/farcaster_lottery"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              Fork me
            </a>
          </div>
          <span>|</span>
          <div className="flex justify-center items-center gap-2">
            <p className="m-0 text-center">Read our</p>
            <a
              className="flex justify-center items-center gap-1"
              href="https://farcaster-lottery.gitbook.io/docs/"
              target="_blank"
              rel="noreferrer"
            >
              <span className="link">Guide</span>
            </a>
          </div>
          <span>|</span>
          <div className="flex justify-center items-center gap-2">
            <p className="m-0 text-center">
              Built with <HeartIcon className="inline-block h-4 w-4" /> at
            </p>
            <a
              className="flex justify-center items-center gap-1"
              href="https://www.encode.club/solidity-bootcamps"
              target="_blank"
              rel="noreferrer"
            >
              <span className="link">Encode Solidity Bootcamp</span>
            </a>
          </div>
          <span>|</span>
          <div className="flex justify-center items-center gap-2">
            <p className="m-0 text-center">Thanks to</p>
            <a
              className="flex justify-center items-center gap-1"
              href="https://scaffoldeth.io/"
              target="_blank"
              rel="noreferrer"
            >
              <span className="link">Scaffold ETH2</span>
            </a>
          </div>
        </div>
      </ul>
    </div>
  );
};
