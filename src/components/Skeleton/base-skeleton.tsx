import { Skeleton } from "@/components/ui/skeleton";
import type { SkeletonBlock } from "./types";

type BaseSkeletonProps = {
  layout: SkeletonBlock[];
};

export function BaseSkeleton({ layout }: BaseSkeletonProps) {
  return (
    <div className="w-full">
      {layout.map((block, idx) => (
        <RenderBlock key={idx} block={block} />
      ))}
    </div>
  );
}
function RenderBlock({ block }: { block: SkeletonBlock }) {
  switch (block.type) {
    case "box":
      return <Skeleton className={block.className} />;

    case "group":
      return (
        <div className={block.className}>
          {block.children.map((child, i) => (
            <RenderBlock key={i} block={child} />
          ))}
        </div>
      );

    case "repeat":
      return (
        <>
          {Array.from({ length: block.count }).map((_, i) =>
            block.children.map((child, j) => (
              <RenderBlock key={`${i}-${j}`} block={child} />
            ))
          )}
        </>
      );
  }
}
