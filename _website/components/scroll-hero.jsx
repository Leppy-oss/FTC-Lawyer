import { AspectRatio } from '@mantine/core';
import { useEffect, useRef } from 'react';

export default function ScrollHero() {
    const canvasRef = useRef(null);

    useEffect(() => {
        /** @type {HTMLCanvasElement} */
        const canvas = canvasRef.current;
        /** @type {CanvasRenderingContext2D} */
        const ctx = canvas.getContext('2d');

        canvas.width = 900;
        canvas.height = 900;

        const frameCount = 92;

        // Preload images
        const imgs = Array.from({ length: frameCount }, (x, i) => i).map(i => {
            const img = new Image(); img.src = `/output/frame${i}.png`;
            return img;
        });
        let img = imgs.at(0);
        img.onload = () => ctx.drawImage(img, 0, 0);

        const updateImg = i => {
            try {
                img = imgs[i];
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0);
            } catch (e) { }
        }
        window.addEventListener('scroll', () => {
            const startScroll = canvas.offsetTop - canvas.offsetHeight * 0.75;
            const endScroll = canvas.offsetTop + canvas.offsetHeight * 0.25;
            const scrollTop = document.documentElement.scrollTop;
            const scrollFraction = (scrollTop - startScroll) / (endScroll - startScroll);
            const frameIndex = Math.max(0, Math.min(frameCount - 1, Math.ceil(scrollFraction * frameCount)));
            requestAnimationFrame(() => updateImg(frameIndex));
        });
    }, [canvasRef]);

    return (
        <div>
            <AspectRatio>
                <canvas width={1600} height={900} ref={canvasRef} />
            </AspectRatio>
        </div>
    )
}