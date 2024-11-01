import { Text } from "@chakra-ui/react";

const TitleSection = ({title}:{title: string;}) => {
  return (
    <Text fontWeight={600} className="text-3xl text-slate-500 mb-8">{title}</Text>
  )
}

export default TitleSection;