import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../Api/api";
import { addProduct } from "../../App/features/productsSlice";
import useFetch from "../../Hooks/useFetch";

const ProductAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: categories } = useFetch(`${BASE_URL}/category`);

  const initialState = { title: "", description: "", brand: "", status: "", category: "", price: "" };

  const [productData, setProductData] = useState(initialState);
  const [image, setImage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

    toast.dismiss();
    toast.info("Uploading image...");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_URL}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Image upload failed");

      const data = await res.json();
      setImage(data.url);
      toast.dismiss();
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.dismiss();
      toast.error("Image upload failed");
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.dismiss();
      toast.error("No image found");
      return;
    }

    const productDetails = { ...productData, price: Number(productData.price), image };

    try {
      const actionResult = await dispatch(addProduct({ productDetails }));
      const result = unwrapResult(actionResult);

      if (result.status) {
        setProductData(initialState);
        setImage("");
        navigate(-1);
      }
    } catch (error) {
      toast.error("Failed to add product");
      console.error(error);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "768px" }}>
      <form className="row g-3 my-5 shadow p-2 rounded" onSubmit={handleSubmit}>
        <div className="h4 text-center mb-3">Add Product</div>

        <div className="col-12">
          <label htmlFor="title" className="form-label fw-bold">
            Title :
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={productData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12">
          <label htmlFor="description" className="form-label fw-bold">
            Description :
          </label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="brand" className="form-label fw-bold">
            Brand :
          </label>
          <input
            type="text"
            className="form-control"
            id="brand"
            name="brand"
            value={productData.brand}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="price" className="form-label fw-bold">
            Price :
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="status" className="form-label fw-bold">
            Status :
          </label>
          <select
            className="form-select"
            id="status"
            name="status"
            value={productData.status}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Status --</option>
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        <div className="col-md-6">
          <label htmlFor="category" className="form-label fw-bold">
            Category :
          </label>
          <select
            className="form-select"
            id="category"
            name="category"
            value={productData.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Category --</option>
            {categories &&
              categories.map(({ category, id, status }) =>
                status === "active" ? (
                  <option key={id} value={category}>
                    {category}
                  </option>
                ) : null
              )}
          </select>
        </div>

        <div className="col-md-6">
          <label htmlFor="image" className="form-label fw-bold">
            Image :
          </label>
          <input type="file" className="form-control" id="image" onChange={handleImageChange} required />
        </div>

        <div className="col-md-6">
          {image && <img className="mh-100 mw-100" src={image} alt="Preview" />}
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary mb-2 me-2">
            Add Product
          </button>
          <button type="button" className="btn btn-danger mb-2 ms-2" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductAdd;
