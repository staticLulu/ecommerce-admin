import NavBar from "@/components/NavBar";
import { useSession, signIn } from "next-auth/react"
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({children}:{children: any}) {
  const [showNavBar, setShowNavBar] = useState<boolean>(false);
  const { data: session } = useSession();
  if(!session) {
    return (
      <div className="bg-bgGray w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button 
            onClick={() => signIn("google")} 
            className="bg-green-700/40 text-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)] py-3 px-4 rounded-lg"
          >
            Login in with google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bgGray min-h-screen">
      <div className="md:hidden flex items-center p-4">
        <button onClick={() => setShowNavBar(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="flex grow justify-center mr-8">
          <Logo />
        </div>
      </div>
      <div className="flex">
        <div className="p-5">
          <NavBar show={showNavBar}/>
        </div>
        <div className="flex-grow py-5 pr-5">
          {children}
        </div>
      </div>
    </div>
  );
}
