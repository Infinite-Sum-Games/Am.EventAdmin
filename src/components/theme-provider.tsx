"use client";

import * as React from "react";
import { ThemeProvider as TanstackThemeProvider } from "tanstack-theme-kit";

interface ThemeProviderProps extends React.ComponentProps<typeof TanstackThemeProvider> {}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <TanstackThemeProvider {...props}>{children}</TanstackThemeProvider>;
}
