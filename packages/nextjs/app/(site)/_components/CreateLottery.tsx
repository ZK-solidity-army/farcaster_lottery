import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { twMerge } from "tailwind-merge";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { WriteContractErrorType } from "wagmi/actions";
import create from "zustand";
import { useShallow } from "zustand/react/shallow";
import { DARK_THEME } from "~~/config";
import Transaction from "~~/src/components/Transaction";
import { useTargetNetwork } from "~~/src/hooks/scaffold-eth/useTargetNetwork";
import { getContract } from "~~/src/utils/getContract";

type CreateLotteryState = {
  title: string;
  ticketPrice: string;
  creatorFee: string;
  deposit: string;
  hoursToClose: string;
  setTitle: (title: string) => void;
  setHoursToClose: (hoursToClose: string) => void;
  setCreatorFee: (creatorFee: string) => void;
  setDeposit: (deposit: string) => void;
};

const useCreateLottery = create<CreateLotteryState>(set => ({
  title: "",
  ticketPrice: "0",
  creatorFee: "0",
  deposit: "0",
  hoursToClose: "24",
  setTitle: (title: string) => set({ title }),
  setTicketPrice: (ticketPrice: string) => set({ ticketPrice }),
  setCreatorFee: (creatorFee: string) => set({ creatorFee }),
  setHoursToClose: (hoursToClose: string) => set({ hoursToClose }),
  setDeposit: (deposit: string) => set({ deposit }),
}));

export default function CreateLottery() {
  const [page, setPage] = useState(-1);
  const [createLotteryTxHash, setCreateLotteryTxHash] = useState("");
  const [createLotteryError, setCreateLotteryError] = useState("");
  const [lotteryLink, setLotteryLink] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onRestart = useCallback(() => {
    setPage(0);
    setCreateLotteryError("");
  }, [setCreateLotteryError, setPage]);

  return (
    <>
      <div className="lg:grid lg:grid-cols-2 px-[5vw] py-[5vh] flex flex-col-reverse gap-6">
        <div className="grid grid-rows-5 mt-5 md:mt-0 relative min-h-[20rem]">
          <div className="absolute w-full h-full bg-neutral/10 rounded rounded-3xl left-0 top-0 -z-1" />
          {!createLotteryError ? (
            !lotteryLink ? (
              <>
                <div className="row-span-4 grid grid-rows-sugrid relative overflow-hidden">
                  {isLoading ? (
                    <div className="mt-10 mx-auto">
                      <Loader />
                    </div>
                  ) : (
                    <>
                      <WelcomePage index={-1} page={page} className="w-full absolute" />
                      <SetTitleForm index={0} page={page} className="w-full absolute" />
                      <SetDateForm index={1} page={page} className="w-full translate-x-full absolute" />
                      <SetCreatorFeeForm index={2} page={page} className="w-full translate-x-full absolute" />
                      <SetDepositForm index={3} page={page} className="w-full translate-x-full absolute" />
                      <ReportForm index={4} page={page} className="w-full translate-x-full absolute" />
                    </>
                  )}
                  {createLotteryTxHash && (
                    <div className="text-center">
                      <Transaction txHash={createLotteryTxHash as `0x${string}`} />
                    </div>
                  )}
                </div>

                <div className="text-center relative">
                  <Controls
                    pages={5}
                    page={page}
                    isLoading={isLoading}
                    setPage={setPage}
                    setLotteryLink={setLotteryLink}
                    setCreateLotteryError={setCreateLotteryError}
                    setCreateLotteryTxHash={setCreateLotteryTxHash}
                    setLoading={setLoading}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="row-span-4 grid grid-rows-sugrid relative overflow-hidden">
                  <div className="text-2xl row-start-2 md:w-[16rem] w-[14rem] mx-auto text-center">
                    You have successfully created a lottery!
                  </div>
                  {createLotteryTxHash && (
                    <div className="text-center row-start-4">
                      <Transaction txHash={createLotteryTxHash as `0x${string}`} />
                    </div>
                  )}
                </div>

                <div className="flex flex-row justify-center gap-3">
                  <Link className={"btn btn-primary md:btn-lg w-[16rem] md:w-[18rem] relative"} href={lotteryLink}>
                    Go to lottery
                  </Link>
                </div>
              </>
            )
          ) : (
            <>
              <div className="row-span-4 grid grid-rows-sugrid relative overflow-hidden">
                <h2 className="md:text-3xl row-start-2 w-64 text-center mx-auto">
                  You were unable to create the transaction
                </h2>
                <div className="text-center row-start-4 text-error w-64 text-center mx-auto">{createLotteryError}</div>
              </div>
              <div className="text-center relative">
                <button className={"btn btn-primary md:btn-lg w-36 md:w-64"} onClick={onRestart}>
                  Try again
                </button>
              </div>
            </>
          )}
        </div>
        <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] relative ">
          <Image src="/img/welcome.jpg" alt="pic1" className="object-contain rounded-3xl" fill={true} />
        </div>
      </div>
    </>
  );
}

