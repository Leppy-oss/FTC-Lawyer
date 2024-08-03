import { Center, Stack, Image, ScrollArea, Container, Paper, Group, Box, Text, LoadingOverlay, ActionIcon, rem, Drawer, Slider, SegmentedControl, Alert, Checkbox } from '@mantine/core';
import HumanInput from '../components/human-input';
import { postWithHandling } from '../lib/fetch-ex';
import { useEffect, useRef, useState } from 'react';
import ChatLayout from '../components/chat-layout';
import { useMobile } from '../lib/hooks';
import classes from '../styles/chat.module.css';
import { IconBolt, IconCircuitMotor, IconFlame, IconGauge, IconInfoCircle, IconSettings, IconUsb } from '@tabler/icons-react';
import { DEFAULT_THEME as theme } from '@mantine/core';
import Message from '../components/message';
import { useDisclosure, useMounted } from '@mantine/hooks';
import Swal from 'sweetalert2';
import llama3Tokenizer from 'llama3-tokenizer-js';

const Suggestion = ({ Icon, children, mobile, colors, shouldTransition, onClick }) => (
    <Paper className={`${classes.suggestion} ${!shouldTransition ? classes.noTransition : ''}`} radius='lg' p='md' withBorder w={mobile ? '50%' : '25%'} onClick={onClick}>
        <Stack c='dimmed' gap='xs'>
            <Box lightHidden><Icon stroke={1} color={colors[0]} /></Box>
            <Box darkHidden><Icon stroke={1} color={colors[1]} /></Box>
            {children}
        </Stack>
    </Paper>
);

