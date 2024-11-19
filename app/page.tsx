import { AddShedullerJobButton, RemoveShedullerJobButton } from '@/app/ui/main/buttons';
import { SocketClient } from './ui/socket';

export default function Home() {

  return (
    <div>
      <AddShedullerJobButton />
      <RemoveShedullerJobButton />
      <SocketClient />
    </div>
  );
}
