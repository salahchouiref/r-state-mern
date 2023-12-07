import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* Top Section */}
      <div className='bg-gray-100 py-20 px-4 text-center'>
        <h1 className='text-4xl lg:text-6xl font-bold text-gray-800 mb-4'>
          Find your next <span className='text-blue-500'>perfect</span> place with ease
        </h1>
        <p className='text-gray-600 text-lg mb-6'>
          Sech Estate is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </p>
        <Link
          to='/search'
          className='text-sm md:text-base text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      {/* Swiper Section */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                  height: '500px',
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listing Results Section */}
      <div className='container mx-auto py-10 '>
        {renderListings("Recent offers", offerListings, '/search?offer=true')}
        {renderListings("Recent places for rent", rentListings, '/search?type=rent')}
        {renderListings("Recent places for sale", saleListings, '/search?type=sale')}
      </div>
    </div>
  );
}

// Helper function to render listing sections
const renderListings = (title, listings, link) => {
  return (
    <div className='mb-8 mx-5'>
      <div className='mb-3'>
        <h2 className='text-2xl font-semibold text-gray-800'>{title}</h2>
        <Link className='text-sm text-blue-800 hover:underline' to={link}>
          Show more
        </Link>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {listings && listings.length > 0 &&
          listings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
      </div>
    </div>
  );
};
