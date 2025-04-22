"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { result } from "lodash";

export default function AddBlogs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const blogId = searchParams.get("id"); // check for edit mode
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setisActive] = useState();

 
  const isEditMode = Boolean(blogId);
  // console.log("ppp", isEditMode);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      const res = await fetch(`/api/blogs/${blogId}`);
      const data = await res.json();
      setTitle(data.title);
      setCategory(data.category);
      setDescription(data.description);
      setImageUrl(data.imageUrl);
      setLoading(false);
      setisActive(data.isActive);
    };
    if (isEditMode) fetchBlog();
    else setLoading(false);
  }, [blogId]);

  if (loading) return <p>Loading blog...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, category, description, imageUrl ,isActive};
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
    toolbar: [[{
      font: []
    }, {
      size: []
    }], ['bold', 'italic', 'underline', 'strike'], [{
      color: []
    }, {
      background: []
    }], [{
      script: 'super'
    }, {
      script: 'sub'
    }], [{
      header: [false, 1, 2, 3, 4, 5, 6]
    }, 'blockquote', 'code-block'], [{
      list: 'ordered'
    }, {
      list: 'bullet'
    }, {
      indent: '-1'
    }, {
      indent: '+1'
    }], ['direction', {
      align: []
    }], ['link', 'image', 'video'], ['clean']]
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
          <input
            type="text"
            className="form-control"
            value={category || ""}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description</label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={modules}
          />
        </div>
        <div>
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
        </div>
        <div>
          <button type="submit" className="btn btn-primary rounded-pill">
            {isEditMode ? "Update Blog" : "Save Blog"}
          </button>
        </div>
       
      </form>
    </ComponentContainerCard>
  );
}
