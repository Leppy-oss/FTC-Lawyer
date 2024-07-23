import { Button, Checkbox, Container, Divider, Group, Image, Switch, Text } from '@mantine/core';
import Tryout from '../components/tryout';
import Hero from '../components/hero';
import ScrollHero from '../components/scroll-hero';
import Section from '../components/section';
import { IconArrowNarrowRight, IconBrandOpenai, IconChairDirector, IconSpeedboat } from '@tabler/icons-react';
import { DEFAULT_THEME as theme } from '@mantine/core';
import { useMobile } from '../lib/hooks';
import TechStack from '../components/tech-stack';
import Link from 'next/link';

export default function Home() {
    const mobile = useMobile();

    const DummySwitch = ({ Icon, children }) => (
        <Group mb='sm' style={{ zoom: mobile ? 0.7 : 1.5 }} ml='xl' mt={mobile && 'xl'}>
            <Switch checked={true} readOnly size='xl' thumbIcon={
                <Icon style={{ width: '24', height: '24' }}
                    color={theme.colors.blue[6]}
                    stroke={2} />
            } />
            <Text size='xl' fw={500}>{children}</Text>
        </Group>
    );

    const DummyCheckbox = ({ children }) => (
        <Group mb='sm' style={{ zoom: mobile ? 0.75 : 1.5 }} ml='xl' mt={mobile && 'xl'}>
            <Checkbox checked={true} readOnly size='xl' />
            <Text size='xl' fw={500}>{children}</Text>
        </Group>
    );

    return (
        <Container id='home-container' p={0} fluid>
            <Image src='/banner.svg' alt='' pos='absolute' top={0} style={{
                opacity: 0.4,
                zIndex: -1000,
                clipPath: 'polygon(0 0, 100% 0%, 100% 10vh, 0% 30vh)'
            }} darkHidden />
            <Image src='/banner.svg' alt='' pos='absolute' top={0} style={{
                opacity: 0.2,
                zIndex: -1000,
                clipPath: 'polygon(0 0, 100% 0%, 100% 10vh, 0% 30vh)'
            }} lightHidden />
            <Container mx='xl' p={0} fluid>
                <Hero />
                <Section text='What is AI-Scout?' my='xl' description={
                    <>
                        AI-Scout is the world's <Text span fw={700} c='blue'>first </Text>
                        FIRST Tech Challenge (FTC) scouting system that fully utilizes the power of
                        <Text span fw={700} c='blue'> generative AI.</Text>
                    </>
                } additionalContent={
                    <Link href='/chat'><Button mt='xl' size='xl' rightSection={<IconArrowNarrowRight />} variant='gradient' gradient={{ from: 'pink', to: 'orange' }}>
                        Try it Out
                    </Button></Link>
                }>
                    <ScrollHero />
                </Section>
                <Section text='Revolutionizing the World of Scouting' description={
                    <>
                        With the power of generative AI, AI-Scout makes
                        <Text span fw={700} c='blue'> anything possible.</Text>
                    </>
                }>
                    <DummySwitch Icon={IconSpeedboat}>Scouting Speed</DummySwitch>
                    <DummySwitch Icon={IconChairDirector}>Scouting Ease</DummySwitch>
                    <DummySwitch Icon={IconBrandOpenai}>Scouting Intelligence</DummySwitch>
                </Section>
                <Section text='Blazing Fast Descriptions' reversed description={
                    <>
                        {"Groq's LPU (Language-Processing Unit) AI inference engine streams 15x faster than competitors, achieving up to "}
                        <Text span fw={700} c='blue'>330 tokens/s.</Text>
                    </>
                } src='/groq.webp' />
                <Section text='Incredible Versatility' description={
                    <>
                        {"Groq's LPU (Language-Processing Unit) AI inference engine streams 15x faster than competitors, achieving up to "}
                        <Text span fw={700} c='blue'>330 tokens/s.</Text>
                    </>
                }>
                    <DummyCheckbox>Team Comparison</DummyCheckbox>
                    <DummyCheckbox>Match Summary</DummyCheckbox>
                    <DummyCheckbox>In-Depth Analysis</DummyCheckbox>
                    <DummyCheckbox>Score Reasoning</DummyCheckbox>
                </Section>
                <Divider my='xl' size='xl' mx='sm' />
            </Container>
            <TechStack />
        </Container>
    );
}