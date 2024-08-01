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
            src: '/mongodb-logo.png',
            label: 'MongoDB Atlas Vector Search'
        },
        {
            src: '/lc-logo.png',
            label: 'LangChain.js'
        },
        {
            src: '/fs-logo.svg',
            label: 'FTCScout API'
        }
    ];

    return (
        <Container mb='xl' fluid p={0}>
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