function Controls({
  page,
  pages,
  isLoading,
  setPage,
  setLoading,
  setLotteryLink,
  setCreateLotteryTxHash,
  setCreateLotteryError,
}: {
  page: number;
  pages: number;
  isLoading: boolean;
  setPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setLotteryLink: (link: string) => void;
  setCreateLotteryTxHash: (hash: string) => void;
  setCreateLotteryError: (error: string) => void;
}) {
  const { targetNetwork } = useTargetNetwork();
  const { writeContract } = useWriteContract();
  const publicClient = usePublicClient({
    chainId: targetNetwork.id,
  });
  const contract = useMemo(() => getContract("LotteryDeployer", targetNetwork.id), [targetNetwork]);
  const account = useAccount();

  const { title, ticketPrice, hoursToClose, creatorFee, deposit } = useCreateLottery(
    useShallow(state => ({
      title: state.title,
      ticketPrice: state.ticketPrice,
      hoursToClose: state.hoursToClose,
      creatorFee: state.creatorFee,
      deposit: state.deposit,
    })),
  );

  const onNext = useCallback(() => page < pages - 1 && setPage(page + 1), [page, pages, setPage]);
  const onPrev = useCallback(() => page > 0 && setPage(page - 1), [page, setPage]);
  const onStart = useCallback(() => setPage(0), [setPage]);
  const onSubmit = useCallback(() => {
    setLoading(true);
    if (!publicClient) {
      setCreateLotteryError("Public client is not initialized");
      return;
    }
    if (!account || !account.address) {
      setCreateLotteryError("Account is not connected");
      return;
    }

    writeContract(
      {
        address: contract.address,
        abi: contract.abi,
        functionName: "createLottery",
        args: [title, BigInt(ticketPrice), BigInt(creatorFee), BigInt(deposit), BigInt(hoursToClose)],
      },
      {
        onSuccess: (hash: `0x${string}`) => {
          setCreateLotteryTxHash(hash);
          setCreateLotteryError("");
        },
        onError: (error: WriteContractErrorType) => {
          setLoading(false);
          setCreateLotteryError(error.message);
          setCreateLotteryTxHash("");
        },
        onSettled: async (hash?: `0x${string}`, error?: WriteContractErrorType | null) => {
          if (error) {
            setLoading(false);
            const errorMessage = "shortMessage" in error ? error.shortMessage : error.message;
            setCreateLotteryError(errorMessage);
            return;
          }

          if (!account.address) return;

          const lotteryCount = await publicClient.readContract({
            address: contract.address,
            abi: contract.abi,
            functionName: "lotteryCount",
            args: [account.address],
          });

          if (!lotteryCount) {
            setCreateLotteryError("Failed to retrieve created lottery");
            setLoading(false);
            return;
          }

          const lotteryAddress = await publicClient.readContract({
            address: contract.address,
            abi: contract.abi,
            functionName: "lotteries",
            args: [account.address, lotteryCount - 1n],
          });

          if (!lotteryAddress) {
            setCreateLotteryError("Failed to retrieve created lottery");
            return;
          }

          console.log("lotteryAddress", lotteryAddress, "chain", targetNetwork.id);
          setLotteryLink(`/lotteries/${targetNetwork.id}/${lotteryAddress}`);
        },
      },
    );
  }, [
    account,
    contract,
    publicClient,
    setLoading,
    setLotteryLink,
    setCreateLotteryTxHash,
    setCreateLotteryError,
    targetNetwork,
    writeContract,
    // Lottery args
    title,
    ticketPrice,
    hoursToClose,
    creatorFee,
    deposit,
  ]);

  const nextClassName = page == 0 ? "w-[16rem] md:w-[18rem]" : "";
  const prevClassName = page == 0 ? "" : "md:w-36 w-32";

  if (page === -1) {
    return (
      <div className="flex flex-row justify-center gap-3">
        <button className={"btn btn-primary md:btn-lg w-[16rem] md:w-[18rem]"} onClick={onStart}>
          Create lottery
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-center gap-3">
      {page !== 0 && (
        <button
          className={twMerge("btn btn-primary md:btn-lg  w-[8rem] md:w-[9rem]", prevClassName)}
          onClick={onPrev}
          disabled={isLoading}
        >
          &laquo; Back
        </button>
      )}
      {page !== pages - 1 ? (
        <button
          className={twMerge("btn btn-primary md:btn-lg w-[8rem] md:w-[9rem]", nextClassName)}
          onClick={onNext}
          disabled={isLoading}
        >
          Next &raquo;
        </button>
      ) : (
        <button className={"btn btn-secondary md:btn-lg w-[8rem] md:w-[9rem]"} onClick={onSubmit} disabled={isLoading}>
          Create &raquo;
        </button>
      )}
    </div>
  );
}

function WelcomePage({ index, page, className }: { index: number; page: number; className?: string }) {
  const showClassName = generateTransitionClass(index, page);

  return (
    <div
      className={twMerge("h-full grid grid-rows-4 transition duration-500 flex text-center", className, showClassName)}
    >
      <div className="md:w-[20rem] w-[15rem] mx-auto flex flex-col h-full justify-center">
        <h2 className="text-xl">Create Your Own Lottery!</h2>
        <p>Invite your audience to participate and let the anticipation begin!</p>
      </div>
    </div>
  );
}

function SetTitleForm({ index, page, className }: { index: number; page: number; className?: string }) {
  const { title, setTitle } = useCreateLottery(
    useShallow(state => ({
      title: state.title,
      setTitle: state.setTitle,
    })),
  );
  const showClassName = generateTransitionClass(index, page);

  return (
    <div
      className={twMerge("h-full grid grid-rows-4 text-center transition duration-500 mt-5", className, showClassName)}
    >
      <h2 className="w-[17rem] md:w-[24rem] row-start-1 mx-auto mt-10">How would you like to name your lottery?</h2>
      <div className="row-start-3">
        <label
          className={twMerge(
            "input input-bordered flex mx-auto",
            "outline outline-2 outline-offset-2 outline-secondary-content/10",
            "h-[3rem] w-[16rem]",
            "md:h-[4rem] md:w-[18rem]",
          )}
        >
          <input
            type="text"
            value={title}
            placeholder="Lottery name"
            className="grow h-full w-full md:text-xl"
            onChange={e => setTitle(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}

function SetDateForm({ index, page, className }: { index: number; page: number; className?: string }) {
  const { hoursToClose, setHoursToClose } = useCreateLottery(
    useShallow(state => ({
      hoursToClose: state.hoursToClose,
      setHoursToClose: state.setHoursToClose,
    })),
  );
  const showClassName = generateTransitionClass(index, page);

  return (
    <div
      className={twMerge("h-full grid grid-rows-3 text-center transition duration-500 mt-5", className, showClassName)}
    >
      <h2 className="w-[17rem] md:w-[24rem] row-start-1 mx-auto mt-10">
        By what time does the lottery close (in hours)?
      </h2>
      <div className="row-start-2">
        <label
          className={twMerge(
            "input input-bordered flex items-center justify-between mx-auto relative",
            "outline outline-2 outline-offset-2 outline-secondary-content/10",
            "h-[5rem] w-[5rem]",
            "md:h-[8rem] md:w-[8rem]",
          )}
        >
          <input
            type="text"
            value={hoursToClose}
            className="grow text-center h-full w-full text-2xl md:text-5xl"
            onChange={e => setHoursToClose(e.target.value)}
            maxLength={4}
          />
          <kbd className="kbd kbd-xs md:kbd-sm bg-primary/40 absolute bottom-1 right-1">H</kbd>
        </label>
      </div>
    </div>
  );
}

function SetCreatorFeeForm({ index, page, className }: { index: number; page: number; className?: string }) {
  const { creatorFee, setCreatorFee } = useCreateLottery(
    useShallow(state => ({
      creatorFee: state.creatorFee,
      setCreatorFee: state.setCreatorFee,
    })),
  );
  const showClassName = generateTransitionClass(index, page);

  return (
    <div
      className={twMerge("h-full grid grid-rows-3 text-center transition duration-500 mt-5", className, showClassName)}
    >
      <h2 className="w-[20rem] row-start-1 mx-auto mt-10">What would be your creator fee?</h2>
      <div className="row-start-2">
        <label
          className={twMerge(
            "input input-bordered flex items-center justify-between mx-auto relative",
            "outline outline-2 outline-offset-2 outline-secondary-content/10",
            "h-[5rem] w-[5rem]",
            "md:h-[8rem] md:w-[8rem]",
          )}
        >
          <input
            type="text"
            value={creatorFee}
            className="grow text-center h-full w-full text-2xl md:text-5xl"
            onChange={e => setCreatorFee(e.target.value)}
            maxLength={4}
          />
          <kbd className="kbd kbd-xs md:kbd-sm absolute bottom-1 right-1">%</kbd>
        </label>
      </div>
    </div>
  );
}

function SetDepositForm({ index, page, className }: { index: number; page: number; className?: string }) {
  const { deposit, setDeposit } = useCreateLottery(
    useShallow(state => ({
      deposit: state.deposit,
      setDeposit: state.setDeposit,
    })),
  );
  const showClassName = generateTransitionClass(index, page);

  return (
    <div
      className={twMerge("h-full grid grid-rows-4 text-center transition duration-500 mt-5", className, showClassName)}
    >
      <h2 className="w-[15rem] row-start-1 mx-auto mt-10">
        Whould you like to increase prize pool with some starting money?
      </h2>
      <div className="row-start-3">
        <label
          className={twMerge(
            "input input-bordered flex items-center justify-between mx-auto relative",
            "outline outline-2 outline-offset-2 outline-secondary-content/10",
            "h-[3rem] w-[12rem]",
            "md:h-[4rem] md:w-[14rem]",
          )}
        >
          <input
            type="text"
            value={deposit}
            className="grow w-full h-full pr-10"
            placeholder=""
            onChange={e => setDeposit(e.target.value)}
          />
          <kbd className="kbd kbd-xs md:kbd-sm absolute top-1/2 -translate-y-1/2 right-2">ETH</kbd>
        </label>
      </div>
    </div>
  );
}

function ReportForm({ index, page, className }: { index: number; page: number; className?: string }) {
  const { deposit, creatorFee, title, hoursToClose } = useCreateLottery(
    useShallow(state => ({
      deposit: state.deposit,
      creatorFee: state.creatorFee,
      title: state.title,
      hoursToClose: state.hoursToClose,
    })),
  );
  const showClassName = generateTransitionClass(index, page);

  return (
    <div className={twMerge("h-full h-full text-center transition duration-500 p-5", className, showClassName)}>
      <div className="overflow-x-auto md:m-10">
        <table className="table">
          <tbody>
            <tr>
              <td>Title</td>
              <td>{title || ""}</td>
            </tr>
            <tr>
              <td>Close in</td>
              <td>{hoursToClose || 0} hours</td>
            </tr>
            <tr>
              <td>Your fee</td>
              <td>{creatorFee || 0} %</td>
            </tr>
            <tr>
              <td>Starting prize pool</td>
              <td>{deposit || 0} ETH</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const generateTransitionClass = (index: number, page: number) => {
  let className = page === index ? "opacity-1 translate-x-0" : "opacity-0";
  if (page > index) {
    className += " -translate-x-full";
  }
  if (page < index) {
    className += " translate-x-full";
  }
  return className;
};

function Loader() {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === DARK_THEME;

  const circle1Class = isDarkMode ? "#ff865b" : "#ffa400";
  const circle2Class = isDarkMode ? "#9fb9d0" : "#342308";
  const circle3Class = isDarkMode ? "#ff865b" : "#ffa400";

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="200" height="200" className="w-[9rem] md:w-auto">
      <g>
        <circle r="20" fill={circle1Class} cy="50" cx="30">
          <animate
            begin="-0.5s"
            values="30;70;30"
            keyTimes="0;0.5;1"
            dur="1s"
            repeatCount="indefinite"
            attributeName="cx"
          ></animate>
        </circle>
        <circle r="20" fill={circle2Class} cy="50" cx="70">
          <animate
            begin="0s"
            values="30;70;30"
            keyTimes="0;0.5;1"
            dur="1s"
            repeatCount="indefinite"
            attributeName="cx"
          ></animate>
        </circle>
        <circle r="20" fill={circle3Class} cy="50" cx="30">
          <animate
            begin="-0.5s"
            values="30;70;30"
            keyTimes="0;0.5;1"
            dur="1s"
            repeatCount="indefinite"
            attributeName="cx"
          ></animate>
          <animate
            repeatCount="indefinite"
            dur="1s"
            keyTimes="0;0.499;0.5;1"
            calcMode="discrete"
            values="0;0;1;1"
            attributeName="fill-opacity"
          ></animate>
        </circle>
      </g>
    </svg>
  );
}
