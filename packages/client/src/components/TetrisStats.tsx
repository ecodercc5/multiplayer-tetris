import { PuzzleIcon, ChartBarIcon, ClockIcon } from "@heroicons/react/solid";
import { Cell } from "./Cell";
import { Divider } from "./Divider";
import { ShapePreview } from "./ShapePreview";

interface Props {}

interface RowProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  icon: React.FC<any>;
  label: string;
  value: any;
}

const Row: React.FC<RowProps> = ({
  icon: Icon,
  label,
  value,
  className,
  ...props
}) => {
  return (
    <div
      className={`flex justify-between font-medium mb-2.5 ${className}`}
      {...props}
    >
      <span className="inline-block text-neutral-400 flex items-center">
        <Icon className="inline h-4 w-4 mr-0.5" />
        {label}
      </span>
      <span className="font-semibold text-zinc-900">{value}</span>
    </div>
  );
};

export const TetrisStats: React.FC<Props> = () => {
  return (
    <div className="py-3 px-3 bg-zinc-50 w-[230px] rounded-md text-sm">
      <span className="inline-block font-semibold text-zinc-900 mb-4">
        Your Stats
      </span>

      <div className="mb-4">
        <Row icon={PuzzleIcon} label="Level" value={1} />
        <Row icon={ChartBarIcon} label="Score" value={200} />
        <Row icon={ClockIcon} label="Time" value="1:10" />
      </div>

      <Divider className="mb-4" />

      <span className="inline-block font-semibold text-zinc-900 mb-4">
        Next Shape
      </span>
      <div className="flex justify-center items-center min-h-[100px]">
        <ShapePreview />
      </div>
    </div>
  );
};
