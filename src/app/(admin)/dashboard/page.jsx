'use client';
import React, { useEffect, useState } from 'react';
import { Grid } from 'gridjs-react';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { h } from 'gridjs';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import Link from 'next/link';
import useModal from '@/hooks/useModal';
import * as XLSX from 'xlsx';

const Page = () => {
  const {
    isOpen,
    className,
    toggleModal,
    openModalWithClass
  } = useModal();
  const [loading, setLoading] = useState(true);
  const [ContactData, setContactData] = useState("");
  const [ModalId, setModalId] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const RecordsPerPage = 5;

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
    openModalWithClass('modal-dialog-centered')
    setModalId(row_id)
  };

  // const handleDelete = (row) => {
  //   const rowData = row.cells.map(cell => cell.data);
  //   console.log("Deleting:", rowData);
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/contacts");
        const data = await res.json();
        setContactData(data)
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
    XLSX.utils.book_append_sheet(wb, ws, "Subscribers"); 
    XLSX.writeFile(wb, "contact-leads.xlsx");
  };

  return (
    <>
      <Modal show={isOpen} onHide={toggleModal} dialogClassName="modal-dialog-centered">
        {className != 'modal-right' && <ModalHeader onHide={toggleModal} closeButton>
          <h4 className="modal-title">Addtional Details</h4>
        </ModalHeader>}
        <ModalBody>
          <ul>
            {ContactData && ContactData.map((item, index) => {
              return (
                item?._id == ModalId && (
                  <React.Fragment key={index}>
                    <li><span className="fw-bold">Name:</span> {`${item.first_name} ${item.last_name}`}</li>
                    <li><span className="fw-bold">Email:</span> {item.email}</li>
                    <li><span className="fw-bold">Mobile:</span> {item.mobile}</li>
                    <li><span className="fw-bold">Interested In:</span> {item.interested}</li>
                    <li>
                      <span className="fw-bold">Idea:</span>{" "}
                      {item.idea}
                    </li>
                    <li><span className="fw-bold">Country:</span> {item.location?.country || "--"}</li>
                    <li><span className="fw-bold">Region:</span> {item.location?.region || "--"}</li>
                    <li><span className="fw-bold">City:</span> {item.location?.city || "--"}</li>
                    <li>
                      <span className="fw-bold">Page:</span>{" "}
                      {item.page}
                    </li>
                    <li><span className="fw-bold">Date:</span> {new Date(item?.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}</li>
                  </React.Fragment>
                )
              );
            })}

          </ul>
        </ModalBody>
      </Modal>
      <ComponentContainerCard title="Contact Us Listing" exportData onClick={exportToExcel}>
        <div className="table-responsive-sm">
          <table className="table table-striped mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Interested In</th>
                <th>Page</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(ContactData || []).map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td>{`${item.first_name} ${item.last_name}`}</td>
                    <td>{item.email}</td>
                    <td>{item.mobile}</td>
                    <td>{item.interested}</td>
                    <td>{item.page ? new URL(item.page).pathname.replace("/", "/") : "--"}</td>
                    <td className=''>
                      <div className='d-flex gap-2'>
                        <IconifyIcon icon="tabler:eye"
                          className="cursor-pointer"
                          onClick={() => handleView(item?._id)}
                        />
                        <IconifyIcon icon="tabler:trash"
                          className="cursor-pointer"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <span>
              Page {currentPage} of {totalPages}
            </span>
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
                  className={`btn btn-sm ${i + 1 === currentPage ? 'btn-primary' : 'btn-outline-primary'
                    }`}
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
        </div>

      </ComponentContainerCard>
    </>
  );
};

export default Page;
