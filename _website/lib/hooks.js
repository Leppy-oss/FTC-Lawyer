import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react"

export const useLoaded = () => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => setLoaded(true), []);
    return loaded;
}

export const useMobile = () => {
    const theme = useMantineTheme();
    return useMediaQuery(`(max-width: ${theme.breakpoints.sm}`);
}

export const useWidescreen = () => {
    const theme = useMantineTheme();
    return useMediaQuery(`(min-width: ${theme.breakpoints.xl}`);
}