import { frames } from "./frames";
import { Button } from "frames.js/next";

const handler = frames(async () => {
  return {
    image: (
      <div tw="w-full h-full justify-center items-center flex flex-col">
        <div>Welcome to Farcaster Lottery</div>
        <div tw="italic text-2xl">You may create your own lottery for your followers</div>
      </div>
    ),
    textInput: "Lottery name",
    buttons: [
      <Button key={0} action="post" target="/lottery/list">
        List my lotteries
      </Button>,
      <Button key={1} action="tx" target="/lottery/create/txdata" post_url="/lottery/create">
        Create a Lottery
      </Button>,
    ],
  };
});

export const GET = handler;
export const POST = handler;
