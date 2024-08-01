import { TextInput, ActionIcon, rem } from '@mantine/core';
import { IconSearch, IconArrowUp } from '@tabler/icons-react';

export default function HumanInput({ buttonDisabled, onSubmit, ...props }) {
    return (
        <TextInput
            autoComplete='off'
            radius='xl'
            size='lg'
            rightSectionWidth={48}
            leftSection={<IconSearch style={{ width: rem(24), height: rem(24) }} stroke={2} />}
            rightSection={
                <ActionIcon size={36} radius='xl' variant='light' disabled={buttonDisabled} onClick={onSubmit}>
                    <IconArrowUp style={{ width: rem(24), height: rem(24) }} stroke={2} />
                </ActionIcon>
            }
            {...props}
        />
    );
}