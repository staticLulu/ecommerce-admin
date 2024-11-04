import { Label } from "./ui/label";

const LabelCustom = ({name}:{name: string;}) => {
  return (
    <Label className="text-lg font-semibold text-myOldBlue/80 !mb-1.5">{name}</Label>
  )
}

export default LabelCustom;