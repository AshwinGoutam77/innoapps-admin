'use client'

import React, { useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const blogContent = `
<p><span style="background-color: transparent; color: rgb(0, 0, 0);">Artificial intelligence (AI) has transformed sectors globally and sparked heated discussions about its advantages and disadvantages. AI is widely used and essential to many domains, including web development. It is changing website and application development, optimisation, and upkeep by improving user experiences and automating coding duties.</span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">Web development used to be labour-intensive and time-consuming. Conversely, AI has improved quality and accelerated development timeframes by introducing automation and efficiency. Developers use AI-powered technologies to produce complex, intuitive, and eye-catching online solutions.</span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">This blog highlights the uses, advantages, and difficulties of integrating AI into web development. </span></p><p><br></p><h2><strong style="background-color: transparent; color: rgb(0, 0, 0);">The Intersection of AI and Web Development</strong></h2><p><br></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">The rise of ChatGPT, Midjourney, and DALL-E, among other AI-powered applications, demonstrate AI's inventive potential. Beyond these creative uses, AI is increasingly used in </span><strong style="background-color: transparent; color: rgb(17, 85, 204);"><a href="https://www.digitalocean.com/resources/articles/ai-tools-web-development" rel="noopener noreferrer" target="_blank">web development</a></strong><span style="background-color: transparent; color: rgb(0, 0, 0);"> for tasks such as quality control, UI/UX improvement, and automated code creation.</span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">Using AI, developers may improve workflows, decrease manual labour, and provide more captivating digital experiences. The technology's capacity to evaluate enormous datasets, forecast user behaviour, and automate tedious activities significantly increases the efficiency and accuracy of web construction. </span></p><p><br></p><h2><strong style="background-color: transparent; color: rgb(0, 0, 0);">Key Applications of AI in Web Development</strong></h2><p><span style="background-color: transparent; color: rgb(0, 0, 0);">AI is changing web development in several ways. Some of its most significant uses are listed below:</span></p><p><br></p><h2><strong style="background-color: transparent; color: rgb(0, 0, 0);">1. Web Development Driven by AI</strong></h2><p><span style="background-color: transparent; color: rgb(0, 0, 0);">Thanks to AI-driven platforms, websites and apps can now be created with little manual coding. Sophisticated AI algorithms may recommend designing and structuring websites and optimising code for improved speed. Developers use AI-powered technologies like GitHub Copilot and ChatGPT to speed up work and provide code snippets.</span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">AI also makes websites more valuable by providing features that adapt to user preferences, improving the user experience. </span></p><p><br></p><h2><strong style="background-color: transparent; color: rgb(0, 0, 0);">2. Optimization of UI/UX Design</strong></h2><p><span style="background-color: transparent; color: rgb(0, 0, 0);">AI transforms UI/UX design by automating visual components and enhancing user engagement. AI-powered design tools like Motiff and Uizard create temp, lattes, logos, and other materials based on user input. </span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">Additionally, designers may develop aesthetically pleasing and user-friendly interfaces using AI-driven analytics to analyse user behaviour better. With the help of these findings, developers may improve design aspects for increased accessibility and user engagement.</span></p><p><br></p><h2><strong style="background-color: transparent; color: rgb(0, 0, 0);">3. Coding Assistants Driven by AI</strong></h2><p><span style="background-color: transparent; color: rgb(0, 0, 0);">AI technologies such as GitHub Copilot and OpenAI Codex help engineers anticipate and finish lines of code, provide real-time ideas, and minimise debugging efforts. These tools increase efficiency, lower mistakes, and improve code quality.</span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">Developers may shift their attention from repetitive coding jobs to more advanced problem-solving using AI-driven coding assistance. </span></p><p><br></p><h2><strong style="background-color: transparent; color: rgb(0, 0, 0);">4. Automated Testing and Quality Assurance</strong></h2><p><span style="background-color: transparent; color: rgb(0, 0, 0);">One of the most important aspects of web development is quality assurance (QA). AI-powered QA systems automate test procedures and create cases to find errors and weaknesses.</span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">AI improves testing by mimicking user behaviours, spotting irregularities, and guaranteeing proper website operation. This enhances software performance and reliability while drastically reducing manual testing.</span></p><p><br></p><h2><strong style="background-color: transparent; color: rgb(0, 0, 0);">5. Workflow Automation in Web Development </strong></h2><p><span style="background-color: transparent; color: rgb(0, 0, 0);">AI-powered automation simplifies several tedious web development jobs, including:</span></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: transparent; color: rgb(0, 0, 0);">Refactoring code</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: transparent; color: rgb(0, 0, 0);">Configuration of the build script</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: transparent; color: rgb(0, 0, 0);">Management of version control</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: transparent; color: rgb(0, 0, 0);">Optimisation of databases</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: transparent; color: rgb(0, 0, 0);">Improvements in security</span></li></ol><p><span style="background-color: transparent; color: rgb(0, 0, 0);">In addition to saving time, automating these procedures lowers human error and guarantees more effective development cycles. </span></p>
`;


function extractHeadings(html) {
    const headingRegex = /<(h[1-6])>(.*?)<\/\1>/g;  // Matches all headings (h1-h6)
    const headings = [];
    let match;

    while ((match = headingRegex.exec(html)) !== null) {
        const level = parseInt(match[1].substring(1), 10); // Extract heading level (h1 -> 1)
        const textWithHTML = match[2]; // The heading text with HTML tags (e.g., <strong>)

        // Clean the text for ID generation (removes HTML tags)
        const cleanText = textWithHTML.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags
        const id = cleanText.toLowerCase().replace(/[^\w]+/g, '-'); // Generate clean ID

        headings.push({ level, text: textWithHTML, id });
    }

    return headings;
}

export default function Page() {
    const headings = useMemo(() => extractHeadings(blogContent), [blogContent]);

    // Create refs for each heading
    const headingRefs = useMemo(() => {
        return headings.reduce((acc, heading) => {
            acc[heading.id] = React.createRef();
            return acc;
        }, {});
    }, [headings]);

    // Function to handle smooth scrolling
    const handleScrollToSection = (id) => {
        const element = headingRefs[id].current;
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 p-6">
            {/* Table of Contents */}
            <aside className="md:w-1/4 space-y-2 sticky top-6 max-h-screen overflow-auto">
                <h2 className="text-lg font-bold">Table of Contents</h2>
                <ul className="space-y-1">
                    {headings.map((h) => (
                        <li key={h.id} className={`ml-${(h.level - 1) * 4}`}>
                            <button
                                className="text-blue-600 hover:underline"
                                onClick={() => handleScrollToSection(h.id)}
                                dangerouslySetInnerHTML={{ __html: h.text }}
                            />
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Blog Content */}
            <main className="md:w-3/4 prose prose-blue max-w-none">
                <div
                    className="custom-content"
                    dangerouslySetInnerHTML={{ __html: blogContent }}
                ></div>

                {/* Add refs to each heading */}
                {headings.map((h) => (
                    <div key={h.id} id={h.id} ref={headingRefs[h.id]}>
                        {/* Placeholder for each heading to ensure scrolling works */}
                    </div>
                ))}
            </main>
        </div>
    );
}
