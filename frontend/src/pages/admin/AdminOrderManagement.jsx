import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, ShoppingBag, Loader, Clock, Truck, CheckCircle, ShieldAlert } from 'lucide-react';

export default function AdminOrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.admin.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.admin.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="text-xxs font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className="text-xxs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Approved
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="text-xxs font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Shipped
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="text-xxs font-extrabold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Delivered
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="text-xxs font-extrabold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="text-xxs font-extrabold text-gray-500 bg-neutral-100 border border-neutral-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[90rem] mx-auto px-6 py-12 text-left">
        
        {/* Back Link */}
        <Link to="/admin" className="inline-flex items-center text-gray-400 hover:text-black mb-8 transition-colors text-xs font-bold uppercase tracking-wider">
          <ArrowLeft size={14} className="mr-1.5" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="border-b border-gray-100 pb-5 mb-8">
          <h1 className="text-3xl font-black text-black uppercase tracking-tighter flex items-center">
            <ShoppingBag className="mr-2.5 text-black shrink-0" size={30} /> Order Management
          </h1>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-1">
            Total System Orders: {orders.length}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-black" size={32} />
          </div>
        ) : (
          <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-xs animate-fadeIn">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-800">
                <thead className="text-xs text-gray-500 uppercase bg-neutral-50 border-b border-neutral-200 font-bold">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Shipping Destination</th>
                    <th className="px-6 py-4">Current Status</th>
                    <th className="px-6 py-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-black">#{order.id}</td>
                      <td className="px-6 py-4 text-xs font-mono text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString('en-IN', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 font-bold text-black">
                        <div>{order.user.name}</div>
                        <div className="text-xxs text-gray-400 font-mono font-bold mt-0.5">{order.user.email}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-black font-extrabold">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4 max-w-[180px] truncate text-xs text-gray-500" title={order.shippingAddress}>
                        {order.shippingAddress}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-white border border-neutral-200 rounded px-2.5 py-1.5 text-xs text-black font-bold uppercase tracking-wider focus:outline-none focus:border-black cursor-pointer"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
