import { RocketIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const Logo = () => {
  return (
    <Link 
      href="/" 
      rel="preload" 
      className="!flex gap-1 items-start justify-items-center font-bold w-full p-4 justify-center"
    >
      <RocketIcon width={24} height={24} /> 
      <p className="text-center text-xl md:w-[136px]">E-commerce Admin</p>
    </Link>
  )
}

export default Logo;