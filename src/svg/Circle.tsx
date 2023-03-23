import type { SVGProps } from 'react';

export default function Circle(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" {...props}>
            <circle cx={50} cy={50} r={50} />
        </svg>
    );
}
