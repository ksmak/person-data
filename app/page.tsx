import { AddShedullerJobButton, RemoveShedullerJobButton } from '@/app/ui/main/button';
export default function Home() {
  return (
    <div className='flex flex-col gap-5'>
      <AddShedullerJobButton />
      <RemoveShedullerJobButton />
    </div>
  );
}
