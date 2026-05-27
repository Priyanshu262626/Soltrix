import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ShieldCheck, Tag, ShoppingBag, Landmark, Plus, ArrowRight, AlertCircle, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  // Role Guard
  if (!user || user.role !== 'ROLE_ADMIN') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center bg-white">
        <div className="border border-red-200 p-8 rounded-lg bg-red-50">
          <h2 className="text-xl font-bold text-red-600 uppercase tracking-wider">Access Denied (403)</h2>
          <p className="text-gray-500 mt-2 text-xs">
            You do not have administrative privileges to access this panel.
          </p>
        </div>
      </div>
    );
  }

  const [stats, setStats] = useState({
    totalProducts: 0,
    outOfStock: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const prodList = await api.products.getAll();
      const ordList = await api.admin.getAllOrders();

      const outOfStockCount = prodList.filter((p) => p.stock <= 0).length;
      const totalRevenue = ordList
        .filter((o) => o.status !== 'CANCELLED')
        .reduce((sum, o) => sum + o.totalAmount, 0);

      setStats({
        totalProducts: prodList.length,
        outOfStock: outOfStockCount,
        totalOrders: ordList.length,
        revenue: totalRevenue,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[90rem] mx-auto px-6 py-12 text-left">
        
        {/* Header */}
        <div className="border-b border-gray-100 pb-5 mb-8">
          <h1 className="text-3xl font-black text-black uppercase tracking-tighter flex items-center">
            <ShieldCheck className="mr-2.5 text-black shrink-0" size={30} /> Admin Dashboard
          </h1>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-1">
            General Sales, Inventory Metrics and Actions
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="border-3 border-black border-t-transparent w-8 h-8 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-10 animate-fadeIn">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Gross Revenue */}
              <div className="border border-neutral-200 rounded-lg p-5 bg-neutral-50 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xxs font-extrabold uppercase tracking-widest text-gray-400">Total Revenue</span>
                  <div className="text-2xl font-black text-black font-mono">₹{stats.revenue.toLocaleString('en-IN')}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-black">
                  <Landmark size={18} />
                </div>
              </div>

              {/* Total Orders */}
              <div className="border border-neutral-200 rounded-lg p-5 bg-neutral-50 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xxs font-extrabold uppercase tracking-widest text-gray-400">Total Orders</span>
                  <div className="text-2xl font-black text-black font-mono">{stats.totalOrders}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-black">
                  <ShoppingBag size={18} />
                </div>
              </div>

              {/* Total Products */}
              <div className="border border-neutral-200 rounded-lg p-5 bg-neutral-50 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xxs font-extrabold uppercase tracking-widest text-gray-400">Inventory Items</span>
                  <div className="text-2xl font-black text-black font-mono">{stats.totalProducts}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-black">
                  <Tag size={18} />
                </div>
              </div>

              {/* Out of Stock Warning */}
              <div className="border border-neutral-200 rounded-lg p-5 bg-neutral-50 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xxs font-extrabold uppercase tracking-widest text-gray-400">Out of Stock</span>
                  <div className={`text-2xl font-black font-mono ${stats.outOfStock > 0 ? 'text-red-600 animate-pulse' : 'text-black'}`}>
                    {stats.outOfStock}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-black">
                  <AlertCircle size={18} />
                </div>
              </div>

            </div>

            {/* Quick Actions Panel */}
            <div>
              <h2 className="text-lg font-black text-black uppercase tracking-tighter mb-5 border-l-4 border-black pl-2.5">
                Quick Operations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Products CRUD Management */}
                <Link
                  to="/admin/products"
                  className="border border-neutral-200 rounded-lg p-6 bg-white hover:border-black transition-colors flex flex-col justify-between group h-40 cursor-pointer"
                >
                  <Tag size={24} className="text-black" />
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <h3 className="font-extrabold text-black uppercase tracking-wider text-xs">Manage Products</h3>
                      <p className="text-gray-400 text-xxs mt-1 font-medium">Browse, edit, and delete active shoe catalog listings.</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                  </div>
                </Link>

                {/* Add Product Form */}
                <Link
                  to="/admin/add-product"
                  className="border border-neutral-200 rounded-lg p-6 bg-white hover:border-black transition-colors flex flex-col justify-between group h-40 cursor-pointer"
                >
                  <Plus size={24} className="text-black" />
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <h3 className="font-extrabold text-black uppercase tracking-wider text-xs">Add Shoe Product</h3>
                      <p className="text-gray-400 text-xxs mt-1 font-medium">Insert a new shoe model, set pricing, sizes, and stock limits.</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                  </div>
                </Link>

                {/* Customer Order Management */}
                <Link
                  to="/admin/orders"
                  className="border border-neutral-200 rounded-lg p-6 bg-white hover:border-black transition-colors flex flex-col justify-between group h-40 cursor-pointer"
                >
                  <ShoppingBag size={24} className="text-black" />
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <h3 className="font-extrabold text-black uppercase tracking-wider text-xs">Manage Orders</h3>
                      <p className="text-gray-400 text-xxs mt-1 font-medium">Update shipping status, track pending, shipped or completed bills.</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                  </div>
                </Link>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
