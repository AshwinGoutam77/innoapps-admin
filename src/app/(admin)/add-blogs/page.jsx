"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; 
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import Select from 'react-select';



export default function AddBlogs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const blogId = searchParams.get("id");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const isEditMode = Boolean(blogId);
  // console.log("ppp", isEditMode);
  const [categories, setCategories] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [loading, setLoading] = useState(true);

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

  if (loading) return <>
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
  </>;

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const payload = {
      title,
      category: selectedCategory,
      description,
      imageUrl,
      isActive, 
    };

    const res = await fetch("/api/blogs", {
      method: isEditMode ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isEditMode ? { ...payload, id: blogId } : payload),
    });

    const result = await res.json();
    if (res.ok) {
      router.push("/blogs");
    } else {
      alert(result.message || "Something went wrong!");
    }
  };

  const modules = {
    toolbar: [['bold', 'italic', 'underline'], [{
      header: [false, 1, 2, 3, 4, 5, 6]
    }, 'blockquote'], [{
      list: 'bullet'
    }], ['direction', {
      align: []
    }], ['link', 'image']]
  };

  
 
  return (
    <ComponentContainerCard title={isEditMode ? "Edit Blog" : "Add Blog"}>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 d-flex flex-column gap-2"
      >
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
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title || ""}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
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
              inputValue ? 'Press Enter to create category' : 'No categories found'
            }
          />
        </div>


        <div>
          <label>Description</label>
          <ReactQuill
            modules={modules}
            theme="snow"
            value={description}
            onChange={setDescription}
          />
        </div>
        {/* <div>
          <strong>Save as:</strong>
          <div className="ms-1">
            <input
              type="radio"
              name="blogstatus"
              id="activeBlog"
              value="true"
              checked={isActive === true}
              onChange={(e) => setisActive(e.target.value === "true")}
            />
            <label htmlFor="activeBlog">&nbsp;&nbsp; Active</label>
            <br />
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
        </div> */}
        <div>
          <button type="submit" className="btn btn-primary rounded-pill">
            {isEditMode ? "Update Blog" : "Save Blog"}
          </button>
        </div>

      </form>
    </ComponentContainerCard>
  );
}
