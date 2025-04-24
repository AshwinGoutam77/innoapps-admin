"use client";
import React, { useEffect, useState } from "react";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import { expandableRecords, records } from "../tables/data"; 
import Link from "next/link";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
export default function Page() {
  const [Blogs, setBlogs] = useState("");
  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs");
    const data = await res.json();
    console.log(data);
    setBlogs(data);
  };
  const updateBlogStatus = async (id, value) => {
    const raw = JSON.stringify({
      isActive: value,
    });

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: raw,
      redirect: "follow",
    };

    const res = await fetch(
      `http://localhost:3000/api/blogs/${id}`,
      requestOptions
    );
    const result = res.json();
    if (res.ok) { 
        fetchBlogs()
    } else {
      console.log(result);
    }
  };
  useEffect(() => {
    fetchBlogs();
  }, []);

  const deleteBlog = async (id) => {
    if (!id) return;

    try {
      const res = await fetch(`/api/blogs?id=${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (res.ok) {
        fetchBlogs();
      } else {
        alert("Error deleting blog: " + result.message);
      }
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Something went wrong!");
    }
  };

  const StripedRowTable = () => {
    return (
      <ComponentContainerCard title="Blog Listing" btn>
      {
        Blogs?<div className="table-responsive-sm">
        <table className="table table-striped mb-0">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              {/* <th>Active</th> */}
              <th>Action</th>
              {/* <th>View</th> */}
            </tr>
          </thead>
          <tbody>
            {(Blogs || []).map((record, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    <img
                      src={record.imageUrl}
                      alt="blog-img"
                      className="me-2 avatar-lg rounded"
                    />
                  </td>
                  <td className="table-user">{record.title}</td>
                  <td>{record.category}</td>
                  {/* <td>
                    {record.isActive ? (
                      <>
                        <input
                          type="checkbox"
                          id={`switch-${record._id}`}
                          defaultChecked
                          data-switch="success"
                          onClick={() => {
                              updateBlogStatus(record._id, !record.isActive);
                              console.log(record.isActive);
                              
                          }}
                        />
                        <label
                          htmlFor={`switch-${record._id}`}
                          data-on-label="Yes"
                          data-off-label="No"
                          className="mb-0 d-block"
                        />
                      </>
                    ) : (
                      <>
                        <input
                          type="checkbox" 
                          id={`switch-${record._id}`}
                          data-switch="success"
                          onClick={() => {
                              updateBlogStatus(record._id, !record.isActive);
                              console.log(record.isActive);
                          }}
                        />
                        <label
                          htmlFor={`switch-${record._id}`}
                          data-on-label="Yes"
                          data-off-label="No"
                          className="mb-0 d-block"
                        />
                      </>
                    )}
                  </td> */}
                  <td>
                    <Link
                      href={`/add-blogs?id=${record._id}`}
                      className="text-reset fs-16 px-1"
                    >
                      <IconifyIcon icon="tabler:pencil" />
                    </Link>
                    <Link
                      href="javascript:void(0)"
                      className="text-reset fs-16 px-1"
                      onClick={(e) => {
                        e.preventDefault();
                        Swal.fire({
                          title: "Are you sure?",
                          text: "You won't be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Yes, delete it!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteBlog(record._id);
                            Swal.fire(
                              "Deleted!",
                              "Your blog has been deleted.",
                              "success"
                            );
                          }
                        });
                      }}
                    >
                      <IconifyIcon icon="tabler:trash" />
                    </Link>
                  </td>
                  {/* <td>
                    <Link
                      href={`/blogs/${record._id}`}
                      target="_blank"
                      className="text-reset fs-16 px-1"
                    >
                      <IconifyIcon icon="tabler:eye" />
                    </Link>
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
        
      </div>:<div style={{display:"flex",gap:'50px'}} >
      <Skeleton width={"250px"} highlightColor  />
      <Skeleton width={"250px"} highlightColor  />
      <Skeleton width={"250px"} highlightColor  />
      <Skeleton width={"250px"} highlightColor  />
      </div>
      }
        
      </ComponentContainerCard>
    );
  };
  return <StripedRowTable />;
}
