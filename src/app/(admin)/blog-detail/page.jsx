"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const generateIdFromText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const Page = () => {
  const { id } = useParams();
  const [data, setData] = useState();
  const [headings, setHeadings] = useState([]);
  const [updatedContent, setUpdatedContent] = useState([]);
  const headingRefs = useRef({});
  const blogContent = `
  <p><span style="background-color: transparent; color: rgb(0, 0, 0);">Artificial intelligence (AI) has transformed sectors globally and sparked heated discussions about its advantages and disadvantages. AI is widely used and essential to many domains, including web development. It is changing website and application development, optimisation, and upkeep by improving user experiences and automating coding duties.</span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">Web development used to be labour-intensive and time-consuming. Conversely, AI has improved quality and accelerated development timeframes by introducing automation and efficiency. Developers use AI-powered technologies to produce complex, intuitive, and eye-catching online solutions.</span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">This blog highlights the uses, advantages, and difficulties of integrating AI into web development. </span></p><p><br></p><h2><strong style="background-color: transparent; color: rgb(0, 0, 0);">The Intersection of AI and Web Development</strong></h2><p><br></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">The rise of ChatGPT, Midjourney, and DALL-E, among other AI-powered applications, demonstrate AI's inventive potential. Beyond these creative uses, AI is increasingly used in </span><strong style="background-color: transparent; color: rgb(17, 85, 204);"><a href="https://www.digitalocean.com/resources/articles/ai-tools-web-development" rel="noopener noreferrer" target="_blank">web development</a></strong><span style="background-color: transparent; color: rgb(0, 0, 0);"> for tasks such as quality control, UI/UX improvement, and automated code creation.</span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">Using AI, developers may improve workflows, decrease manual labour, and provide more captivating digital experiences. The technology's capacity to evaluate enormous datasets, forecast user behaviour, and automate tedious activities significantly increases the efficiency and accuracy of web construction. </span></p><p><br></p><h2><strong style="background-color: transparent; color: rgb(0, 0, 0);">Key Applications of AI in Web Development</strong></h2><p><span style="background-color: transparent; color: rgb(0, 0, 0);">AI is changing web development in several ways. Some of its most significant uses are listed below:</span></p><p><br></p><h2><strong style="background-color: transparent; color: rgb(0, 0, 0);">1. Web Development Driven by AI</strong></h2><p><span style="background-color: transparent; color: rgb(0, 0, 0);">Thanks to AI-driven platforms, websites and apps can now be created with little manual coding. Sophisticated AI algorithms may recommend designing and structuring websites and optimising code for improved speed. Developers use AI-powered technologies like GitHub Copilot and ChatGPT to speed up work and provide code snippets.</span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">AI also makes websites more valuable by providing features that adapt to user preferences, improving the user experience. </span></p><p><br></p><h2><strong style="background-color: transparent; color: rgb(0, 0, 0);">2. Optimization of UI/UX Design</strong></h2><p><span style="background-color: transparent; color: rgb(0, 0, 0);">AI transforms UI/UX design by automating visual components and enhancing user engagement. AI-powered design tools like Motiff and Uizard create temp, lattes, logos, and other materials based on user input. </span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">Additionally, designers may develop aesthetically pleasing and user-friendly interfaces using AI-driven analytics to analyse user behaviour better. With the help of these findings, developers may improve design aspects for increased accessibility and user engagement.</span></p><p><br></p><h2><strong style="background-color: transparent; color: rgb(0, 0, 0);">3. Coding Assistants Driven by AI</strong></h2><p><span style="background-color: transparent; color: rgb(0, 0, 0);">AI technologies such as GitHub Copilot and OpenAI Codex help engineers anticipate and finish lines of code, provide real-time ideas, and minimise debugging efforts. These tools increase efficiency, lower mistakes, and improve code quality.</span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">Developers may shift their attention from repetitive coding jobs to more advanced problem-solving using AI-driven coding assistance. </span></p><p><br></p><h2><strong style="background-color: transparent; color: rgb(0, 0, 0);">4. Automated Testing and Quality Assurance</strong></h2><p><span style="background-color: transparent; color: rgb(0, 0, 0);">One of the most important aspects of web development is quality assurance (QA). AI-powered QA systems automate test procedures and create cases to find errors and weaknesses.</span></p><p><span style="background-color: transparent; color: rgb(0, 0, 0);">AI improves testing by mimicking user behaviours, spotting irregularities, and guaranteeing proper website operation. This enhances software performance and reliability while drastically reducing manual testing.</span></p><p><br></p><h2><strong style="background-color: transparent; color: rgb(0, 0, 0);">5. Workflow Automation in Web Development </strong></h2><p><span style="background-color: transparent; color: rgb(0, 0, 0);">AI-powered automation simplifies several tedious web development jobs, including:</span></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: transparent; color: rgb(0, 0, 0);">Refactoring code</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: transparent; color: rgb(0, 0, 0);">Configuration of the build script</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: transparent; color: rgb(0, 0, 0);">Management of version control</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: transparent; color: rgb(0, 0, 0);">Optimisation of databases</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: transparent; color: rgb(0, 0, 0);">Improvements in security</span></li></ol><p><span style="background-color: transparent; color: rgb(0, 0, 0);">In addition to saving time, automating these procedures lowers human error and guarantees more effective development cycles. </span></p><h1>Hello</h1>
  `;

  const getblog = async () => {
    const res = await fetch(`/api/blogs/${id}`);
    const blogData = await res.json();
    setData(blogData);

    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(blogContent, "text/html");

    const contentNodes = [];
    const newHeadings = [];

    Array.from(htmlDoc.body.childNodes).forEach((node, index) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node;

        if (el.tagName === "H2") {
          const text = el.textContent?.trim() || `heading-${index}`;
          const h2Id = generateIdFromText(text);

          newHeadings.push({ text, id: h2Id });

          headingRefs.current[h2Id] = null;

          contentNodes.push(
            <h2
              key={index}
              id={h2Id}
              ref={(ref) => (headingRefs.current[h2Id] = ref)}
              className="text-xl font-bold mt-6"
            >
              {text}
            </h2>
          );
        } else {
          contentNodes.push(
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: el.outerHTML }}
            />
          );
        }
      }
    });

    setHeadings(newHeadings);
    setUpdatedContent(contentNodes);
  };

  const scrollToHeading = (id) => {
    const element = headingRefs.current[id];
    if (element) {
      const yOffset = -150; // adjust this offset based on your header height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
  
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    getblog();
  }, [id]);

  return (
    <div className="p-6">
      {data && (
        <div>
          <img src={data.imageUrl} alt="Blog" />
          <h1 className="text-3xl font-bold">{data.title}</h1>
          <span>{data.category}</span>

          {/* Table of Contents */}
          <div className="d-flex gap-2">
          <div className="my-4" style={{flexShrink:0}}>
            <h2 className="text-lg font-semibold mb-2">Table of Contents</h2>
            <ul className="list-disc pl-4">
              {headings.map(({ text, id }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToHeading(id)}
                    className="text-blue-600 hover:underline"
                  >
                    {text}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Render Blog Content */}
          <div>{updatedContent}</div>
          </div>
        </div>
      )}
    <div style={{height:"500vh"}}></div>
    </div>
  );
};

export default Page;
