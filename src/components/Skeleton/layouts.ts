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



export const EventSkeletonLayout: SkeletonBlock[] = [
  {
    type: "group",
    className: "pt-6 md:pt-10 px-4 md:px-6",
    children: [
      {
        type: "group",
        className:
          "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-3 border-b mb-6",
        children: [
          { type: "box", className: "h-6 w-44" },

          {
            type: "group",
            className: "flex gap-3",
            children: [
              { type: "box", className: "h-9 w-28 rounded-md" },
              { type: "box", className: "h-9 w-28 rounded-md" },
            ],
          },
        ],
      },
      {
        type: "group",
        className: "mb-6",
        children: [
          {
            type: "box",
            className: "h-11 w-full rounded-xl",
          },
        ],
      },
      {
        type: "group",
        className: "grid grid-cols-1 lg:grid-cols-4 gap-6 pb-6 min-h-[70vh]",
        children: [
          {
            type: "group",
            className: "lg:col-span-3",
            children: [
              {
                type: "box",
                className: "w-full rounded-2xl min-h-[28rem] lg:min-h-[38rem]",
              },
            ],
          },
          {
            type: "group",
            className: "lg:col-span-1",
            children: [
              {
                type: "box",
                className: "w-full rounded-2xl min-h-[24rem] lg:min-h-[38rem]",
              },
            ],
          },
        ],
      },
    ],
  },
];
