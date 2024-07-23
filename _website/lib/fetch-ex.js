import { error } from './swal';

export async function fetchWithHandling(url, config={}) {
    try {
        return await ((await fetch(url, config)).json());
    } catch(e) { error(`Error fetching from ${url}`, e); }
}

export async function postWithHandling(url, data, config={}) {
    try {
        return await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            ...config
        });
    } catch(e) { error(`Error communicating with ${url}`, e); }
}