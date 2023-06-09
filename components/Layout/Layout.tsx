import { Nav } from "@/components";
import { useSession, signIn, signOut } from "next-auth/react";

type Props = {
	children: React.ReactNode
}

export default function Layout({children}: Props) {
  const { data: session } = useSession();

  if (!session)
    return (
      <div className="bg-blue-900 w-screen, h-screen flex items-center">
        <div className="text-center w-full">
          <button
            onClick={() => signIn("google")}
            className="bg-white p-2 rounded-sm"
          >
            Login with Google
          </button>
        </div>
      </div>
    );

  return (
    <div className="bg-neutral-800 min-h-screen flex">
      <Nav />
      <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-sm p-4">
        {children}
      </div>
    </div>
  );
}
