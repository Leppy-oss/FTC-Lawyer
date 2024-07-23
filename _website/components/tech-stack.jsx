import { Center, Container, Flex, Image, Text, Tooltip } from '@mantine/core';
import classes from '../styles/tech-stack.module.css';
import { IconBrandMantine, IconBrandNextjs } from '@tabler/icons-react';
import { useMobile } from '../lib/hooks';

export default function TechStack() {
    const mobile = useMobile();
    const icons = [
        {
            icon: IconBrandMantine,
            label: 'Mantine UI'
        },
        {
            icon: IconBrandNextjs,
            label: 'Next.js'
        }
    ];
    const imgs = [
        {
            src: '/qdrant-logo.png',
            label: 'Qdrant Vector Storage'
        },
        {
            src: '/lc-logo.png',
            label: 'Langchain.js'
        },
        {
            src: '/fs-logo.svg',
            label: 'FTCScout API'
        }
    ];

    return (
        <Container fluid p={0}>
            <Center>
                <Text ta='center' w='fit-content' fw={700} size={mobile ? '3rem' : '4rem'} mb='md' variant='gradient' gradient={{ from: 'blue', to: 'pink' }}>Tech Stack</Text>
            </Center>
            <Container style={{ overflowX: 'hidden' }} fluid p={0} bg='gray'>
                <Flex direction='row' wrap='nowrap' py='xs' className={classes.marquee} h='8rem'>
                    {icons.map(icon => <Center mx='xl' key={icon.label}>
                        <Tooltip label={icon.label}>
                            <icon.icon color='white' size='7rem' />
                        </Tooltip>
                    </Center>)}
                    {imgs.map(img =>
                        <Tooltip key={img.label} label={img.label}>
                            <Image px='xl' mah='100%' src={img.src} alt='' />
                        </Tooltip>
                    )}
                    {icons.map(icon => <Center mx='xl' key={icon.label}>
                        <Tooltip label={icon.label}>
                            <icon.icon color='white' size='7rem' />
                        </Tooltip>
                    </Center>)}
                    {imgs.map(img =>
                        <Tooltip key={img.label} label={img.label}>
                            <Image px='xl' mah='100%' src={img.src} alt='' />
                        </Tooltip>
                    )}
                    {icons.map(icon => <Center mx='xl' key={icon.label}>
                        <Tooltip label={icon.label}>
                            <icon.icon color='white' size='7rem' />
                        </Tooltip>
                    </Center>)}
                    {imgs.map(img =>
                        <Tooltip key={img.label} label={img.label}>
                            <Image px='xl' mah='100%' src={img.src} alt='' />
                        </Tooltip>
                    )}
                </Flex>
            </Container>
        </Container>
    )
}