import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ArrowLeft, Tag, Pencil, Trash2, Plus, Loader } from 'lucide-react';

export default function AdminProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.products.getAll();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shoe product?')) return;
    try {
      await api.products.delete(id);
      fetchProducts();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[90rem] mx-auto px-6 py-12 text-left">
        
        {/* Back Link */}
        <Link to="/admin" className="inline-flex items-center text-gray-400 hover:text-black mb-8 transition-colors text-xs font-bold uppercase tracking-wider">
          <ArrowLeft size={14} className="mr-1.5" /> Back to Dashboard
        </Link>

        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-5 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-black uppercase tracking-tighter flex items-center">
              <Tag className="mr-2.5 text-black shrink-0" size={30} /> Product Catalog
            </h1>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-1">
              Catalog Items Total: {products.length}
            </p>
          </div>
          <Link
            to="/admin/add-product"
            className="nike-btn-black flex items-center space-x-1.5 text-xs shadow-md shrink-0 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add New Shoe</span>
          </Link>
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
                    <th className="px-6 py-4">Shoe</th>
                    <th className="px-6 py-4">Brand</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Sizes</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-black flex items-center space-x-3">
                        <div className="w-9 h-9 rounded bg-white p-1 flex items-center justify-center border border-neutral-200/50 shrink-0">
                          <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-contain" />
                        </div>
                        <span className="truncate max-w-[150px] uppercase">{prod.name}</span>
                      </td>
                      <td className="px-6 py-4 uppercase font-semibold text-xs text-gray-500">{prod.brand}</td>
                      <td className="px-6 py-4">
                        <span className="text-xxs px-2.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-gray-500 uppercase font-bold tracking-wider">
                          {prod.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-black">₹{prod.price.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className={`font-bold font-mono text-xs ${prod.stock <= 5 ? 'text-red-600' : 'text-gray-800'}`}>
                          {prod.stock} pcs
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-[120px] truncate font-mono text-xs text-gray-500">{prod.sizes}</td>
                      <td className="px-6 py-4 text-right space-x-2.5 whitespace-nowrap">
                        <Link
                          to={`/admin/edit-product/${prod.id}`}
                          className="text-black hover:opacity-75 p-2 rounded hover:bg-neutral-100 transition-all inline-block border-0"
                          title="Edit Product"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="text-red-600 hover:text-red-500 p-2 rounded hover:bg-red-50 transition-colors border-0 cursor-pointer bg-transparent"
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </button>
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
