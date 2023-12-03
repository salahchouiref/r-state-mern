import React from 'react';

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen md:w-1/2'>
        <form className='flex flex-col gap-4'>
          <div className='flex items-center gap-4 mb-4'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
            />
          </div>
          <div className='flex gap-4 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2 items-center'>
              <input type='checkbox' id='all' className='w-5' />
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type='checkbox' id='rent' className='w-5' />
              <span>Rent</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type='checkbox' id='sale' className='w-5' />
              <span>Sale</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type='checkbox' id='offer' className='w-5' />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex gap-4 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2 items-center'>
              <input type='checkbox' id='parking' className='w-5' />
              <span>Parking</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type='checkbox' id='furnished' className='w-5' />
              <span>Furnished</span>
            </div>
          </div>
          <div className='flex items-center gap-4 mb-4'>
            <label className='font-semibold'>Sort:</label>
            <select id='sort_order' className='border rounded-lg p-3 text-gray-800'>
              <option>Price high to low</option>
              <option>Price low to high</option>
              <option>Latest</option>
              <option>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:bg-slate-800'>
            Search
          </button>
        </form>
      </div>
      <div className='p-4'>
        <h1 className='text-3xl font-semibold border-b pb-2 text-slate-700'>Listing results:</h1>
        {/* ... (listing content) */}
      </div>
    </div>
  );
}