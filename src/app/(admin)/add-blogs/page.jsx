"use client";
import React, { use, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { result, set } from "lodash";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Select from "react-select";
import "./page.css";
export default function AddBlogs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const blogId = searchParams.get("id");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const isEditMode = Boolean(blogId);
  // console.log("ppp", isEditMode);
  const [categories, setCategories] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customSlug, setCustomSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [slugs, setSlugs] = useState([]);
  const [excludedSlugs, setExcludedSlugs] = useState("");
  const [date, setDate] = useState("");
  const [readTime, setReadTime] = useState("");
  const [shortDescription, setShortDescription] = useState("");

  useEffect(() => {
    const fetchSlugs = async () => {
      try {
        const response = await fetch("/api/blogs");
        const blogs = await response.json();
        if (response.ok) {
          const blogSlugs = blogs.map((blog) => blog.slug);
          setSlugs(blogSlugs);
          console.log("Slugs fetched:", blogSlugs);
        }
      } catch (error) {
        console.error("Error fetching blog slugs:", error);
      }
    };

    fetchSlugs();
  }, []);

  const validateSlug = (value) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "") // allow only lowercase letters, numbers, and dash
      .replace(/-+/g, "-"); // remove multiple dashes
  };

  const isSlugUnique = (slug) => {
    if (!slug.trim()) return false;
    if (isEditMode && slug.trim() === excludedSlugs.trim()) return true;

    return !slugs.includes(slug.trim());
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/blogs/categories");
    const data = await res.json();
    setCategories(data.categories.map((cat) => cat.name));
  };

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      const res = await fetch(`/api/blogs/${blogId}`);
      const data = await res.json();
      setTitle(data.title);
      setCategory(data.category);
      setDescription(data.description);
      setImageUrl(data.imageUrl);
      setSelectedCategory(data.category);
      setLoading(false);
      setisActive(data.isActive);
      setMetaTitle(data.metaTitle);
      setMetaDescription(data.metaDescription);
      setCustomSlug(data.slug);
      setExcludedSlugs(data.slug);
      setDate(data.date);
      setReadTime(data.readTime);
      setShortDescription(data.shortDescription);
    };
    if (isEditMode) fetchBlog();
    else setLoading(false);
    fetchCategories();
  }, [blogId]);

  const onCategoryCreate = async (name) => {
    const res = await fetch("/api/blogs/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setCategories((prev) => [...prev, name]);
      setSelectedCategory(name);
    } else {
      const errorData = await res.json();
      alert(errorData.message || "Failed to create category");
    }
  };

  const handleInputChange = (newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue) {
      onCategoryCreate(inputValue);
      setInputValue("");
      event.preventDefault();
    }
  };

  const handleChange = (selectedOption) => {
    setSelectedCategory(selectedOption ? selectedOption.value : null);
  };

  const [isActive, setisActive] = useState(false);

  if (loading)
    return (
      <>
        <Skeleton width={"250px"} height={"40px"} highlightColor />
        <div style={{ display: "flex", gap: "30px", flexDirection: "column" }}>
          <Skeleton width={"100%"} height={"20px"} highlightColor />
          <Skeleton width={"100%"} height={"20px"} highlightColor />
          <Skeleton width={"100%"} height={"20px"} highlightColor />
          <Skeleton width={"100%"} height={"20px"} highlightColor />
          <Skeleton width={"100%"} height={"20px"} highlightColor />
          <Skeleton width={"100%"} height={"20px"} highlightColor />
          <Skeleton width={"100%"} height={"20px"} highlightColor />
          <Skeleton width={"100px"} height={"20px"} highlightColor />
        </div>
      </>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSlugUnique(customSlug) || shortDescription.trim()?.length < 30) {
      return;
    }
    setIsLoading(true);

    const payload = {
      title,
      category: selectedCategory,
      description,
      imageUrl,
      isActive,
      metaTitle,
      metaDescription,
      slug: customSlug,
      date,
      readTime,
      shortDescription,
    };

    const res = await fetch("/api/blogs", {
      method: isEditMode ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isEditMode ? { ...payload, id: blogId } : payload),
    });

    const result = await res.json();
    if (res.ok) {
      setIsLoading(false);
      isEditMode ? window.close() : router.push("/blogs");
    } else {
      alert(result.message || "Something went wrong!");
      setIsLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, false] }],
      ["bold", "italic", "underline"],
      ["blockquote"],
      [{ list: "bullet" }],
      ["direction", { align: [] }],
      ["link", "image"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "blockquote",
    "list",
    "bullet",
    "direction",
    "align",
    "link",
    "image",
  ];

  return (
    <ComponentContainerCard title={isEditMode ? "Edit Blog" : "Add Blog"} backBtn>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 d-flex flex-column gap-2"
      >
        <div>
          <label>Meta Title</label>
          <input
            type="text"
            className="form-control"
            value={metaTitle || ""}
            onChange={(e) => setMetaTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Meta Description</label>
          <input
            type="text"
            className="form-control"
            value={metaDescription || ""}
            onChange={(e) => setMetaDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Blog Title</label>
          <input
            type="text"
            className="form-control"
            value={title || ""}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Slug</label>
          <input
            type="text"
            className="form-control"
            value={customSlug || ""}
            onChange={(e) => {
              const cleanSlug = validateSlug(e.target.value);
              setCustomSlug(cleanSlug);
              //  isSlugUnique(e.target.value)
            }}
            required
          />

          <small>
            {customSlug.trim() === "" ? (
              <p className="text-danger">Slug cannot be empty</p>
            ) : isSlugUnique(customSlug) ? (
              <p className="text-success mb-0">Slug is available</p>
            ) : (
              <p className="text-danger">Slug already exists</p>
            )}
          </small>
        </div>
        <div>
          <label>Image URL</label>
          <input
            type="text"
            className="form-control"
            value={imageUrl || ""}
            onChange={(e) => setImageUrl(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Short Description</label>
          <input
            type="text"
            className="form-control"
            value={shortDescription}
            onChange={(e) => {
              const input = e.target.value;
              if (input?.length <= 200) {
                setShortDescription(input);
              }
            }}
            required
          />
          <small
            className={
              shortDescription?.length < 200 ? "text-danger" : "text-muted"
            }
          >
            {shortDescription?.length < 200
              ? "Minimum 200 characters required."
              : `${200 - shortDescription?.length} characters left`}
          </small>
        </div>
        <div className="row">
          <div className="col-4">
            <label>Category</label>
            <Select
              options={categories.map((cat) => ({
                value: cat,
                label: cat,
              }))}
              value={
                selectedCategory
                  ? { value: selectedCategory, label: selectedCategory }
                  : null
              }
              onChange={handleChange}
              inputValue={inputValue}
              onInputChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Select or create category..."
              noOptionsMessage={() =>
                inputValue
                  ? "Press Enter to create category"
                  : "No categories found"
              }
            />
          </div>
          <div className="col-4">
            <label>Date</label>
            <input
              type="date"
              className="form-control"
              value={date || ""}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="col-4">
            <label>Read Time (in mins)</label>
            <input
              type="number"
              className="form-control"
              value={readTime || ""}
              onChange={(e) => setReadTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label>Description</label>
          <ReactQuill
            modules={modules}
            formats={formats}
            theme="snow"
            value={description}
            onChange={setDescription}
          />
        </div>
        <div>
          <strong>Save as:</strong>
          <div className="d-flex align-items-center gap-2">
            <div>
              <input
                type="radio"
                name="blogstatus"
                id="activeBlog"
                value="true"
                checked={isActive === true}
                onChange={(e) => setisActive(e.target.value === "true")}
              />
              <label htmlFor="activeBlog">&nbsp;&nbsp; Publish</label>
            </div>
            {/* <br /> */}
            <div>
              <input
                type="radio"
                name="blogstatus"
                id="draft"
                value="false"
                checked={isActive === false}
                onChange={(e) => setisActive(e.target.value === "true")}
              />
              <label htmlFor="draft">&nbsp;&nbsp; Draft</label>
            </div>
          </div>
        </div>
        <div>
          <button type="submit" className="btn btn-primary rounded-pill">
            {isLoading ? "Waiting..." : isEditMode ? "Update Blog" : "Add Blog"}
          </button>
        </div>
      </form>
    </ComponentContainerCard>
  );
}
