import { TextInput, ActionIcon, rem } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';

export default function HumanInput({ buttonDisabled, onSubmit, ...props }) {
    return (
        <TextInput
            autoComplete='off'
            radius='xl'
            leftSectionWidth={48}
            rightSectionWidth={48}
            rightSection={
                <ActionIcon type='submit' size={36} radius='xl' variant='light' disabled={buttonDisabled} onClick={onSubmit}>
                    <IconArrowUp style={{ width: rem(24), height: rem(24) }} stroke={2} />
                </ActionIcon>
            }
            {...props}
        />
    );
}