import { Container, Divider, Grid, Image, Text } from '@mantine/core';
import { useMobile } from '../lib/hooks';

export default function Section({ text, description, children, src, additionalContent, reversed = false, ...props }) {
    const mobile = useMobile();

    return (
        <>
            <Divider my='xl' size='xl' mx='sm' />
            <Grid align='center' my='5rem' {...props}>
                <Grid.Col span={mobile ? 12 : 6} ta={mobile ? 'center' : 'left'} order={reversed ? 1 : 0}>
                    <Text mb='xl' fw={500} size={mobile ? '2.5rem' : '3.5rem'}>
                        {text}
                    </Text>
                    <Text size={mobile ? '1.5rem' : '2rem'}>{description}</Text>
                    {additionalContent}
                </Grid.Col>
                <Grid.Col order={reversed ? 0 : 1} span={mobile ? 12 : 6}>
                    <Container fluid p={0}>
                        {children || <Image {...{ [reversed ? 'pr' : 'pl']: mobile ? 0 : 'xl' }} src={src} alt='' />}
                    </Container>
                </Grid.Col>
            </Grid>
        </>
    );
}