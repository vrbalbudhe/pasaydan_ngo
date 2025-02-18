import { Skeleton } from "@/components/ui/skeleton";
export default function SkeletonBox() {
  return (
    <div className="w-fit h-fit flex flex-col space-y-3">
      <Skeleton className="h-[250px] w-[450px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
