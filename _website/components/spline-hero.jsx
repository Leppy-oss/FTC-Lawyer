import { Container } from '@mantine/core';
import Spline from '@splinetool/react-spline';
import { useMobile } from '../lib/hooks';
import { useEffect, useState } from 'react';

export default function SplineHero() {
    const mobile = useMobile();
    const [baseWidth, setBaseWidth] = useState(500);

    useEffect(() => {
        setBaseWidth(document.documentElement.clientWidth);
        window.addEventListener('resize', () => setBaseWidth(document.documentElement.clientWidth));
    }, [])

    return (
        <Container p={0} h={mobile? '100' : '200'}>
            <Container p={0} pos='relative' darkHidden>
                <Spline scene={process.env.NEXT_PUBLIC_SUL} />
            </Container>
            <Container p={0} pos='relative' lightHidden>
                <Spline scene={process.env.NEXT_PUBLIC_SUD} />
            </Container>
        </Container>
    );
}