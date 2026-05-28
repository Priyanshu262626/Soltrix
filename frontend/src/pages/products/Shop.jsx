import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import FilterSidebar from '../../components/common/FilterSidebar';
import ProductGrid from '../../components/common/ProductGrid';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = ['ALL', 'SNEAKERS', 'RUNNING', 'CASUAL', 'FORMAL'];
const ITEMS_PER_PAGE = 8; // Adjust pagination size for a cleaner grid view

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('none');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'ALL';
    const urlSearch = searchParams.get('search') || '';
    setCategory(urlCategory);
    setSearch(urlSearch);
    setCurrentPage(1); // Reset page on query change
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const catParam = category === 'ALL' ? '' : category;
      const data = await api.products.getAll(search, catParam);
      setProducts(data);
    } catch (err) {
      setError('Failed to load shoe catalog. Please make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    const newParams = {};
    if (category !== 'ALL') newParams.category = category;
    if (query) newParams.search = query;
    setSearchParams(newParams);
  };

  const handleCategoryClick = (cat) => {
    const newParams = {};
    if (cat !== 'ALL') newParams.category = cat;
    if (search) newParams.search = search;
    setSearchParams(newParams);
    setShowMobileFilters(false);
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low-high') return a.price - b.price;
    if (sortBy === 'price-high-low') return b.price - a.price;
    return 0;
  });

  // Client-side pagination calculations
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-[#fcfcfd] min-h-screen text-left">
      {/* Page Header */}
      <div className="border-b border-neutral-100 py-16 px-10 bg-[#f7f7f9]">
        <div className="max-w-[90rem] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] text-neutral-400 uppercase block">
              COLLECTION
            </span>
            <h1 className="text-4xl md:text-5xl font-serif-editorial text-black tracking-tight mt-2 uppercase leading-none">
              {category} Models
            </h1>
          </div>
          
          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
              {products.length} Designs
            </span>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center space-x-1.5 border border-neutral-200 rounded px-4 py-2 text-xs font-bold uppercase tracking-wider text-black cursor-pointer bg-white"
            >
              <SlidersHorizontal size={12} />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-[90rem] mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Desktop Filter Sidebar (Left Column) */}
          <aside className="hidden lg:block border-r border-neutral-100 pr-8 w-[240px] shrink-0">
            <FilterSidebar
              categories={CATEGORIES}
              activeCategory={category}
              onCategoryChange={handleCategoryClick}
              activeSearch={search}
              onSearchChange={handleSearch}
              activeSort={sortBy}
              onSortChange={setSortBy}
            />
          </aside>

          {/* Catalog Listing (Right Column) */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="border-3 border-black border-t-transparent w-8 h-8 rounded-full animate-spin"></div>
                <span className="mt-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Loading catalog...</span>
              </div>
            ) : error ? (
              <div className="text-center py-16 border border-neutral-200 rounded-lg bg-neutral-50 max-w-lg mx-auto">
                <p className="text-sm font-semibold text-red-500">{error}</p>
                <button onClick={fetchProducts} className="nike-btn-black mt-4 text-xs cursor-pointer">
                  Reload Catalog
                </button>
              </div>
            ) : (
              <>
                <ProductGrid products={paginatedProducts} />
                
                {/* Pagination Controls */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Sidebar overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-80 h-full p-6 text-left shadow-2xl overflow-y-auto flex flex-col space-y-6 animate-slideIn">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-black">Filter catalog</h3>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-400 hover:text-black bg-transparent border-0 cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            <FilterSidebar
              categories={CATEGORIES}
              activeCategory={category}
              onCategoryChange={handleCategoryClick}
              activeSearch={search}
              onSearchChange={handleSearch}
              activeSort={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>
      )}

    </div>
  );
}
