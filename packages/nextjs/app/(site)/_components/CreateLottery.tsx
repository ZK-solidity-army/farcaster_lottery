import { useCallback, useState } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function CreateLottery() {
  const [page, setPage] = useState(0);
  return (
    <div className="lg:grid grid-cols-2 px-[5vw] py-[5vh] flex flex-col-reverse">
      <div className="grid grid-rows-5 mt-5 md:mt-0">
        <div className="row-span-4 grid grid-rows-sugrid relative overflow-hidden">
          <FormPage1 page={page} className="w-full absolute" />
          <FormPage2 page={page} className="w-full translate-x-full absolute" />
          <FormPage3 page={page} className="w-full translate-x-full absolute" />
          <FormPage4 page={page} className="w-full translate-x-full absolute" />
        </div>

        <div className="text-center">
          <Controls page={page} setPage={setPage} />
        </div>
      </div>
      <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] relative ">
        <Image src="/img/pic2.png" alt="pic1" className="object-contain rounded rounded-3xl" fill={true} />
      </div>
    </div>
  );
}

function Controls({ page, setPage }: { page: number; setPage: (page: number) => void }) {
  const onNext = useCallback(() => page < 3 && setPage(page + 1), [page, setPage]);
  const onPrev = useCallback(() => page > 0 && setPage(page - 1), [page, setPage]);

  const nextClassName = page == 0 ? "w-36 md:w-64" : "";
  const prevClassName = page == 0 ? "" : "md:w-36 w-32";
  return (
    <div className="flex flex-row justify-center">
      {page !== 0 && (
        <button className={twMerge("btn btn-primary md:btn-lg mr-4", prevClassName)} onClick={onPrev}>
          &laquo; Back
        </button>
      )}
      <button className={twMerge("btn btn-primary md:btn-lg", nextClassName)} onClick={onNext}>
        Next &raquo;
      </button>
    </div>
  );
}

function FormPage1({ page, className }: { page: number; className?: string }) {
  const showClassName = page === 0 ? "opacity-1" : "opacity-0 -translate-x-full";

  return (
    <div className={twMerge("h-full grid grid-rows-4 text-center transition duration-500", className, showClassName)}>
      <h2 className="md:text-3xl row-start-2">Enter lottery name</h2>
      <div className="row-start-3">
        <input type="text" className="input md:input-lg input-wide" placeholder="" />
      </div>
    </div>
  );
}

function FormPage2({ page, className }: { page: number; className?: string }) {
  let showClassName = page === 1 ? "opacity-1 translate-x-0" : "opacity-0";
  if (page > 1) {
    showClassName += " -translate-x-full";
  }
  return (
    <div className={twMerge("row-start-2 text-center transition duration-500", className, showClassName)}>XAXA</div>
  );
}

function FormPage3({ page, className }: { page: number; className?: string }) {
  let showClassName = page === 2 ? "opacity-1 translate-x-0" : "opacity-0";
  if (page > 2) {
    showClassName += " -translate-x-full";
  }
  if (page < 2) {
    showClassName += " translate-x-full";
  }
  return (
    <div className={twMerge("row-start-2 text-center transition duration-500", className, showClassName)}>XIXI</div>
  );
}

function FormPage4({ page, className }: { page: number; className?: string }) {
  let showClassName = page === 3 ? "opacity-1 translate-x-0" : "opacity-0";
  if (page < 3) {
    showClassName += " translate-x-full";
  }
  return (
    <div className={twMerge("row-start-2 text-center transition duration-500", className, showClassName)}>X0X0</div>
  );
}
