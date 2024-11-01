import Link from "next/link";

const ButtonRef = ({
  href, 
  className, 
  icon, 
  name
}:{ 
  href: any; 
  className: string; 
  icon: any; 
  name: string;
}) => {
  return (
    <Link href={href} className={`${className} flex items-center gap-1 !rounded-md`}>
      {icon}{name}
    </Link>
  )
}

export default ButtonRef;