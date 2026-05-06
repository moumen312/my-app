import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Check, Clock, TrendingUp, Tag, SortAsc, SortDesc } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterOption {
  id: string;
  label: string;
  icon?: React.ElementType;
  value?: string;
  hasSubmenu?: boolean;
}

interface FilterDropdownProps {
  categories: string[];
}

export default function FilterDropdown({ categories }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentSort = searchParams.get("sort") || "newest";

  const currentCategory = searchParams.get('category') || 'All';
  const router = useRouter();

  const sortOptions: FilterOption[] = [
    { id: 'newest', label: 'Newest', icon: Clock },
    { id: 'oldest', label: 'Oldest', icon: SortAsc },
    { id: 'popular', label: 'Most Requested', icon: TrendingUp },
    { id: 'category', label: 'Category', icon: Tag, hasSubmenu: true },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSort = (id: string) => {
    if (id === 'category') return; // Submenu handles this
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', id);
    // If selecting a general sort, maybe we want to keep or clear category? 
    // Usually category and sort are additive.
    router.push(`?${newParams.toString()}`);
    setIsOpen(false);
  };

  const handleSelectCategory = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    router.push(`?${newParams.toString()}`);
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  const getActiveLabel = () => {
    if (currentCategory !== 'All') return `Category: ${currentCategory}`;
    const option = sortOptions.find(o => o.id === currentSort);
    return option ? option.label : 'Sort & Filter';
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
  <button
    onClick={() => setIsOpen(!isOpen)}
    className={`flex items-center justify-center min-w-[160px] h-22   px-4 ml-2 
      rounded-xl text-sm font-semibold transition-all border whitespace-nowrap
      ${isOpen || currentCategory !== 'All' || currentSort !== 'newest'
        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 shadow-sm'
      }
    `}
  >
    {/* This span ensures the text itself is centered */}
    <span className="flex-1 text-center">{getActiveLabel()}</span>
    
    <ChevronDown 
      className={`w-4 h-8 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
    />
  </button>


      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-visible"
          >
            <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Sort & Filter
            </div>
            
            <div className="space-y-1">
              {sortOptions.map((option) => (
                <div key={option.id} className="relative">
                  <button
                    onClick={() => {
                      if (option.hasSubmenu) {
                        setActiveSubmenu(activeSubmenu === option.id ? null : option.id);
                      } else {
                        handleSelectSort(option.id);
                      }
                    }}
                    onMouseEnter={() => option.hasSubmenu && setActiveSubmenu(option.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors group ${
                      currentSort === option.id && !option.hasSubmenu
                        ? 'bg-blue-50 text-blue-600 font-bold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {option.icon && <option.icon className={`w-4 h-4 ${currentSort === option.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />}
                      {option.label}
                    </div>
                    {option.hasSubmenu ? (
                      <ChevronRight className={`w-4 h-4 transition-transform ${activeSubmenu === option.id ? 'rotate-90' : ''}`} />
                    ) : (
                      currentSort === option.id && <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>

                  <AnimatePresence>
                    {option.hasSubmenu && activeSubmenu === option.id && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute left-full top-0 ml-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 origin-left"
                      >
                         <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Categories
                        </div>
                        <button
                          onClick={() => handleSelectCategory('All')}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors ${
                            currentCategory === 'All'
                              ? 'bg-blue-50 text-blue-600 font-bold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          All Categories
                          {currentCategory === 'All' && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => handleSelectCategory(cat)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors ${
                              currentCategory === cat
                                ? 'bg-blue-50 text-blue-600 font-bold'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {cat}
                            {currentCategory === cat && <Check className="w-4 h-4 text-blue-600" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}