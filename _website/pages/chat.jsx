import { Center, Stack, Image, ScrollArea, Container, Paper, Group } from '@mantine/core';
import HumanInput from '../components/search';
import { postWithHandling } from '../lib/fetch-ex';
import { useState } from 'react';
import ChatLayout from '../components/chat-layout';
import { useMobile } from '../lib/hooks';
import classes from '../styles/chat.module.css';
import { IconCircuitMotor, IconFlame, IconGauge, IconUsb } from '@tabler/icons-react';
import { DEFAULT_THEME as theme } from '@mantine/core';

const Suggestion = ({ children, mobile }) => (
    <Paper className={classes.suggestion} radius='lg' p='md' withBorder w={mobile ? '50%' : '25%'}>
        <Stack gap='xs'>{children}</Stack>
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
                <Center w='100%' pos='absolute' h='100%'>
                    <Container p={0} w={mobile ? '90%' : '70%'}>
                        <Image src='/chat-banner.png' alt='' opacity={0.5} lightHidden />
                        <Image src='/chat-banner.png' alt='' opacity={1.0} darkHidden />
                        <Group mt='md' wrap='nowrap' align='flex-start'>
                            <Suggestion mobile>
                                <IconCircuitMotor stroke={1} color={theme.colors.blue[3]} />
                                How many motors are allowed on a robot?
                            </Suggestion>
                            <Suggestion mobile>
                                <IconGauge stroke={1} color='yellow' />
                                Can I overclock a servo to 7.4V?
                            </Suggestion>
                            {!mobile && <>
                                <Suggestion mobile>
                                    <IconUsb stroke={1} color='pink' />
                                    Is an external USB power bank allowed?
                                </Suggestion>
                                <Suggestion mobile>
                                    <IconFlame stroke={1} color='orange' />
                                    Is it illegal to set fire to an opponent?
                                </Suggestion>
                            </>}
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
                            setChatHistory([...chatHistory, query, tempOutput]);
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