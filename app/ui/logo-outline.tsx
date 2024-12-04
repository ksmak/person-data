import Image from "next/image";

export default function LogoOutline({ className }: { className: string }) {
  return (
    <div className={className}>
      <Image
        src="/qarau-logo-outline.png"
        height={200}
        width={200}
        alt="logo"
      />
    </div>
  );
}
