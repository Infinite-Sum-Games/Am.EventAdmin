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
  /* ================= Root Wrapper ================= */
  {
    type: "group",
    className: "pt-8 md:pt-12",
    children: [
      /* ================= Header ================= */
      {
        type: "group",
        className:
          "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 px-6 lg:px-10",
        children: [
          { type: "box", className: "h-6 w-40" },

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

      /* ================= Separator ================= */
      {
        type: "group",
        className: "px-6 lg:px-10",
        children: [
          {
            type: "box",
            className: "h-px w-full bg-muted mb-6",
          },
        ],
      },

      /* ================= Cards Grid ================= */
      {
        type: "group",
        className: "px-6 lg:px-10",
        children: [
          {
            type: "group",
            className:
              "mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[70vh]",
            children: [
              {
                type: "repeat",
                count: 6,
                children: [
                  {
                    type: "box",
                    className:
                      "w-full max-w-[22rem] mx-auto rounded-2xl min-h-[18rem] sm:min-h-[20rem] lg:min-h-[24rem]",
                  },
                ],
              },
            ],
          },
        ],
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
