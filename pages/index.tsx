import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image"; // Import Image from next/image

export default function Home() {
  const { data: session } = useSession();
  
  return (
   <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>Hello, <b>{session?.user?.name}</b></h2>
        
        {/* {JSON.stringify(session)} */}
        <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
          <Image 
            src={session?.user?.image as any}
            alt="Profile Image"
            width={24}
            height={24}
            className=""
          />
          <span className="px-2"></span>
          {session?.user?.name}
        </div>
      </div>
   </Layout>
  );
}
