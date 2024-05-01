import { useCallback, useState } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import create from "zustand";
import { useShallow } from "zustand/react/shallow";

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
  return (
    <div className="lg:grid grid-cols-2 px-[5vw] py-[5vh] flex flex-col-reverse">
      <div className="grid grid-rows-5 mt-5 md:mt-0">
        <div className="row-span-4 grid grid-rows-sugrid relative overflow-hidden">
          <SetTitleForm index={0} page={page} className="w-full absolute" />
          <SetDateForm index={1} page={page} className="w-full translate-x-full absolute" />
          <SetCreatorFeeForm index={2} page={page} className="w-full translate-x-full absolute" />
          <SetDepositForm index={3} page={page} className="w-full translate-x-full absolute" />
          <ReportForm index={4} page={page} className="w-full translate-x-full absolute" />
        </div>

        <div className="text-center">
          <Controls pages={5} page={page} setPage={setPage} />
        </div>
      </div>
      <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] relative ">
        <Image src="/img/pic2.png" alt="pic1" className="object-contain rounded rounded-3xl" fill={true} />
      </div>
    </div>
  );
}

function Controls({ page, pages, setPage }: { page: number; pages: number; setPage: (page: number) => void }) {
  const onNext = useCallback(() => page < pages - 1 && setPage(page + 1), [page, setPage]);
  const onPrev = useCallback(() => page > 0 && setPage(page - 1), [page, setPage]);

  let nextClassName = page == 0 ? "w-36 md:w-64" : "";
  const prevClassName = page == 0 ? "" : "md:w-36 w-32";
  const nextTitle = page === pages - 1 ? "Create" : "Next";
  nextClassName += page === pages - 1 ? "btn-secondary" : "";

  return (
    <div className="flex flex-row justify-center">
      {page !== 0 && (
        <button className={twMerge("btn btn-primary md:btn-lg mr-4", prevClassName)} onClick={onPrev}>
          &laquo; Back
        </button>
      )}
      <button className={twMerge("btn btn-primary md:btn-lg", nextClassName)} onClick={onNext}>
        {nextTitle} &raquo;
      </button>
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
