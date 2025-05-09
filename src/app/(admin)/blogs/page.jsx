"use client";
import React, { useEffect, useState } from "react";
import ComponentContainerCard from "@/components/ComponentContainerCard";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import Link from "next/link";
import Swal from "sweetalert2";

export default function Page() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthStr = lastMonth.toISOString().split("T")[0];

  const [blogs, setBlogs] = useState([]);
  const [startDate, setStartDate] = useState(lastMonthStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const recordsPerPage = 10;

  const totalPages = Math.ceil(blogs.length / recordsPerPage);
  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const fetchBlogs = async (start = lastMonthStr, end = todayStr) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs?startDate=${start}&endDate=${end}`);
      const data = await res.json();
      setBlogs(data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchBlogs(startDate, endDate);
  };

  const updateBlogStatus = async (id, value) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: value }),
      });

      if (res.ok) {
        fetchBlogs(startDate, endDate);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const deleteBlog = async (id) => {
    if (!id) return;

    try {
      const res = await fetch(`/api/blogs?id=${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (res.ok) {
        fetchBlogs(startDate, endDate);
        Swal.fire("Deleted!", "Blog has been deleted.", "success");
      } else {
        alert("Error deleting blog: " + result.message);
      }
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      {/* Filter by date */}
      <ComponentContainerCard title="Filter Blogs">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={todayStr}
            />
          </div>
          <div className="col-md-3">
            <label>End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || ""}
              max={todayStr}
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary rounded-pill" onClick={handleFilter}>
              Filter Blogs
            </button>
          </div>
        </div>
      </ComponentContainerCard>

      {/* Blog Table */}
      <ComponentContainerCard title="Blog Listing" btn>
        <div className="table-responsive-sm">
          <table className="table table-striped mb-0">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Published Date</th>
                <th>Publish</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6">Loading...</td></tr>
              ) : (
                paginatedBlogs.map((record, idx) => (
                  <tr key={idx}>
                    <td>
                      <img
                        src={record.imageUrl}
                        alt="blog-img"
                        className="me-2 avatar-lg rounded"
                      />
                    </td>
                    <td>{record.title}</td>
                    <td>{record.category}</td>
                    <td>{new Date(record.date).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric"
                    })}</td>
                    <td>
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
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          href={`/add-blogs?id=${record._id}`}
                          target="_blank"
                          className="text-reset fs-16"
                        >
                          <IconifyIcon icon="tabler:pencil" />
                        </Link>
                        <span
                          className="text-reset fs-16 cursor-pointer"
                          onClick={() => {
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
                              }
                            });
                          }}
                        >
                          <IconifyIcon icon="tabler:trash" />
                        </span>
                        <Link
                          href={`https://innoapps.com/blog/${record.slug}`}
                          target="_blank"
                          className="text-reset fs-16"
                        >
                          <IconifyIcon icon="tabler:eye" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span>Page {currentPage} of {totalPages}</span>
              <div className="btn-group">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm ${i + 1 === currentPage ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </ComponentContainerCard>
    </>
  );
}
