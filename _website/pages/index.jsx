import { Button, Checkbox, Container, Divider, Group, Image, Switch, Text } from '@mantine/core';
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
        <Group mb='sm' style={{ zoom: mobile ? 0.65 : 1.25 }} ml='xl' mt={mobile && 'xl'}>
            <Switch checked={true} readOnly size='xl' thumbIcon={
                <Icon style={{ width: '24', height: '24' }}
                    color={theme.colors.blue[6]}
                    stroke={2} />
            } />
            <Text size='xl' fw={500}>{children}</Text>
        </Group>
    );

    const DummyCheckbox = ({ children }) => (
        <Group mb='sm' style={{ zoom: mobile ? 0.75 : 1.2 }} ml='xl' mt={mobile && 'xl'}>
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
                <Section text='What is FTC Lawyer?' my='xl' description={
                    <>
                        FTC Lawyer is the world's <Text span fw={700} c='blue'>first </Text>
                        FIRST Tech Challenge (FTC) lawyer system that <Text span fw={700} c='blue'>fully </Text> utilizes the power of
                        <Text span fw={700} c='blue'> generative AI.</Text> It retrieves information from the Game Manuals and <Text span fw={700} c='blue'>live</Text> FTC Q&A feed.
                    </>
                } additionalContent={
                    <Link href='/chat'><Button mt='xl' size='xl' rightSection={<IconArrowNarrowRight />} variant='gradient' gradient={{ from: 'pink', to: 'orange' }}>
                        Try it Out
                    </Button></Link>
                }>
                    <ScrollHero />
                </Section>
                <Section text='Revolutionizing the Rulebook' description={
                    <>
                        With the power of generative AI, FTC Lawyer makes
                        <Text span fw={700} c='blue'> anything possible.</Text>
                    </>
                }>
                    <DummySwitch Icon={IconSpeedboat}>Lawyer Speed</DummySwitch>
                    <DummySwitch Icon={IconChairDirector}>Lawyer Ease</DummySwitch>
                    <DummySwitch Icon={IconBrandOpenai}>Lawyer Intelligence</DummySwitch>
                </Section>
                <Section text='Blazing Fast Descriptions' reversed description={
                    <>
                        Groq's LPU (Language-Processing Unit) AI inference engine streams <Text span fw={700} c='blue'>15x</Text> faster than competitors, achieving up to
                        <Text span fw={700} c='blue'>330 tokens/s.</Text>
                    </>
                } src='/groq.webp' />
                <Section text='Incredible Versatility' description={
                    <>
                        With <Text span fw={700} c='blue'>700+</Text> vectorized documents and live RSS updates,
                        FTC Lawyer empowers its users with a <Text span fw={700} c='blue'>superhuman</Text> overview of the FTC rulebook.
                    </>
                }>
                    <DummyCheckbox>Rapid Retrieval</DummyCheckbox>
                    <DummyCheckbox>Complex Reasoning</DummyCheckbox>
                    <DummyCheckbox>Chat History</DummyCheckbox>
                    <DummyCheckbox>Gracious Professionalism</DummyCheckbox>
                </Section>
                <Divider my='xl' size='xl' mx='sm' />
            </Container>
            <TechStack />
        </Container>
    );
}