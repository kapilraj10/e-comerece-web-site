import React from 'react'
import  { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../App/features/ordersSlice';
import OrdersTable from '../../Components/Admin/Orders/OrdersTable';
import Search from '../../Components/Admin/Search';
import Pagination from '../../Components/Pagination';

const Orders = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    dispatch(fetchOrders({ signal }));

    return () => {
      controller.abort();
    };
  }, [dispatch]);

  const { error, orders } = useSelector((state) => state.orders);

  const [ordersData, setOrdersData] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const dataLimit = 4;
  const lastIndex = page * dataLimit;
  const firstIndex = lastIndex - dataLimit;
  const totalData = ordersData.length;
  const currentOrders = ordersData.slice(firstIndex, lastIndex);

  useEffect(() => {
    // Remove older data (Example: Orders older than 30 days)
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.date); // Assuming orders have a 'date' field
      const today = new Date();
      const differenceInDays = (today - orderDate) / (1000 * 60 * 60 * 24);
      return differenceInDays <= 30; // Keep only orders from the last 30 days
    });

    setOrdersData(filteredOrders);
  }, [orders]);

  // Search function
  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredOrders = ordersData.filter((order) =>
      order.customerName.toLowerCase().includes(searchText)
    );
    setOrdersData(filteredOrders);
    setPage(1);
  };

  if (error) {
    return <div className="text-center my-5">{error}</div>;
  }

  return (
    <div className="container">
      <div className="card my-5">
        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-end">
          <Search handleSearch={handleSearch} />
        </div>
        <div className="card-body">
          {orders.length ? (
            <>
              <OrdersTable orders={currentOrders} />
              <Pagination page={page} setPage={setPage} total={totalData} limit={dataLimit} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Orders;
