// src/screens/home/index.tsx

import { ColorSwatch, Group, Text, Tooltip } from '@mantine/core';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState, FC, MouseEvent } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import { SWATCHES } from '@/constants';

interface GeneratedResult {
    expression: string;
    answer: string;
}

interface ResponseData {
    expr: string;
    result: string;
    assign: boolean;
}

interface BackendResponse {
    message: string;
    data: ResponseData[];
    status: string;
}

interface DictOfVars {
    [key: string]: string;
}

const Home: FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [color, setColor] = useState<string>('rgb(0, 0, 0)');
    const [reset, setReset] = useState<boolean>(false);
    const [dictOfVars, setDictOfVars] = useState<DictOfVars>({});
    const [result, setResult] = useState<GeneratedResult | undefined>();
    const [latexPosition, setLatexPosition] = useState<{ x: number; y: number }>({ x: 10, y: 200 });
    const [latexExpression, setLatexExpression] = useState<string[]>([]);

    // Load MathJax script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            (window as any).MathJax.Hub.Config({
                tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
            });
            (window as any).MathJax.Hub.Queue(['Typeset', (window as any).MathJax.Hub]);
        };

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - canvas.offsetTop;
                ctx.lineCap = 'round';
                ctx.lineWidth = 3;

                // Initialize background to white
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, []);

    // Handle LaTeX expression rendering
    useEffect(() => {
        if (latexExpression.length > 0 && (window as any).MathJax) {
            (window as any).MathJax.Hub.Queue(['Typeset', (window as any).MathJax.Hub, 'latex-content']);
        }
    }, [latexExpression]);

    // Handle result changes
    useEffect(() => {
        if (result) {
            renderLatexToCanvas(result.expression, result.answer);
        }
    }, [result]);

    // Handle reset
    useEffect(() => {
        if (reset) {
            resetCanvas();
            setLatexExpression([]);
            setResult(undefined);
            setDictOfVars({});
            setReset(false);
        }
    }, [reset]);

    const renderLatexToCanvas = (expression: string, answer: string) => {
        const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
        setLatexExpression((prev) => [...prev, latex]);

        // Clear the main canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Re-fill with white background
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Re-fill with white background
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                setIsDrawing(true);
            }
        }
    };

    const draw = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.strokeStyle = color;
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                ctx.stroke();
            }
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const runRoute = async () => {
        const canvas = canvasRef.current;

        if (canvas) {
            try {
                const imageDataURL = canvas.toDataURL('image/png');
                console.log('Sending image data to backend:', imageDataURL.substring(0, 100) + '...'); // Log first 100 chars

                const response = await axios.post<BackendResponse>(`${import.meta.env.VITE_API_URL}/calculate`, {
                    image: imageDataURL,
                    dict_of_vars: dictOfVars,
                });

                const resp = response.data;
                console.log('Response from backend:', resp);

                if (resp.status === 'error') {
                    alert(resp.message);
                    return;
                }

                resp.data.forEach((data: ResponseData) => {
                    if (data.assign) {
                        setDictOfVars((prev) => ({
                            ...prev,
                            [data.expr]: data.result,
                        }));
                    }
                });

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    console.error('Unable to get canvas context.');
                    return;
                }

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let minX = canvas.width,
                    minY = canvas.height,
                    maxX = 0,
                    maxY = 0;

                for (let y = 0; y < canvas.height; y++) {
                    for (let x = 0; x < canvas.width; x++) {
                        const i = (y * canvas.width + x) * 4;
                        if (imageData.data[i + 3] > 0) { // If pixel is not transparent
                            minX = Math.min(minX, x);
                            minY = Math.min(minY, y);
                            maxX = Math.max(maxX, x);
                            maxY = Math.max(maxY, y);
                        }
                    }
                }

                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;

                setLatexPosition({ x: centerX, y: centerY });

                resp.data.forEach((data: ResponseData) => {
                    setTimeout(() => {
                        setResult({
                            expression: data.expr,
                            answer: data.result,
                        });
                    }, 1000);
                });
            } catch (error) {
                console.error('Error during runRoute:', error);
                alert('An error occurred while processing the image. Please try again.');
            }
        }
    };

    return (
        <div className="relative w-full h-screen">
            <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">MathScribe</h1>
                <Group>
                    {SWATCHES.map((swatch) => (
                        <ColorSwatch key={swatch} color={swatch} onClick={() => setColor(swatch)} style={{ cursor: 'pointer' }} />
                    ))}
                </Group>
                <div className="flex space-x-2">
                    <Button
                        onClick={() => setReset(true)}
                        className='bg-black hover:bg-gray-800 text-white'
                        variant='default'
                    >
                        Reset
                    </Button>
                    <Button
                        onClick={runRoute}
                        className='bg-black hover:bg-gray-800 text-white'
                        variant='default'
                    >
                        Run
                    </Button>
                </div>
            </header>
            <canvas
                ref={canvasRef}
                id='canvas'
                className='absolute top-16 left-0 w-full h-full border border-gray-300 shadow-lg'
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            />

            {latexExpression && latexExpression.map((latex, index) => (
                <Draggable
                    key={index}
                    defaultPosition={latexPosition}
                    onStop={(e, data) => setLatexPosition({ x: data.x, y: data.y })}
                >
                    <div className="absolute p-2 bg-white text-black rounded shadow-md">
                        <div className="latex-content" id={`latex-content-${index}`} dangerouslySetInnerHTML={{ __html: latex }} />
                    </div>
                </Draggable>
            ))}
        </div>
    );
};

export default Home;