import Layout from '../components/layout';
import { createTheme, MantineProvider } from '@mantine/core'

import '../styles/global.css';
import '@mantine/core/styles.css';

import { useEffect } from 'react';
import Aos from 'aos';
import 'aos/dist/aos.css';
import GsapProvider from '../components/gsap-provider';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        Aos.init({
            duration: 1000,
            easing: 'ease-in-out-cubic'
        });
    }, []);

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS defaultColorScheme='dark' theme={createTheme({
            breakpoints: {
                xl: '140em'
            }
        })}>
            <GsapProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </GsapProvider>
        </MantineProvider>
    );
}

export default MyApp;