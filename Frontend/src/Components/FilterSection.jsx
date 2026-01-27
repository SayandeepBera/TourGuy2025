import React from 'react'
import { useContext } from 'react';
import DestinationsContext from '../Context/Destinations/DestinationsContext';
import AdvancedFilter from './AdvancedFilter';

const FilterSection = React.memo(() => {
  const { selectedType, setSelectedType, setSelectedCategory, setSearchQuery } = useContext(DestinationsContext);

  const filters = [
    { id: 'All', label: 'All Destinations' },
    { id: 'National', label: 'National Tours' },
    { id: 'International', label: 'International Tours' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-center items-center gap-6">

        {/* Type Filter Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
          {filters.map((filter) => (
            <button
              key={filter.id}
              id={`filter-${filter.id}`}
              onClick={() => setSelectedType(filter.id)}
              className={`px-6 py-2 md:px-8 md:py-3 rounded-full font-semibold border-2 text-lg cursor-pointer hover:bg-cyan-400 hover:text-white transition duration-150 ${selectedType === filter.id ? "bg-[#00C4CC] border-[#00C4CC] text-white text-xl shadow-[0_0_20px_#0ef]" : "bg-transparent border-gray-400 text-[#00C4CC]"}`}
            >
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Advanced Filter Dropdown */}
        <AdvancedFilter />
      </div>
    </div>
  )
})

export default FilterSection
