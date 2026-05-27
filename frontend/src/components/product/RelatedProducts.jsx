import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import ProductCard from '../common/ProductCard';

export default function RelatedProducts({ category, currentProductId }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      fetchRelated();
    }
  }, [category, currentProductId]);

  const fetchRelated = async () => {
    setLoading(true);
    try {
      const data = await api.products.getAll('', category);
      // Filter out the current product
      const filtered = data.filter((p) => p.id !== currentProductId);
      // Slice first 4 products
      setRelated(filtered.slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="border-2 border-black border-t-transparent w-6 h-6 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (related.length === 0) return null;

  return (
    <div className="border-t border-neutral-100 pt-16 mt-20 text-left">
      <div className="mb-10">
        <span className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase block">
          08 / EXPLORE MORE
        </span>
        <h2 className="text-2xl md:text-3xl font-serif-editorial text-black tracking-tight mt-2">
          You May Also Like
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
