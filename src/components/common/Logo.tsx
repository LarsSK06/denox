import { ComponentProps } from "react";

type LogoProps = ComponentProps<"svg">;

const Logo = (props: LogoProps) => (
    <svg
        width="100%"
        height="100%"
        viewBox="0 0 960 960"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style={{
            fillRule: "evenodd",
            clipRule: "evenodd",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 1.5
            // FROM: "fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"
        }}
        {...props}>
        <g transform="matrix(1,0,0,1,80,80)">
            <g transform="matrix(1.01842,0,0,1.14244,-156.316,-225.609)">
                <path
                    d="M546.253,214.987C662.867,251.142 775.96,309.348 869.39,381.298C892.574,489.404 892.574,605.816 869.39,713.921C775.96,785.872 662.867,844.078 546.253,880.233C429.639,844.078 316.547,785.872 223.116,713.921C199.933,605.816 199.933,489.404 223.116,381.298C316.547,309.348 429.639,251.142 546.253,214.987Z"
                    style={{
                        fill: "#4263eb",
                        stroke: "#364fc7",
                        strokeWidth: "36.96px"
                        // FROM: "fill:#4263eb;stroke:#364fc7;stroke-width:36.96px;"
                    }}
                />
            </g>
            <g transform="matrix(0.804017,0,0,0.901923,-39.1967,-93.9017)">
                <path
                    d="M546.253,214.987C662.867,251.142 775.96,309.348 869.39,381.298C892.574,489.404 892.574,605.816 869.39,713.921C775.96,785.872 662.867,844.078 546.253,880.233C429.639,844.078 316.547,785.872 223.116,713.921L546.253,547.61L546.253,214.987Z"
                    style={{
                        fill: "#91a7ff",
                        stroke: "#5c7cfa",
                        strokeWidth: "46.82px"
                        // FROM: "fill:#91a7ff;stroke:#5c7cfa;stroke-width:46.82px;"
                    }}
                />
            </g>
        </g>
    </svg>
);

export default Logo;