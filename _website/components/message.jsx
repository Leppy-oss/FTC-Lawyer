import { Container, Group, Paper, Text } from '@mantine/core';
import classes from '../styles/messages.module.css';
import { IconRobotFace } from '@tabler/icons-react';
import { useMobile } from '../lib/hooks';

export default function Message({ human, children }) {
    const mobile = useMobile();

    if (human) return (
        <Container fluid p={0} w='100%' mt='md'>
            <Paper className={classes.humanMessage} px={mobile ? 'md' : 'lg'} radius={mobile ? 'lg' : 'xl'} mr={mobile ? 'sm' : 'xl'} maw={mobile ? '80%' : '40%'} style={{ float: 'right' }} ta='left'>
                <Text p={mobile ? 'xs' : 'sm'} size={mobile ? 'sm' : 'md'}>{children}</Text>
            </Paper>
        </Container>
    );
    return (
        <Container fluid p={0} w='100%' mt='md'>
            <Paper className={classes.message} px={mobile ? 'md' : 'lg'} ml={mobile ? 'sm' : 'xl'} radius={mobile ? 'lg' : 'xl'} ta='left'>
                <Group align={typeof children == 'string' ? 'flex-start' : 'center'}>
                    <IconRobotFace />
                    {typeof children == 'string' ? <Text size={mobile ? 'sm' : 'md'} maw='80%' px={mobile ? 'xs' : 'sm'}>{children}</Text> : children}
                </Group>
            </Paper>
        </Container>
    );
}