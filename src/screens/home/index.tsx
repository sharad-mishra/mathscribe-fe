// src/screens/home/index.tsx

import { ColorSwatch, Group, Switch } from '@mantine/core';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState, MouseEvent, FC } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import { SWATCHES } from '@/constants';
// import { LazyBrush } from 'lazy-brush';

interface GeneratedResult {
    expression: string;
    answer: string;
}

interface Response {
    expr: string;
    result: string;
    assign: boolean;
}

interface BackendResponse {
    message: string;
    data: Response[];
    status: string;
}

interface DictOfVars {
    [key: string]: string;
}

const Home: FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [color, setColor] = useState<string>('rgb(255, 255, 255)');
    const [reset, setReset] = useState<boolean>(false);
    const [dictOfVars, setDictOfVars] = useState<DictOfVars>({});
    const [result, setResult] = useState<GeneratedResult | undefined>();
    const [latexPosition, setLatexPosition] = useState<{ x: number; y: number }>({ x: 10, y: 200 });
    const [latexExpression, setLatexExpression] = useState<string[]>([]);
    const [backgroundColor, setBackgroundColor] = useState<string>('white');

    // const lazyBrush = new LazyBrush({
    //     radius: 10,
    //     enabled: true,
    //     initialPoint: { x: 0, y: 0 },
    // });

    useEffect(() => {
        if (latexExpression.length > 0 && window.MathJax) {
            setTimeout(() => {
                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
            }, 0);
        }
    }, [latexExpression]);

    useEffect(() => {
        if (result) {
            renderLatexToCanvas(result.expression, result.answer);
        }
    }, [result]);

    useEffect(() => {
        if (reset) {
            resetCanvas();
            setLatexExpression([]);
            setResult(undefined);
            setDictOfVars({});
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        const canvas = canvasRef.current;
    
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight - 80; // Adjust height for footer
                ctx.lineCap = 'round';
                ctx.lineWidth = 3;
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            window.MathJax.Hub.Config({
                tex2jax: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [backgroundColor]);

    const renderLatexToCanvas = (expression: string, answer: string) => {
        const latex = `\\(\\LARGE{${expression} = ${answer}}\\)`;
        setLatexExpression([...latexExpression, latex]);

        // Clear the main canvas
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = backgroundColor;
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
                ctx.fillStyle = backgroundColor;
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
        if (!isDrawing) {
            return;
        }
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
                const response = await axios.post<BackendResponse>(`${import.meta.env.VITE_API_URL}/calculate`, {
                    image: canvas.toDataURL('image/png'),
                    dict_of_vars: dictOfVars
                });

                const resp = response.data;
                console.log('Response', resp);

                resp.data.forEach((data: Response) => {
                    if (data.assign) {
                        setDictOfVars({
                            ...dictOfVars,
                            [data.expr]: data.result
                        });
                    }
                });

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    console.error('Unable to get canvas context.');
                    return;
                }

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

                for (let y = 0; y < canvas.height; y++) {
                    for (let x = 0; x < canvas.width; x++) {
                        const i = (y * canvas.width + x) * 4;
                        if (imageData.data[i + 3] > 0) {  // If pixel is not transparent
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

                resp.data.forEach((data: Response) => {
                    setTimeout(() => {
                        setResult({
                            expression: data.expr,
                            answer: data.result
                        });
                    }, 1000);
                });
            } catch (error) {
                console.error('Error during runRoute:', error);
                alert('An error occurred while processing the image. Please try again.');
            }
        }
    };

    // Determine text color based on backgroundColor
    const textColorClass = backgroundColor === 'black' ? 'text-white' : 'text-black';

    return (
        <>
            {/* Header */}
            <header className="flex justify-between items-center p-4 bg-gray-800 text-white fixed top-0 left-0 w-full z-10">
                {/* Title */}
                <h1 className="text-2xl font-bold">MathScribe</h1>

                {/* Color Swatches */}
                <Group className="mx-auto">
                    {SWATCHES.map((swatch) => (
                        <ColorSwatch 
                            key={swatch} 
                            color={swatch} 
                            onClick={() => setColor(swatch)} 
                            style={{ cursor: 'pointer' }} 
                        />
                    ))}
                </Group>

                {/* Controls */}
                <div className="flex items-center space-x-4">
                    {/* Toggle Switch for Background Color */}
                    <Group>
                        <span className="mr-2">White</span>
                        <Switch 
                            checked={backgroundColor === 'black'} 
                            onChange={(event) => setBackgroundColor(event.currentTarget.checked ? 'black' : 'white')} 
                            size="md"
                        />
                        <span className="ml-2">Black</span>
                    </Group>

                    {/* Reset Button */}
                    <Button
                        onClick={() => setReset(true)}
                        className='bg-black hover:bg-gray-800 text-white'
                        variant='default'
                        color='black'
                    >
                        Reset
                    </Button>

                    {/* Run Button */}
                    <Button
                        onClick={runRoute}
                        className='bg-black hover:bg-gray-800 text-white'
                        variant='default'
                        color='white'
                    >
                        Run
                    </Button>
                </div>
            </header>

            {/* Spacer to prevent canvas from being hidden behind the fixed header */}
            <div className="h-16"></div>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                id='canvas'
                className='absolute top-16 left-0 w-full h-full'
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            />

            {/* LaTeX Expressions */}
            {latexExpression.map((latex, index) => (
                <Draggable
                    key={index}
                    defaultPosition={latexPosition}
                    onStop={(_, data) => setLatexPosition({ x: data.x, y: data.y })}
                >
                    <div className={`absolute p-2 rounded shadow-md ${textColorClass}`}>
                        <div className="latex-content" dangerouslySetInnerHTML={{ __html: latex }} />
                    </div>
                </Draggable>
            ))}

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 w-full text-center p-2 bg-gray-800 text-white">
                This project was created by Sharad Mishra ;)
            </footer>
        </>
    );
};

export default Home;