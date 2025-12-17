export type SkeletonBlock =
  | { type: "box"; className: string }
  | {
      type: "group";
      className?: string;
      children: SkeletonBlock[];
    }
  | {
      type: "repeat";
      count: number;
      gap?: string;
      children: SkeletonBlock[];
    };
