import { Box, Center, Container, Group, LoadingOverlay, MultiSelect, Select, Stack, Textarea as TextArea, Text, Title } from '@mantine/core';
import Search from './search';
import { fetchWithHandling, postWithHandling } from '../lib/fetch-ex';
import { useEffect, useState } from 'react';
import { IconArrowNarrowDown } from '@tabler/icons-react';
import { useMobile } from '../lib/hooks';

export default function Tryout() {
    // Inference API parameters
    const [query, setQuery] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const [submitted, setSubmitted] = useState(false);
    const [recv, setRecv] = useState(false);

    // Output state
    const [output, setOutput] = useState('');

    const mobile = useMobile();

    return (
        <Container fluid mt='xl'>
            <Center>
                <Title mb='md' order={1} size={mobile ? '3rem' : '4rem'}>Try it Out</Title>
            </Center>
            <Center mb='md'>
                <IconArrowNarrowDown size='2rem' />
            </Center>
            <Center>
                <Text mb='xl' fw={700} order={1} size={mobile ? '3rem' : '4rem'} variant='gradient' gradient={{ from: 'blue', to: 'pink' }}>FTC Lawyer</Text>
            </Center>
            <Center>
                <form onSubmit={async e => {
                    e.preventDefault();
                    setSubmitted(true);
                    setRecv(false);
                    const response = await postWithHandling('/api/inference/fast/', { query, chat_history: chatHistory }, {
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
                        setChatHistory([...chatHistory, query, tempOutput]);
                        setSubmitted(false);
                    }
                }}>
                    <Stack w='fit-content' align='stretch' justify='center'>
                        <Search
                            label='Query'
                            required
                            disabled={submitted}
                            id='change-query'
                            onChange={e => setQuery(e.target.value)}
                            placeholder='Ask me anything...' />

                        <Title order={2}>Output</Title>
                        <Box pos='relative'>
                            <LoadingOverlay loaderProps={{ size: 'xs' }} visible={submitted && !recv} />
                            <TextArea value={output} autosize></TextArea>
                        </Box>
                    </Stack>
                </form>
            </Center>
        </Container>
    );
}