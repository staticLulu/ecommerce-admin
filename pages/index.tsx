import Layout from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import Image from "next/image"; // Import Image from next/image

export default function Home() {
  const { data: session } = useSession();
  
  return (
   <Layout>
      <div 
        className="
          text-myText 
          flex 
          justify-between 
          items-center
          px-4 
          py-2
          rounded-xl
          bg-myOldBlue/90
          border
          border-slate-200
          shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]
        "
      >
        <h2>Hello, <b>{session?.user?.name}</b></h2>
        
        {/* {JSON.stringify(session)} */}
        <div className="flex gap-2 text-black rounded-lg overflow-hidden items-center">
        <Avatar>
          <AvatarImage src={session?.user?.image as any} alt="my profile" />
        </Avatar>
        <p className="text-myText">{session?.user?.name}</p>
        </div>

      </div>
   </Layout>
  );
}
