'use client';
import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import useModal from '@/hooks/useModal';
import * as XLSX from 'xlsx';

const Page = () => {
  const { isOpen, className, toggleModal, openModalWithClass } = useModal();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthStr = lastMonth.toISOString().split("T")[0];

  const [loading, setLoading] = useState(true);
  const [ContactData, setContactData] = useState([]);
  const [startDate, setStartDate] = useState(lastMonthStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [ModalId, setModalId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const RecordsPerPage = 10;

  const totalPages = Math.ceil((ContactData?.length || 0) / RecordsPerPage);

  const paginatedData = ContactData?.slice(
    (currentPage - 1) * RecordsPerPage,
    currentPage * RecordsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleView = (row_id) => {
    openModalWithClass('modal-dialog-centered');
    setModalId(row_id);
  };

  const handleFilter = async () => {
    try {
      const res = await fetch(`/api/contacts?startDate=${startDate}&endDate=${endDate}`);
      const data = await res.json();
      setContactData(data);
      setCurrentPage(1); // Reset to first page
    } catch (err) {
      console.error("Failed to fetch filtered contacts:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/contacts?startDate=${lastMonthStr}&endDate=${todayStr}`);
        const data = await res.json();
        setContactData(data);
        setCurrentPage(1);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(ContactData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "contacts");
    XLSX.writeFile(wb, "contact-leads.xlsx");
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
            {ContactData && ContactData.map((item, index) => {
              return (
                item?._id === ModalId && (
                  <React.Fragment key={index}>
                    <li><strong>Name:</strong> {`${item.first_name} ${item.last_name}`}</li>
                    <li><strong>Email:</strong> {item.email}</li>
                    <li><strong>Mobile:</strong> {item.mobile}</li>
                    <li><strong>Interested In:</strong> {item.interested}</li>
                    <li><strong>Idea:</strong> {item.idea}</li>
                    <li><strong>Country:</strong> {item.location?.country || "--"}</li>
                    <li><strong>Region:</strong> {item.location?.region || "--"}</li>
                    <li><strong>City:</strong> {item.location?.city || "--"}</li>
                    {item?.attachment?.length !== 0 && (
                      <li><strong>Attachments:</strong>{" "}
                        {item?.attachment?.map((attachment, index) => (
                          <a
                            key={index}
                            className='attachment'
                            href={`/api/attachment?filename=${encodeURIComponent(attachment?.filename)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {attachment?.filename}
                          </a>
                        ))}
                      </li>
                    )}
                    <li><strong>Page:</strong> {item.page}</li>
                    <li><strong>Date:</strong> {new Date(item?.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric"
                    })}</li>
                  </React.Fragment>
                )
              );
            })}
          </ul>
        </ModalBody>
      </Modal>

      {/* DATE FILTER */}
      <ComponentContainerCard title="Filter Listing">
        <Row className="g-3 align-items-end">
          <Col md={3}>
            <div>
              <label htmlFor="start-date">Start Date</label>
              <input
                type="date"
                id="start-date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={todayStr}
              />
            </div>
          </Col>
          <Col md={3}>
            <div>
              <label htmlFor="end-date">End Date</label>
              <input
                type="date"
                id="end-date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={todayStr}
              />
            </div>
          </Col>
          <Col md={3}>
            <button className="btn btn-primary rounded-pill" onClick={handleFilter}>
              Filter Data
            </button>
          </Col>
        </Row>
      </ComponentContainerCard>

      {/* CONTACT TABLE */}
      <ComponentContainerCard title="Contact Us Listing" exportData onClick={exportToExcel}>
        <div className="table-responsive-sm">
          <table className="table table-striped mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Interested In</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6">Loading...</td></tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{`${item.first_name} ${item.last_name}`}</td>
                    <td>{item.email}</td>
                    <td>{item.mobile}</td>
                    <td>{item.interested}</td>
                    <td>{new Date(item?.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric"
                    })}</td>
                    <td>
                      <div className='d-flex gap-2'>
                        <IconifyIcon icon="tabler:eye" className="cursor-pointer" onClick={() => handleView(item?._id)} />
                        <IconifyIcon icon="tabler:trash" className="cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                ))
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
