'use client';
import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import useModal from '@/hooks/useModal';
import * as XLSX from 'xlsx';

const Page = () => {
    const { openModalWithClass } = useModal();
    const [loading, setLoading] = useState(true);
    const [subscribers, setSubscribers] = useState([]);
    const [modalId, setModalId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const totalPages = Math.ceil(subscribers?.length / recordsPerPage);
    const paginatedData = subscribers?.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/subscription");
                const data = await res.json();
                if (Array.isArray(data.subscribers)) {
                    setSubscribers(data.subscribers);
                } else if (Array.isArray(data)) {
                    setSubscribers(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                    setSubscribers([]);
                }
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setSubscribers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(subscribers);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Subscribers");
        XLSX.writeFile(wb, "subscribers.xlsx");
    };

    return (
        <>
            <ComponentContainerCard title="Subscription Listing" exportData onClick={exportToExcel}>
                <div className="table-responsive-sm">
                    <table className="table table-striped mb-0">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Subscribed</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4">Loading...</td></tr>
                            ) : (
                                paginatedData?.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.email}</td>
                                        <td>{item.subscribed ? "Yes" : "Not"}</td>
                                        <td>{new Date(item?.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}</td>
                                        <td>
                                            <div className='d-flex gap-2'>
                                                <IconifyIcon icon="tabler:trash" className="cursor-pointer" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
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
                </div>
            </ComponentContainerCard>
        </>
    );
};

export default Page;
