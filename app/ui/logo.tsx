import { HiOutlineSupport } from "react-icons/hi";

export default function Logo() {
  return (
    <div
      className="flex flex-row items-center justify-center leading-none text-white"
    >
      <HiOutlineSupport className="h-14 w-14" />
      <p className="text-[25px]">PersonData</p>
    </div>
  );
}
