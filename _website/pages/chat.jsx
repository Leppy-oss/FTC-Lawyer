import { Center, Stack, Image, ScrollArea, Container, Paper, Group, Box } from '@mantine/core';
import HumanInput from '../components/search';
import { postWithHandling } from '../lib/fetch-ex';
import { useState } from 'react';
import ChatLayout from '../components/chat-layout';
import { useMobile } from '../lib/hooks';
import classes from '../styles/chat.module.css';
import { IconCircuitMotor, IconFlame, IconGauge, IconUsb } from '@tabler/icons-react';
import { DEFAULT_THEME as theme } from '@mantine/core';

const Suggestion = ({ Icon, children, mobile, colors, shouldTransition }) => (
    <Paper className={`${classes.suggestion} ${!shouldTransition ? classes.noTransition : ''}`} radius='lg' p='md' withBorder w={mobile ? '50%' : '25%'}>
        <Stack c='dimmed' gap='xs'>
            <Box lightHidden><Icon stroke={1} color={colors[0]} /></Box>
            <Box darkHidden><Icon stroke={1} color={colors[1]} /></Box>
            {children}
        </Stack>
    </Paper>
);

export default function Chat() {
    // Inference API parameters
    const [query, setQuery] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const [submitted, setSubmitted] = useState(false);
    const [recv, setRecv] = useState(false);

    // Output state
    const [output, setOutput] = useState('');

    const mobile = useMobile();

    return (
        <Stack w='100%' mt='md' h='100%'>
            <ScrollArea mah='100%' flex='1'>
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
                                shouldTransition={!chatHistory.length}>
                                {suggestion.text}
                            </Suggestion>)}
                        </Group>
                    </Container>
                </Center>
            </ScrollArea>
            <Center w='100%' py='lg'>
                <HumanInput
                    disabled={submitted}
                    onSubmit={async e => {
                        e.preventDefault();
                        setSubmitted(true);
                        setRecv(false);
                        const initChatHistory = [];
                        setChatHistory([...initChatHistory, query]);
                        const response = await postWithHandling('/api/inference/', { query, chat_history: chatHistory }, {
                            responseType: 'stream',
                            adapter: 'fetch'
                        });
                        if (response) {
                            const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
                            let tempOutput = '';
                            setRecv(true);
                            while (true) {
                                const { value, done } = await reader.read();
                                if (done) break;
                                tempOutput += value;
                                setOutput(tempOutput);
                            }
                            console.log(tempOutput);
                            setChatHistory([...initChatHistory, query, tempOutput]);
                            setSubmitted(false);
                        }
                    }}
                    buttonDisabled={!query || submitted}
                    onChange={e => setQuery(e.target.value)}
                    w={mobile ? '90%' : '70%'}
                    placeholder='Message FTC Lawyer' />
            </Center>
        </Stack>
    );
}

Chat.getLayout = page => (
    <ChatLayout>{page}</ChatLayout>
);