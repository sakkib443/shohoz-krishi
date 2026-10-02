import React from 'react';

/**
 * The Shohoz Krishi logo:  a brand-coloured disc holding a young sprout,
 * next to a two-tone "Shohoz Krishi" wordmark.
 *
 * Drawn as inline SVG rather than loaded as an image so it stays crisp at every
 * size, picks up the site font, and can recolour itself for dark backgrounds.
 * The same artwork is available as static files for favicons / OG images:
 * `/logo.svg` (full lockup) and `/logo-mark.svg` (disc only).
 */

const BRAND = 'var(--color-primary)';
const INK = '#202020';

/** The disc + sprout, on its own 48×48 grid. */
const Mark = () => (
    <>
        <circle cx="24" cy="24" r="24" fill={BRAND} />
        {/* stem */}
        <path d="M24 37c0-6-.3-11 0-17.5" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
        {/* left leaf */}
        <path d="M23.3 26.2c-4.4 1-9.4-1.3-10.8-6.9 5.4-1.3 9.9 1.1 10.8 6.9z" fill="#ffffff" />
        {/* right leaf, a little higher */}
        <path d="M24.7 21.6c4.4 1 9.4-1.3 10.8-6.9-5.4-1.3-9.9 1.1-10.8 6.9z" fill="#ffffff" />
    </>
);

/** Lockup geometry — mark is 48 wide, wordmark starts at 56, total 232. */
const LOCKUP_W = 232;

interface LogoProps {
    /** Logo height in px. */
    size?: number;
    /** On a dark background — the wordmark switches to white. */
    light?: boolean;
    /** Explicit white rounded chip behind the logo. */
    boxed?: boolean;
    /** Kept for API compatibility. */
    showTagline?: boolean;
    /** Render just the disc, without the wordmark. */
    iconOnly?: boolean;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({
    size = 40,
    light = false,
    boxed = false,
    iconOnly = false,
    className,
}) => {
    const wordFill = light ? '#ffffff' : INK;
    const accentFill = light ? '#ffffff' : BRAND;

    const svg = iconOnly ? (
        <svg
            viewBox="0 0 48 48"
            height={size}
            width={size}
            role="img"
            aria-label="Shohoz Krishi"
            style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
        >
            <Mark />
        </svg>
    ) : (
        <svg
            viewBox={`0 0 ${LOCKUP_W} 48`}
            height={size}
            width={size * (LOCKUP_W / 48)}
            role="img"
            aria-label="Shohoz Krishi"
            style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
        >
            <Mark />
            <text
                x="56"
                y="31.5"
                fontFamily="Poppins, 'Segoe UI', Arial, Helvetica, sans-serif"
                fontSize="23"
                fontWeight={700}
                letterSpacing="-0.4"
            >
                <tspan fill={wordFill}>Shohoz</tspan>
                <tspan fill={accentFill}> Krishi</tspan>
            </text>
        </svg>
    );

    if (boxed) {
        return (
            <span
                className={className}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: '#fff',
                    borderRadius: 10,
                    padding: '6px 10px',
                }}
            >
                {svg}
            </span>
        );
    }

    return (
        <span className={className} style={{ display: 'inline-flex', alignItems: 'center' }}>
            {svg}
        </span>
    );
};

/** Compact brand mark — the disc only, for tight spaces. */
export const LogoMark: React.FC<{ size?: number; light?: boolean; className?: string }> = (props) => (
    <Logo {...props} iconOnly />
);

export default Logo;
