// "use client";

// import { useParams } from "next/navigation";
// import React, { useEffect, useRef, useState } from "react";
// import "./style.css";
// const generateIdFromText = (text) => {
//   return text
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
// };

// const Page = () => {
//   const { id } = useParams();
//   const [data, setData] = useState();
//   const [headings, setHeadings] = useState([]);
//   const [updatedContent, setUpdatedContent] = useState([]);
//   const headingRefs = useRef({});
//   const [activeHeadingId, setActiveHeadingId] = useState(null);

//   const getBlog = async () => {
//     const res = await fetch(`/api/blogs/${id}`);
//     const blogData = await res.json();
//     setData(blogData);
//     console.log(blogData.description);

//     const parser = new DOMParser();
//     const htmlDoc = parser.parseFromString(blogData.description, "text/html");

//     const contentNodes = [];
//     const newHeadings = [];

//     Array.from(htmlDoc.body.childNodes).forEach((node, index) => {
//       if (node.nodeType === Node.ELEMENT_NODE) {
//         const el = node;

//         if (el.tagName === "H2") {
//           const text = el.textContent?.trim() || `heading-${index}`;
//           const h1Id = generateIdFromText(text);

//           newHeadings.push({ text, id: h1Id });
//           headingRefs.current[h1Id] = null;

//           contentNodes.push(
//             <h1
//               key={index}
//               id={h1Id}
//               ref={(ref) => (headingRefs.current[h1Id] = ref)}
//               className="text-2xl font-bold mt-6 scroll-mt-[160px]"
//             >
//               {text}
//             </h1>
//           );
//         } else {
//           contentNodes.push(
//             <div
//               key={index}
//               dangerouslySetInnerHTML={{ __html: el.outerHTML }}
//             />
//           );
//         }
//       }
//     });

//     setHeadings(newHeadings);
//     setUpdatedContent(contentNodes);
//   };

//   const scrollToHeading = (id) => {
//     const element = headingRefs.current[id];
//     if (element) {
//       const yOffset = -150;
//       const y =
//         element.getBoundingClientRect().top + window.pageYOffset + yOffset;

//       window.scrollTo({ top: y, behavior: "smooth" });
//       setActiveHeadingId(id); // <-- Add this
//     }
//   };
//   useEffect(() => {
//     getBlog();
//     console.log(headings.length);
//   }, [id]);
//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollPosition = window.scrollY;

//       for (let i = headings.length - 1; i >= 0; i--) {
//         const id = headings[i].id;
//         const element = headingRefs.current[id];

//         if (element) {
//           const offsetTop = element.offsetTop;
//           if (scrollPosition + 60 >= offsetTop) {
//             setActiveHeadingId(id);
//             break;
//           }
//         }
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [headings]);

//   return (
//     <div className="p-6">
//       {data ? (
//         <div>
//           <div className="container mx-auto d-flex flex-column justify-content-center align-items-center">
//             <p className="category">{data.category}</p>
//             <h1 className="blog-title">{data.title}</h1>
//             <div className="img-container">
//               <img src={data.imageUrl} alt="Blog" className="mb-4" />
//             </div>
//           </div>

//           <div className="container">
//             <div className="blog-detail-description-section">
//               <div className="description-left-section-main">
//                 <div className="description-left-section">
//                   <div className="table-of-content ">
//                     <h2 className="table-content-heading">Table of Contents</h2>
//                     <ul>
//                       {headings.map(({ text, id }) => (
//                         <li key={id}>
//                           <button
//                             onClick={() => scrollToHeading(id)}
//                             className={
//                               id === activeHeadingId ? "active-heading" : ""
//                             }
//                           >
//                             {text}
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//               <div className="blog-description">{updatedContent}</div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         "loading...."
//       )}
//     </div>
//   );
// };

// export default Page;

