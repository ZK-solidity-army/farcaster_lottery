import { Button } from "frames.js/next";
import { frames } from "~~/app/frames/frames";

const handler = frames(async ({ searchParams: { chainId, address }, url: { href } }) => {
  return {
    image: (
      <div tw="w-full h-full justify-center items-center flex flex-col">
        <div>Participate in Lottery</div>
        <div tw="flex justify-between text-2xl">
          <span>chainId:</span>
          <span>{chainId}</span>
        </div>
        <div tw="flex justify-around text-2xl">
          <span>address:</span>
          <span>{address}</span>
        </div>
      </div>
    ),
    buttons: [
      <Button key={0} action="post" target={href}>
        Refresh
      </Button>,
      <Button
        key={1}
        action="tx"
        target={{ query: { chainId: chainId, address: address }, pathname: "/lottery/bet/txdata" }}
        post_url={{ query: { chainId: chainId, address: address }, pathname: "/lottery/bet" }}
      >
        Bet
      </Button>,
    ],
  };
});

export const GET = handler;
export const POST = handler;
