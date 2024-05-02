import { Button } from "frames.js/next";
import { frames } from "~~/app/frames/frames";
import { BASE_URL } from "~~/config";

const handler = frames(async ({ searchParams: { chainId, address }, url: { href } }) => {
  const url = BASE_URL + "/img/pic2.png";

  return {
    image: (
      <div
        tw="w-full h-full justify-center items-center flex flex-col bg-gradient-to-r from-teal-400 to-yellow-200"
        style={{ background: "linear-gradient(to right, rgb(45, 212, 191), rgb(254, 240, 138))" }}
      >
        <div>Participate in Lottery</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt="lottery"
          tw="my-4"
          style={{
            borderRadius: 128,
          }}
          width="256"
          height="256"
        />
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
