"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { id } = useParams();
  const [data, setData] = useState();
  const getblog = async () => {
    const res = await fetch(`/api/blogs/${id}`);
    const data = await res.json();
    setData(data);
  };
  useEffect(() => {
    getblog();
    console.log(data);
  }, [id]);

  return (
    <div>
      {data && (
        <div>
          <img src={data.imageUrl} />
          <h1>{data.title}</h1>
          <span>{data.category}</span>
          <div
            className="custom-content"
            dangerouslySetInnerHTML={{ __html: data.description }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Page;
