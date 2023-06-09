import { Layout } from "@/components";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  if (!session) return;
  return (
    <Layout>
      <div className="text-neutral-900 flex justify-between">
        <h2>Hello, <b>{session?.user?.name}</b></h2>
        <div className="flex gap-2 bg-gray-300 rounded-md overflow-hidden">
          <img src={session.user?.image!} alt="user-image" className="w-6 h-6 "/>
          <p className="px-2">{session.user?.name}</p>
        </div>
      </div>
    </Layout>
  );
}
