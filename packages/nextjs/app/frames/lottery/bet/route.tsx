import { Button } from "frames.js/next";
import { frames } from "~~/app/frames/frames";

export const POST = frames(async ({ searchParams: { chainId, address } }) => {
  return {
    image: <div>You have entered the lottery</div>,
    buttons: [
      <Button key={0} action="post" target={{ query: { chainId: chainId, address: address }, pathname: "/lottery" }}>
        &laquo; Back
      </Button>,
    ],
  };
});
