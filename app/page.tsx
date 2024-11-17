import { addJob } from "./lib/actions";

export default function Home() {

  return (
    <div>
      Main Page
      <form action={addJob}>
        <button type="submit">Add Job</button>
      </form>
    </div>
  );
}