export default function Chat() {
    const [query, setQuery] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [output, setOutput] = useState('');
    const [opened, { open, close }] = useDisclosure(false);
    const [mode, setMode] = useState('Precise');
    const [alert, setAlert] = useState(false);
    const [temperature, setTemperature] = useState(0);
    const [narrate, setNarrate] = useState(false);
    const [stream, setStream] = useState(true);
    const [responseTime, setResponseTime] = useState(0);
    const [streamTime, setStreamTime] = useState(0);
    const [recv, setRecv] = useState(false);
    const mounted = useMounted();

    const vp = useRef();
    const mobile = useMobile();

    const scrollVp = () => vp.current.scrollTo({ top: vp.current.scrollHeight, behavior: 'smooth' });

    const queryLawyer = async toQuery => {
        setRecv(false);
        setQuery('');
        setResponseTime(0);
        setSubmitted(true);
        const initChatHistory = [...chatHistory];
        setChatHistory([...initChatHistory, toQuery]);
        setOutput('');
        const startResponseTime = Date.now();
        const timeout = setTimeout(() => { if (!recv) setResponseTime(Date.now() - startResponseTime); }, 6000);
        const response = await postWithHandling(`/api/inference/${mode.toLowerCase().includes('lightning') ? 'lightning/' : ''}`, { query: toQuery, chat_history: chatHistory, temperature }, {
            responseType: 'stream',
            adapter: 'fetch'
        });
        setRecv(true);
        clearTimeout(timeout);
        setTimeout(500, scrollVp);
        const startTime = Date.now();
        setResponseTime(startTime - startResponseTime);
        if (response) {
            const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
            let tempOutput = '';
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                tempOutput += value;
                if (stream) {
                    setOutput(tempOutput);
                    scrollVp();
                }
            }
            setStreamTime(Date.now() - startTime)
            if (!stream) setOutput(tempOutput);
            scrollVp();
            if (narrate) {
                const u = new SpeechSynthesisUtterance(tempOutput);
                u.pitch = 2;
                u.rate = 1.5;
                speechSynthesis.speak(u);
            }
            setChatHistory([...initChatHistory, toQuery, tempOutput]);
            setSubmitted(false);
        }
    };

    return (
        <Stack w='100%' mt='md' h='100%'>
            <ScrollArea mah='100%' flex='1' viewportRef={vp}>
                <Center w='100%' pos='absolute' h='100%' style={{ visibility: chatHistory.length ? 'hidden' : 'visible' }}>
                    <Container p={0} w={mobile ? '90%' : '70%'}>
                        <Image src='/chat-banner.png' alt='' opacity={0.5} lightHidden />
                        <Image src='/chat-banner.png' alt='' opacity={1.0} darkHidden />
                        <Group mt='md' wrap='nowrap' align='flex-start'>
                            {[
                                {
                                    icon: IconCircuitMotor,
                                    text: 'How many motors are allowed on a robot?',
                                    colorLight: theme.colors.blue[6],
                                    colorDark: theme.colors.blue[3]
                                },
                                {
                                    icon: IconGauge,
                                    visMob: true,
                                    text: 'Can I overclock a servo to 7.4V?',
                                    colorLight: theme.colors.yellow[5],
                                    colorDark: theme.colors.yellow[3]
                                },
                                {
                                    icon: IconUsb,
                                    text: 'Is an external USB power bank allowed?',
                                    colorLight: theme.colors.pink[5],
                                    colorDark: theme.colors.pink[3]
                                },
                                {
                                    icon: IconFlame,
                                    visMob: true,
                                    text: 'Is it illegal to set fire to a robot?',
                                    colorLight: theme.colors.orange[5],
                                    colorDark: theme.colors.orange[3]
                                },
                            ].map(suggestion => (!mobile || suggestion.visMob) && <Suggestion mobile
                                key={suggestion.text}
                                Icon={suggestion.icon}
                                colors={[suggestion.colorDark, suggestion.colorLight]}
                                shouldTransition={!chatHistory.length}
                                onClick={() => queryLawyer(suggestion.text)}>
                                {suggestion.text}
                            </Suggestion>)}
                        </Group>
                    </Container>
                </Center>
                <Container pos='sticky' top={0} style={{ visibility: alert ? 'visible' : 'hidden' }}>
                    {mode.toLowerCase().includes('lightning') &&
                        <Alert variant='light' color='blue' title='Notice' withCloseButton icon={<IconInfoCircle />} onClose={() => setAlert(false)}>
                            You have enabled Lightning⚡ Mode. Your chat history will not be saved, and results may be subpar.
                        </Alert>
                    }
                </Container>
                <Stack>
                    {(() => {
                        let human = false;
                        const chatHistoryMessages = chatHistory.map((msg, index) => {
                            human = !human;
                            return <Message key={index} human={human}>{msg}</Message>;
                        });
                        if (chatHistoryMessages.length % 2) chatHistoryMessages.push(
                            <Message key={chatHistoryMessages.length} human={false}>{output ||
                                <Box pos='relative' h='2rem' w='3rem'>
                                    <LoadingOverlay
                                        w='100%'
                                        h='100%'
                                        visible
                                        overlayProps={{ opacity: '0' }}
                                        loaderProps={{ color: 'white', type: 'dots' }}
                                    />
                                </Box>
                            }</Message>
                        );
                        else if (chatHistoryMessages.length) {
                            chatHistoryMessages.push(<Group mx={mobile ? '62px' : '84px'} px={mobile ? 'md' : 'lg'} key={1e9} gap='xs'>
                                {!mobile && <>
                                    <Text size={mobile ? 'sm' : 'md'} fs='italic'>Response: {parseInt(responseTime)} ms</Text>
                                    <IconBolt style={{ transform: 'skewX(-12deg)' }} />
                                    <Text size={mobile ? 'sm' : 'md'} fs='italic'>Inference: {parseInt(streamTime)} ms</Text>
                                    <IconBolt style={{ transform: 'skewX(-12deg)' }} />
                                </>}
                                <Text size={mobile ? 'sm' : 'md'} fs='italic'>Tokens/s: {Math.round(llama3Tokenizer.encode(chatHistory[chatHistory.length - 1]).length / streamTime * 1e6) / 1e2}</Text>
                                {mobile && <IconBolt style={{ transform: 'skewX(-12deg)' }} />}
                            </Group>)
                            if (mounted) scrollVp();
                        }
                        if (responseTime > 6000 && chatHistoryMessages.length) {
                            chatHistoryMessages.push(
                                <Alert key={2e9} variant='light' mx='xl' w={mobile ? '80%' : '50%'} color='blue' title='Notice' icon={<IconInfoCircle />}>
                                    You seem to experiencing very high response times; this may be caused by a rate limit on our end. Try using Lightning⚡ Mode for now! (Click ⚙️ icon for settings.)
                                </Alert>
                            );
                            if (mounted) scrollVp();
                        }
                        return chatHistoryMessages;
                    })()}
                </Stack>
            </ScrollArea>
            <form onSubmit={async e => {
                e.preventDefault();
                await queryLawyer(query);
            }}>
                <Center w='100%' py='lg' display='flex' style={{ flexFlow: 'column', gap: '10px' }}>
                    <HumanInput
                        size={mobile ? 'sm' : 'lg'}
                        value={query}
                        leftSection={
                            <>
                                <ActionIcon lightHidden size={36} radius='xl' variant='transparent' onClick={open} c='white'>
                                    <IconSettings style={{ width: rem(24), height: rem(24) }} stroke={2} />
                                </ActionIcon>
                                <ActionIcon darkHidden size={36} radius='xl' variant='transparent' onClick={open} c='gray'>
                                    <IconSettings style={{ width: rem(24), height: rem(24) }} stroke={2} />
                                </ActionIcon>
                            </>
                        }
                        disabled={submitted}
                        buttonDisabled={!query || submitted}
                        onChange={e => setQuery(e.target.value)}
                        w={mobile ? '90%' : '70%'}
                        placeholder='Message FTC Lawyer' />
                    <input type='submit' style={{ display: 'none' }} />
                    <Text c='dimmed' size='xs'>FTC Lawyer is an AI assistant that can make mistakes.</Text>
                    <Drawer size='200px' opened={opened} onClose={close} title={<Text fw={700} size='xl'>PARAMETERS</Text>} position='bottom' offset={8} radius='md'>
                        <Group grow>
                            <Container p={0}>
                                <Text fw={600}>Temperature</Text>
                                <Slider
                                    step={0.025}
                                    mt='md'
                                    min={0}
                                    max={1}
                                    value={temperature}
                                    onChange={setTemperature}
                                    marks={mobile ? [] : [
                                        { value: 0.2, label: '20%' },
                                        { value: 0.5, label: '50%' },
                                        { value: 0.8, label: '80%' },
                                    ]}
                                />
                            </Container>
                            <Container p={0}>
                                <Text mt='xl' fw={600}>Mode</Text>
                                <SegmentedControl
                                    mt='md'
                                    data={['Precise', 'Lightning⚡']}
                                    value={mode}
                                    onChange={e => {
                                        if (e.toLowerCase().includes('lightning')) {
                                            Swal.fire({
                                                title: 'NOTICE',
                                                icon: 'warning',
                                                text: 'Lightning mode will delete all chat history!',
                                                showCancelButton: true,
                                                confirmButtonColor: theme.colors.blue[6],
                                                cancelButtonColor: theme.colors.red[6]
                                            }).then(res => {
                                                if (res.isConfirmed) {
                                                    setAlert(true);
                                                    setMode(e);
                                                    setChatHistory([]);
                                                }
                                            });
                                        }
                                        else {
                                            setAlert(false);
                                            setMode(e);
                                            setChatHistory([]);
                                        }
                                    }}
                                />
                            </Container>
                            <Stack>
                                <Text mt='xl' fw={600}>Stream Output</Text>
                                <Checkbox size='lg' variant='outline' checked={stream} onChange={e => setStream(e.currentTarget.checked)} />
                            </Stack>
                            <Stack>
                                <Text mt='xl' fw={600}>Narrate Output</Text>
                                <Checkbox size='lg' variant='outline' checked={narrate} onChange={e => setNarrate(e.currentTarget.checked)} />
                            </Stack>
                        </Group>
                    </Drawer>
                </Center>
            </form>
        </Stack >
    );
}

Chat.getLayout = page => (
    <ChatLayout>{page}</ChatLayout>
);