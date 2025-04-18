'use client'
import React, { useEffect, useState } from 'react';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { expandableRecords, records } from '../tables/data';
import Image from 'next/image';
import Link from 'next/link';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import Swal from 'sweetalert2';


export default function Page() {
    const [Blogs, setBlogs] = useState("")
    const fetchBlogs = async () => {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        console.log(data);
        setBlogs(data)
    };
    useEffect(() => {
        fetchBlogs();
    }, []);

    const deleteBlog = async (id) => {
        if (!id) return;

        try {
            const res = await fetch(`/api/blogs?id=${id}`, {
                method: 'DELETE',
            });

            const result = await res.json();

            if (res.ok) {
                fetchBlogs()
            } else {
                alert('Error deleting blog: ' + result.message);
            }
        } catch (error) {
            console.error('Failed to delete blog:', error);
            alert('Something went wrong!');
        }
    };




    const StripedRowTable = () => {
        return <ComponentContainerCard title='Blog Listing' btn>
            <div className="table-responsive-sm">
                <table className="table table-striped mb-0">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(Blogs || []).map((record, idx) => {
                            return <tr key={idx}>
                                <td>
                                    <img
                                        src={record.imageUrl}
                                        alt="blog-img"
                                        className="me-2 avatar-lg rounded"
                                    />
                                </td>
                                <td className="table-user">
                                    {record.title}
                                </td>
                                <td>{record.category}</td>
                                <td>
                                    <Link href={`/add-blogs?id=${record._id}`} className="text-reset fs-16 px-1">
                                        <IconifyIcon icon="tabler:pencil" />
                                    </Link>
                                    <Link href="javascript:void(0)" className="text-reset fs-16 px-1" onClick={(e) => {
                                        e.preventDefault();
                                        Swal.fire({
                                            title: 'Are you sure?',
                                            text: 'You won\'t be able to revert this!',
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            confirmButtonText: 'Yes, delete it!'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                deleteBlog(record._id);
                                                Swal.fire(
                                                    'Deleted!',
                                                    'Your blog has been deleted.',
                                                    'success'
                                                );
                                            }
                                        });
                                    }}>
                                        <IconifyIcon icon="tabler:trash" />
                                    </Link>
                                </td>
                            </tr>;
                        })}
                    </tbody>
                </table>
            </div>
        </ComponentContainerCard>;
    };
    return (

        <StripedRowTable />
    )
}
