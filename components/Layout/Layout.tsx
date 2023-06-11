import { Nav } from "@/components";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import Logo from "../Logo/Logo";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const [showNav, setShowNav] = useState<boolean>(false);
  const { data: session } = useSession();

  if (!session)
    return (
      <div className="bg-neutral-900 w-screen, h-screen flex items-center">
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
    <div className="bg-gray-800 min-h-full">
      <div className="block md:hidden flex item-center p-4">
        <button onClick={() => setShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <div className="flex h-screen">
        <Nav show={showNav} />
        <div className="bg-white flex-grow  h-screen p-4">{children}</div>
      </div>
    </div>
  );
}
