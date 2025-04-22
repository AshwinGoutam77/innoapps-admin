"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import "./style.css";
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
  const [activeHeadingId, setActiveHeadingId] = useState(null);

  const getBlog = async () => {
    const res = await fetch(`/api/blogs/${id}`);
    const blogData = await res.json();
    setData(blogData);
    console.log(blogData.description);

    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(blogData.description, "text/html");

    const contentNodes = [];
    const newHeadings = [];

    Array.from(htmlDoc.body.childNodes).forEach((node, index) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node;

        if (el.tagName === "H1") {
          const text = el.textContent?.trim() || `heading-${index}`;
          const h1Id = generateIdFromText(text);

          newHeadings.push({ text, id: h1Id });
          headingRefs.current[h1Id] = null;

          contentNodes.push(
            <h1
              key={index}
              id={h1Id}
              ref={(ref) => (headingRefs.current[h1Id] = ref)}
              className="text-2xl font-bold mt-6 scroll-mt-[160px]"
            >
              {text}
            </h1>
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
      const yOffset = -150;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveHeadingId(id); // <-- Add this
    }
  };
  useEffect(() => {
    getBlog();
    console.log(headings.length);
  }, [id]);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      for (let i = headings.length - 1; i >= 0; i--) {
        const id = headings[i].id;
        const element = headingRefs.current[id];

        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition + 60 >= offsetTop) {
            setActiveHeadingId(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  return (
    <div className="p-6">
      {data ? (
        <div>
          <div className="container mx-auto d-flex flex-column justify-content-center align-items-center">
            <p className="category">{data.category}</p>
            <h1 className="blog-title">{data.title}</h1>
            <div className="img-container">
              <img src={data.imageUrl} alt="Blog" className="mb-4" />
            </div>
          </div>

          <div className="container">
            <div className="blog-detail-description-section">
              <div className="description-left-section-main">
                <div className="description-left-section">
                  <div className="table-of-content heading-animate">
                    <h2 className="table-content-heading">Table of Contents</h2>
                    <ul>
                      {headings.map(({ text, id }) => (
                        <li key={id}>
                          <button
                            onClick={() => scrollToHeading(id)}
                            className={
                              id === activeHeadingId ? "active-heading" : ""
                            }
                          >
                            {text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="blog-description">{updatedContent}</div>
            </div>
          </div>
        </div>
      ) : (
        "loading...."
      )}
    </div>
  );
};

export default Page;
