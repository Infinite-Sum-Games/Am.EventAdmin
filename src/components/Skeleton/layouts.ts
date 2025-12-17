import type { SkeletonBlock } from "./types";
export const listSkeletonLayout: SkeletonBlock[] = [
  {
    type: "repeat",
    count: 6,
    children: [
      {
        type: "group",
        className: "flex items-center gap-4",
        children: [
          { type: "box", className: "h-10 w-10 rounded-md" },
          {
            type: "group",
            className: "flex-1 space-y-2",
            children: [
              { type: "box", className: "h-4 w-full" },
              { type: "box", className: "h-3 w-2/3" },
            ],
          },
        ],
      },
    ],
  },
];

export const cardGridSkeletonLayout: SkeletonBlock[] = [
  {
    type: "box",
    className: "h-6 w-1/4 mb-4",
  },
  {
    type: "group",
    className: "flex gap-3 mb-6",
    children: [
      { type: "box", className: "h-8 w-20 rounded-md" },
      { type: "box", className: "h-8 w-20 rounded-md" },
      { type: "box", className: "h-8 w-20 rounded-md" },
    ],
  },
  {
    type: "group",
    className: "flex gap-4",
    children: [
      {
        type: "group",
        className: "w-3/4 space-y-4",
        children: [
          { type: "box", className: "h-40 w-full rounded-xl" },
          { type: "box", className: "h-40 w-full rounded-xl" },
        ],
      },
      {
        type: "group",
        className: "w-1/4",
        children: [{ type: "box", className: "h-[336px] w-full rounded-xl" }],
      },
    ],
  },
];



export const dashboardSkeletonLayout: SkeletonBlock[] = [
  {
    type: "group",
    className:
      "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6",
    children: [
      { type: "box", className: "h-6 w-40" },
      {
        type: "group",
        className: "flex gap-2",
        children: [
          { type: "box", className: "h-8 w-24 rounded-md" },
          { type: "box", className: "h-8 w-24 rounded-md" },
        ],
      },
    ],
  },
  {
    type: "box",
    className: "h-10 w-full rounded-lg mb-6",
  },
  {
    type: "group",
    className: "grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-[60vh]",
    children: [
      {
        type: "group",
        className: "lg:col-span-3",
        children: [
          {
            type: "box",
            className: "w-full rounded-xl min-h-[24rem] lg:min-h-[32rem]",
          },
        ],
      },
      {
        type: "group",
        className: "lg:col-span-1",
        children: [
          {
            type: "box",
            className: "h-full min-h-[20rem] lg:min-h-full rounded-xl",
          },
        ],
      },
    ],
  },
];
