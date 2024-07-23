import Swal from 'sweetalert2';
import { DEFAULT_THEME as theme} from '@mantine/core';

export default function fire(opts) { return Swal.fire({ confirmButtonColor: theme.colors.blue[6], ...opts }); }

export const error = (title, error) => fire({
    title,
    text: error,
    confirmButtonText: 'OK',
    icon: 'error',
});