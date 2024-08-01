import Layout from '../components/layout';
import { createTheme, MantineProvider } from '@mantine/core'

import '../styles/global.css';
import '@mantine/core/styles.css';

import { useEffect } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';
import GsapProvider from '../components/gsap-provider';

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
            <GsapProvider>
                {getLayout(<Component {...pageProps} />)}
            </GsapProvider>
        </MantineProvider>
    );
}