import Layout from '../components/layout';
import { createTheme, MantineProvider } from '@mantine/core'

import '../styles/global.css';
import '@mantine/core/styles.css';

import { useEffect } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { Analytics } from "@vercel/analytics/react"

export default function FTCLawyer({ Component, pageProps }) {
    useEffect(() => {
        Aos.init({
            duration: 1000,
            easing: 'ease-in-out-cubic'
        });
    }, []);
    const getLayout = Component.getLayout ?? (page => <Layout>{page}</Layout>);

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS defaultColorScheme='dark' theme={createTheme({ breakpoints: { xl: '140em' } })}>
            {getLayout(
                <>
                    <Component {...pageProps} />
                    <Analytics />
                </>
            )}
        </MantineProvider>
    );
}