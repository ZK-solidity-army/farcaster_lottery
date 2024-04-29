import { frames } from "./frames";
import { Button } from "frames.js/next";

export const GET = frames(async () => {
  return {
    image: (
      <div tw="w-full h-full justify-center items-center flex flex-col">
        <div>Welcome to Farcaster Lottery</div>
        <div tw="italic text-2xl">You may create your own lottery for your followers</div>
      </div>
    ),
    textInput: "Lottery name",
    buttons: [
      <Button key={1} action="post" target="/lottery/create">
        Create a Lottery
      </Button>,
    ],
  };
});
