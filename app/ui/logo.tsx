import Image from "next/image";

export default function Logo({ className }: { className: string }) {
  return (
    <div className={className}>
      <Image
        src="/qarau-logo.png"
        height={125}
        width={125}
        alt="logo"
      />
    </div>
  );
}
