import React, { useRef } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, i) => (
        <span
            key={i}
            className={className}
            style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
        >
            {char === " " ? "\u00A0" : char}
        </span>
    ))
}

const FONT_WEIGHTS = {
    Subtitles: { min: 100, max: 400, default: 100 },
    titles: { min: 400, max: 900, default: 400 }
}

const setupTextHover = (container, type) => {
    if (!container) return ()=>{};

    const letters = container.querySelectorAll("span");
    const { min, max, default: base } = FONT_WEIGHTS[type];

    const animateLetter = (letter, weight, duration = 0.25) => {
        return gsap.to(letter, {
            duration,
            ease: "power2.out",
            fontVariationSettings: `'wght' ${weight}`,
        })
    }

    const handleMouseMove = (e) => {
        const { left } = container.getBoundingClientRect();
        const mouseX = e.clientX - left;

        letters.forEach((letter) => {
            const { left: l, width: w } = letter.getBoundingClientRect();
            const distance = Math.abs(mouseX - (l - left + w / 2))
            const intensity = Math.exp(-(distance ** 2) / 20000)
            animateLetter(letter, min + (max - min) * intensity)
        })
    }
    container.addEventListener("mousemove", handleMouseMove)

    return () => {
        container.removeEventListener("mousemove", handleMouseMove);
    };
}
const Welcome = () => {
    const titleRef = useRef(null)
    const subtitleRef = useRef(null)

    useGSAP(() => {
        const titleCleanup = setupTextHover(titleRef.current, "titles")
        const subtitleCleanup = setupTextHover(subtitleRef.current, "Subtitles")

        return () => {
            subtitleCleanup()
            titleCleanup()
        }
    })


    return (
        <section id='welcome'>
            <h1 ref={titleRef} className="mt-7">
                {renderText("Karan Agrahari", "hero-name text-[72px] leading-none font-georama text-white",400)}
            </h1>
            <p className='mt-2' ref={subtitleRef}>{renderText(
                "Modern web, done right.",
                "text-3xl font-georama",
                100,
            )}</p>
        </section>
    )
}

export default Welcome
