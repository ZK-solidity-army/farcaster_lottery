import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useWriteContract } from "wagmi";
import { WriteContractErrorType } from "wagmi/actions";
import create from "zustand";
import { useShallow } from "zustand/react/shallow";
import Transaction from "~~/src/components/Transaction";
import { useTargetNetwork } from "~~/src/hooks/scaffold-eth/useTargetNetwork";
import { getContract } from "~~/src/utils/getContract";

type CreateLotteryState = {
  title: string;
  hoursToClose: string;
  creatorFee: string;
  deposit: string;
  setTitle: (title: string) => void;
  setHoursToClose: (hoursToClose: string) => void;
  setCreatorFee: (creatorFee: string) => void;
  setDeposit: (deposit: string) => void;
};

const useCreateLottery = create<CreateLotteryState>(set => ({
  title: "",
  hoursToClose: "0",
  creatorFee: "",
  deposit: "",
  setTitle: (title: string) => set({ title }),
  setCreatorFee: (creatorFee: string) => set({ creatorFee }),
  setHoursToClose: (hoursToClose: string) => set({ hoursToClose }),
  setDeposit: (deposit: string) => set({ deposit }),
}));

export default function CreateLottery() {
  const [page, setPage] = useState(0);
  const [createLotteryTxHash, setCreateLotteryTxHash] = useState("");
  const [createLotteryError, setCreateLotteryError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onRestart = useCallback(() => {
    setPage(0);
    setCreateLotteryError("");
  }, [setCreateLotteryError, setPage]);

  return (
    <div className="lg:grid grid-cols-2 px-[5vw] py-[5vh] flex flex-col-reverse">
      <div className="grid grid-rows-5 mt-5 md:mt-0">
        {!createLotteryError ? (
          <>
            <div className="row-span-4 grid grid-rows-sugrid relative overflow-hidden">
              {isLoading ? (
                <div className="mt-10 mx-auto">
                  <Loader />
                </div>
              ) : (
                <>
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

            <div className="text-center">
              <Controls
                pages={5}
                page={page}
                isLoading={isLoading}
                setPage={setPage}
                setCreateLotteryError={setCreateLotteryError}
                setCreateLotteryTxHash={setCreateLotteryTxHash}
                setLoading={setLoading}
              />
            </div>
          </>
        ) : (
          <>
            <div className="row-span-4 grid grid-rows-sugrid relative overflow-hidden">
              <h2 className="md:text-3xl row-start-2 w-64 text-center mx-auto">
                You won&lsquo;t be able to create transaction
              </h2>
              <div className="text-center row-start-4 text-red-500 w-64 text-center mx-auto">{createLotteryError}</div>
            </div>
            <div className="text-center">
              <button className={"btn btn-primary md:btn-lg w-36 md:w-64"} onClick={onRestart}>
                Try again
              </button>
            </div>
          </>
        )}
      </div>
      <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] relative ">
        <Image src="/img/pic2.png" alt="pic1" className="object-contain rounded rounded-3xl" fill={true} />
      </div>
    </div>
  );
}

function Controls({
  page,
  pages,
  isLoading,
  setPage,
  setLoading,
  setCreateLotteryTxHash,
  setCreateLotteryError,
}: {
  page: number;
  pages: number;
  isLoading: boolean;
  setPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setCreateLotteryTxHash: (hash: string) => void;
  setCreateLotteryError: (error: string) => void;
}) {
  const { targetNetwork } = useTargetNetwork();
  const { writeContract } = useWriteContract();
  const contract = useMemo(() => getContract("LotteryDeployer", targetNetwork), [targetNetwork]);

  const onNext = useCallback(() => page < pages - 1 && setPage(page + 1), [page, pages, setPage]);
  const onPrev = useCallback(() => page > 0 && setPage(page - 1), [page, setPage]);
  const onSubmit = useCallback(() => {
    setLoading(true);
    writeContract(
      {
        address: contract.address,
        abi: contract.abi,
        functionName: "createLottery",
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
        onSettled: (hash?: `0x${string}`, error?: WriteContractErrorType | null) => {
          if (error) {
            setLoading(false);
            const errorMessage = "shortMessage" in error ? error.shortMessage : error.message;
            setCreateLotteryError(errorMessage);
          }
        },
      },
    );
  }, [contract, writeContract, setLoading, setCreateLotteryTxHash, setCreateLotteryError]);

  const nextClassName = page == 0 ? "w-36 md:w-64" : "";
  const prevClassName = page == 0 ? "" : "md:w-36 w-32";

  return (
    <div className="flex flex-row justify-center">
      {page !== 0 && (
        <button
          className={twMerge("btn btn-primary md:btn-lg mr-4", prevClassName)}
          onClick={onPrev}
          disabled={isLoading}
        >
          &laquo; Back
        </button>
      )}
      {page !== pages - 1 ? (
        <button className={twMerge("btn btn-primary md:btn-lg", nextClassName)} onClick={onNext} disabled={isLoading}>
          Next &raquo;
        </button>
      ) : (
        <button className={"btn btn-secondary md:btn-lg"} onClick={onSubmit} disabled={isLoading}>
          Create &raquo;
        </button>
      )}
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
    <div className={twMerge("h-full grid grid-rows-4 text-center transition duration-500", className, showClassName)}>
      <h2 className="md:text-3xl row-start-2">Enter lottery name</h2>
      <div className="row-start-3">
        <input
          type="text"
          value={title}
          className="input md:input-lg input-wide"
          placeholder=""
          onChange={e => setTitle(e.target.value)}
        />
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
    <div className={twMerge("h-full grid grid-rows-4 text-center transition duration-500", className, showClassName)}>
      <h2 className="md:text-3xl w-64 row-start-1 mx-auto mt-10">
        By what time does the lottery close
        <br />
        (in hours)?
      </h2>
      <div className="row-start-3">
        <input
          type="text"
          value={hoursToClose}
          className="input md:input-lg input-wide"
          placeholder=""
          onChange={e => setHoursToClose(e.target.value)}
        />
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
    <div className={twMerge("h-full grid grid-rows-4 text-center transition duration-500", className, showClassName)}>
      <h2 className="md:text-3xl w-64 row-start-1 mx-auto mt-10">What would be your creator fee?</h2>
      <div className="row-start-3">
        <input
          type="text"
          value={creatorFee}
          className="input md:input-lg input-wide"
          placeholder="%"
          onChange={e => setCreatorFee(e.target.value)}
        />
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
    <div className={twMerge("h-full grid grid-rows-4 text-center transition duration-500", className, showClassName)}>
      <h2 className="md:text-3xl w-64 row-start-1 mx-auto mt-10">
        Whould you like to increase prize pool with some money?
      </h2>
      <div className="row-start-3">
        <input
          type="text"
          value={deposit}
          className="input md:input-lg input-wide"
          placeholder=""
          onChange={e => setDeposit(e.target.value)}
        />
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
    <div className={twMerge("h-full grid grid-rows-4 text-center transition duration-500", className, showClassName)}>
      <ul className="w-64 mx-auto md:text-lg md:mt-10">
        <li className="flex justify-between">
          <span>Title:</span>
          <span>{title}</span>
        </li>
        <li className="flex justify-between">
          <span>Close in:</span>
          <span>{hoursToClose || 0} hours</span>
        </li>
        <li className="flex justify-between">
          <span>Your fee</span>
          <span>{creatorFee || 0}%</span>
        </li>
        <li className="flex justify-between">
          <span>Starting prize pool:</span>
          <span>{deposit || 0}</span>
        </li>
      </ul>
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
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="200" height="200">
      <g>
        <circle r="20" fill="#ffa400" cy="50" cx="30">
          <animate
            begin="-0.5s"
            values="30;70;30"
            keyTimes="0;0.5;1"
            dur="1s"
            repeatCount="indefinite"
            attributeName="cx"
          ></animate>
        </circle>
        <circle r="20" fill="#342308" cy="50" cx="70">
          <animate
            begin="0s"
            values="30;70;30"
            keyTimes="0;0.5;1"
            dur="1s"
            repeatCount="indefinite"
            attributeName="cx"
          ></animate>
        </circle>
        <circle r="20" fill="#ffa400" cy="50" cx="30">
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
