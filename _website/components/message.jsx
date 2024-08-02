import { Container, Group, Paper, Text } from '@mantine/core';
import classes from '../styles/messages.module.css';
import { IconRobotFace } from '@tabler/icons-react';
import { useMobile } from '../lib/hooks';

export default function Message({ human, children }) {
    const mobile = useMobile();

    return <Container fluid p={0} w='100%' mt='md'>
        <Paper className={human ? classes.humanMessage : classes.message} px={mobile ? 'md' : 'lg'} radius={mobile ? 'lg' : 'xl'} mx={mobile ? 'sm' : 'xl'} maw={mobile ? '80%' : human ? '40%' : '100%'} ta='left' style={{ float: human ? 'right' : 'left' }}>
            {
                human ? <Text p={mobile ? 'xs' : 'sm'} size={mobile ? 'sm' : 'md'}>{children}</Text> :
                    <Group align={typeof children == 'string' ? 'flex-start' : 'center'}>
                        <IconRobotFace />
                        {typeof children == 'string' ? <Text maw='80%' size={mobile ? 'sm' : 'md'} px={mobile ? 'xs' : 'sm'}>{children}</Text> : children}
                    </Group>
            }
        </Paper>
    </Container>
}