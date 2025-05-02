'use client';
import React, { useEffect, useState } from 'react';
import { Grid } from 'gridjs-react';
import { Col, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { h } from 'gridjs';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import Link from 'next/link';

const Page = () => {
  const [dataTableRecords, setDataTableRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleView = (row) => {
    const rowData = row.cells.map(cell => cell.data);
    console.log("Viewing:", rowData);
  };

  const handleDelete = (row) => {
    const rowData = row.cells.map(cell => cell.data);
    console.log("Deleting:", rowData);
  };

  const columns = [
    "Name",
    "Email",
    "Mobile",
    "Interested In",
    "Idea",
    "Country",
    "City",
    "State",
    "Page",
    {
      name: "Actions",
      formatter: (_, row) =>
        h("div", { className: "d-flex gap-2 items-center" }, [
          h("span", {
            className: "cursor-pointer text-blue-600",
            innerHTML: `
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-download" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#1D4ED8" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/>
                <path d="M7 11l5 5l5 -5"/>
                <path d="M12 4v12"/>
              </svg>
            `,
          }),
          h("span", {
            className: "cursor-pointer text-red-600",
            innerHTML: `
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#DC2626" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M4 7l16 0"/>
                <path d="M10 11l0 6"/>
                <path d="M14 11l0 6"/>
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/>
                <path d="M9 7l0 -3h6l0 3"/>
              </svg>
            `,
          }),
        ]),
    }

  ];


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/contacts");
        const data = await res.json();

        const formattedData = data.map(item => [
          `${item.first_name} ${item.last_name}`,
          item.email,
          item.mobile,
          item.interested,
          item.idea ? item.idea.length > 10 ? item.idea.slice(0, 10) + '...' : item.idea : "--",
          item.location?.country,
          item.location?.region,
          item.location?.city,
          new URL(item.page).pathname.replace('/', '/'),
        ]);

        setDataTableRecords(formattedData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Row>
      <Col lg={12}>
        <ComponentContainerCard title="Contact Listing">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Grid
              columns={columns}
              data={dataTableRecords}
              search={true}
              pagination={{ limit: 5 }}
            />
          )}
        </ComponentContainerCard>
      </Col>
    </Row>
  );
};

export default Page;
