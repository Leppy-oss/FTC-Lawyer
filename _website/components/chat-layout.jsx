import { Box } from '@mantine/core';
import Head from 'next/head'
import { usePathname } from 'next/navigation';
import Footer from './footer';
import { Header } from './header';
import constants from '../lib/constants';
import { useMobile } from '../lib/hooks';

export default function ChatLayout({ children }) {
    const rawPathname = usePathname().slice(1).split('/').pop();
    const pathname = rawPathname.charAt(0).toUpperCase().concat(rawPathname.slice(1));
    const mobile = useMobile();

    return (
        <div className='app'>
            <Head>
                <link rel='icon' href='/logo.svg' />
                <meta name='theme-color' content='#000000' />
                <meta name='description' content={constants.SITE_DESCRIPTION} />
                <title>{`${pathname || 'Home'} | ${constants.SITE_NAME}`}</title>
            </Head>
            <main>
                <noscript>You need to enable JavaScript to run this app.</noscript>
                <div style={{ maxHeight: '100vh', overflowY: 'hidden' }}>
                    <Header />
                    <Box h={`calc(100vh - ${mobile ? '160px' : '150px'})`}>
                        {children}
                    </Box>
                    <Footer />
                </div>
            </main>
        </div>
    )
}