"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import Link from "next/link";
import Image from "next/image";
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

        if (el.tagName === "H2") {
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
    <>
      {data ? (
        <div className="blog-detail-page">
          <div className="scroll-header">
            <div className="container">
              <Link href="/blog" className="blog-detail-back-btn">
                <span>
                  <Image
                    src="/latest-blog/back-arraow.png"
                    alt="back arrow"
                    width={16}
                    height={16}
                    className="blog-detail-back-arrow"
                  />
                </span>
                <span>Back</span>
              </Link>
              <div className="scroll-heading">
                <h1>
                  How Lidl & Kaufland Leveraged Low-Code to Build 100+ Apps, 75%
                  Faster
                </h1>
              </div>
            </div>
          </div>
          <div>
            <div className="container">
              <div className="blog-detail-header ">
                <div className="blog-detail-header-left-section ">
                  <Link href="/blog" className="blog-detail-back-btn">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                      >
                        <path
                          d="M15.75 5L8.25 12.5L15.75 20"
                          stroke="#234CC0"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                    <span>Back</span>
                  </Link>
                </div>
                <div className="blog-detail-header-right-section">
                  <span>Share:</span>
                  <span>
                    <Image
                      src="/latest-blog/facebook-icon.png"
                      alt="facebook icon"
                      width={24}
                      height={24}
                      className="social-share"
                    />
                  </span>
                  <span>
                    <Image
                      src="/latest-blog/x-icon.png"
                      alt="x icon"
                      width={24}
                      height={24}
                      className="social-share"
                    />
                  </span>
                  <span>
                    <Image
                      src="/latest-blog/linkedin-icon.png"
                      alt="linkedin icon"
                      width={24}
                      height={24}
                      className="social-share"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="blog-detail-hero-section">
            <div className="container">
              <div className="blog-detail-hero-section-content">
                <div className="blog-detail-mata-data ">
                  <div className="tag">
                    <span> {data.category}</span>
                  </div>
                </div>
                <div>
                  <h1 className="blog-detail-title ">{data.title}</h1>
                </div>
              </div>
            </div>
            <div className="container blog-detail-hero-section-image">
              <div className={`blog-detail-hero-image  }`}>
                <img
                  src={data.imageUrl}
                  width={1169}
                  height={446}
                  title="blog image"
                  alt="blog imagr"
                />
              </div>
            </div>
          </div>
          <div className="container">
            <div className="blog-detail-description-section">
              <div className="description-left-section-main">
                <div className="description-left-section">
                  <div className=" sidebar-menu-list">
                    {/* <ul>
                  <li>Definition</li>
                  <li className="active">How it works</li>
                  <li>Lidl & Kaufland experience with low-code development</li>
                  <li>The company uses the Mendix Academy and certification</li>
                  <li>Is low-code the future?</li>
                </ul> */}
                    {/* <Tableofcontent titles={titles} /> */}

                    <ul className="table-of-content">
                      {headings.map(({ text, id }) => (
                        <li key={id} 
                            onClick={() => scrollToHeading(id)}
                            className={
                              `${id === activeHeadingId ? "Active-side-item" : ""} navigation-link`
                            }
                          >
                            {text} 
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="efficient-development ">
                    <div>
                      <h3>Efficient software development</h3>
                      <p>Build faster, Deliver more</p>
                    </div>
                    <div>
                      <Link href="/contact-us">
                        {/* <PrimaryLinearButton text={"Start Now"} /> */}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="description-right-section">{updatedContent}</div>
            </div>
          </div>
          <div className="container more-blog-listing">
            <h2 className="  Similar-title">Similar reads </h2>
          </div>
          <div className="container newaletter-main ">
            <div className="newaletter">
              <h3>Join our newsletter!</h3>
              <p>
                Stay in the loop with the latest updates, exclusive offers, and
                exciting news delivered straight to your inbox!
              </p>
              <div className="newaletter-input-container">
                <input type="email" placeholder="Enter your email" />
                <button>
                  Subscribe{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M6.25 2.5L13.75 10L6.25 17.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <p className="newaletter-subtitle">
                No Spam, unsubscribe any time
              </p>
            </div>
          </div>
        </div>
      ) : (
        "loading...."
      )}
    </>
  );
};

export default Page;
