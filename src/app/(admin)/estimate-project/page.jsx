'use client';
import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import useModal from '@/hooks/useModal';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

const Page = () => {
  const { isOpen, className, toggleModal, openModalWithClass } = useModal();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthStr = lastMonth.toISOString().split("T")[0];

  const [loading, setLoading] = useState(true);
  const [EstimateData, setEstimateData] = useState([]);
  const [startDate, setStartDate] = useState(lastMonthStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [ModalId, setModalId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const RecordsPerPage = 10;

  const totalPages = Math.ceil((EstimateData?.length || 0) / RecordsPerPage);

  const paginatedData = EstimateData?.slice(
    (currentPage - 1) * RecordsPerPage,
    currentPage * RecordsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleView = (id) => {
    openModalWithClass('modal-dialog-centered');
    setModalId(id);
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/estimate-project?startDate=${startDate}&endDate=${endDate}`);
      const data = await res.json();
      setEstimateData(data);
      setCurrentPage(1);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch filtered estimates:", err);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/estimate-project?startDate=${lastMonthStr}&endDate=${todayStr}`);
      const data = await res.json();
      setEstimateData(data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(EstimateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "estimate-project");
    XLSX.writeFile(wb, "estimate-project.xlsx");
  };

  const handleDelete = async (id) => {
    if (!id) return;

    try {
      const res = await fetch(`/api/estimate-project?id=${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (res.ok) {
        fetchData();
        Swal.fire("Deleted!", "Data has been deleted.", "success");
      } else {
        alert("Error deleting data: " + result.message);
      }
    } catch (error) {
      console.error("Failed to delete data:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      {/* MODAL */}
      <Modal show={isOpen} onHide={toggleModal} dialogClassName="modal-dialog-centered">
        {className !== 'modal-right' && (
          <ModalHeader onHide={toggleModal} closeButton>
            <h4 className="modal-title">Additional Details</h4>
          </ModalHeader>
        )}
        <ModalBody>
          <ul>
            {EstimateData.map((item, index) =>
              item._id === ModalId ? (
                <React.Fragment key={index}>
                  <li><strong>Name:</strong> {`${item.first_name} ${item.last_name}`}</li>
                  <li><strong>Email:</strong> {item.email}</li>
                  <li><strong>Mobile:</strong> {item.mobile}</li>
                  <li><strong>Description:</strong> {item.description}</li>
                  <li><strong>Project Scope:</strong> {item.project_scope}</li>
                  <li><strong>Project Type:</strong> {item.project_type}</li>
                  <li><strong>Budget:</strong> {item.budget}</li>
                  <li><strong>Start Time:</strong> {item.project_start_time}</li>
                  <li><strong>Date:</strong> {new Date(item.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit", month: "short", year: "numeric"
                  })}</li>
                  <li><strong>Attachments:</strong>{" "}
                    <span className='d-flex align-items-center flex-wrap gap-1'>
                      {item?.attachments?.map((attachment, index) => (
                        <a
                          key={index}
                          className="attachment"
                          href={`/api/attachment?filename=${encodeURIComponent(attachment?.filename)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IconifyIcon icon="tabler:download" />
                          {attachment?.filename}
                        </a>
                      ))}
                    </span>
                  </li>
                </React.Fragment>
              ) : null
            )}
          </ul>
        </ModalBody>
      </Modal>

      {/* DATE FILTER */}
      <ComponentContainerCard title="Filter Listing">
        <Row className="g-3 align-items-end">
          <Col md={3}>
            <label htmlFor="start-date">Start Date</label>
            <input
              type="date"
              id="start-date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={todayStr}
            />
          </Col>
          <Col md={3}>
            <label htmlFor="end-date">End Date</label>
            <input
              type="date"
              id="end-date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || ""}
              max={todayStr}
            />
          </Col>
          <Col md={3}>
            <button className="btn btn-primary rounded-pill" onClick={handleFilter}>
              Filter Data
            </button>
          </Col>
        </Row>
      </ComponentContainerCard>

      {/* TABLE */}
      <ComponentContainerCard title="Estimate Project Listing" exportData onClick={exportToExcel}>
        <div className="table-responsive-sm">
          <table className="table table-striped mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Project Type</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7">Loading...</td></tr>
              ) : (
                paginatedData?.length !== 0 ? paginatedData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{`${item.first_name} ${item.last_name}`}</td>
                    <td>{item.email}</td>
                    <td>{item.mobile}</td>
                    <td>{item.project_type}</td>
                    <td>{new Date(item?.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric"
                    })}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <IconifyIcon icon="tabler:eye" className="cursor-pointer" onClick={() => handleView(item._id)} />
                        <IconifyIcon icon="tabler:trash"
                          className="cursor-pointer"
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
                                handleDelete(item?._id);
                              }
                            });
                          }} />
                      </div>
                    </td>
                  </tr>
                )) : <tr><td colSpan="6">No Data Found</td></tr>
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          {/* {totalPages > 1 && ( */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="btn-group">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${i + 1 === currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
          {/* )} */}
        </div>
      </ComponentContainerCard>
    </>
  );
};

export default Page;
