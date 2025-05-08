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
    const [subscribers, setSubscribers] = useState([]);
    const [startDate, setStartDate] = useState(lastMonthStr);
    const [endDate, setEndDate] = useState(todayStr);
    const [modalId, setModalId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const totalPages = Math.ceil((subscribers?.length || 0) / recordsPerPage);

    // Ensure subscribers is an array before calling .slice
    const paginatedData = Array.isArray(subscribers)
        ? subscribers.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
        : [];

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
        setLoading(true);
        try {
            const res = await fetch(`/api/subscription?startDate=${startDate}&endDate=${endDate}`);
            const data = await res.json();
            console.log(data);

            setSubscribers(data?.subscribers);
            setCurrentPage(1); // Reset to first page
        } catch (err) {
            console.error("Failed to fetch filtered subscribers:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/subscription?startDate=${lastMonthStr}&endDate=${todayStr}`);
                const data = await res.json();
                setSubscribers(data);
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
        const ws = XLSX.utils.json_to_sheet(subscribers);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Subscribers");
        XLSX.writeFile(wb, "subscribers.xlsx");
    };

    return (
        <>
            <ComponentContainerCard title="Filter Subscribers by Date">
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

            {/* SUBSCRIBERS TABLE */}
            <ComponentContainerCard title="Subscriber Listing" exportData onClick={exportToExcel}>
                <div className="table-responsive-sm">
                    <table className="table table-striped mb-0">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Subscribed</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4">Loading...</td></tr>
                            ) : (
                                paginatedData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.email}</td>
                                        <td>{item.subscribed ? "Yes" : "No"}</td>
                                        <td>{new Date(item?.createdAt).toLocaleDateString("en-GB", {
                                            day: "2-digit", month: "short", year: "numeric"
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
