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
    }
  };

  useEffect(() => {
    getBlog();
    console.log(headings.length);
  }, [id]);

  return (
    <div className="p-6">
      {data ? (
        <div>
          <div className="container mx-auto d-flex flex-column justify-content-center align-items-center">
            <p className="text-gray-500 mb-4">{data.category}</p>
            <h1 className="text-3xl font-bold">{data.title}</h1>
            <img
              src={data.imageUrl}
              alt="Blog"
              className="mb-4 img-fluid rounded-lg"
            />
          </div>

          <div className="container">
            <div className="blog-detail-description-section">
              <div className="description-left-section-main">
                <div className="description-left-section">
                  <div className="table-of-content heading-animate">
                    <h2 className="">
                      Table of Contents
                    </h2>
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
                  <div
                    className="efficient-development heading-animate"
                    
                  >
                    <div>
                      <h3>Efficient software development</h3>
                      <p>Build faster, Deliver more</p>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
              <div>{updatedContent}</div>
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
