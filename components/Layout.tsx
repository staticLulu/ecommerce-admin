import NavBar from "@/components/NavBar";
import { useSession, signIn } from "next-auth/react"
import { useState } from "react";
import Logo from "./Logo";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export default function Layout({children}:{children: any}) {
  const [showNavBar, setShowNavBar] = useState<boolean>(false);
  const { data: session } = useSession();
  if(!session) {
    return (
      <div className="bg-bgGray w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button 
            onClick={() => signIn("google")} 
            className="bg-myOldBlue/90 text-white shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)] py-3 px-4 rounded-lg"
          >
            Login in with google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bgGray min-h-screen">
      <div className="md:hidden flex items-center p-5">
        <button onClick={() => setShowNavBar(true)} className="text-myOldBlue">
          <HamburgerMenuIcon width={30} height={30} />
        </button>

        <div className="flex grow justify-center mr-8">
          <Logo />
        </div>
      </div>
      <div className="flex gap-5 pr-5 md:px-5">
        <div className="py-5">
          <NavBar show={showNavBar}/>
        </div>
        <div className="flex-grow py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
