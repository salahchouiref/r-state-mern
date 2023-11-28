import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {Swiper , SwiperSlide} from "swiper/react";
import SwiperCore from "swiper";
import {Navigation} from "swiper/modules";
import 'swiper/css/bundle';
export default function Listing() {
  SwiperCore.use(Navigation);
  const params = useParams();
  const [listing,setListing] = useState(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  useEffect(()=>{
    const fetchListing = async () => {
      try{
        const res = await fetch(`/api/listing/get/${params.id}`,{
          method : "GET"
        });
        const data = await res.json();
        if(data.success === false){
          setLoading(false);
          setError(true);
          return console.log(data);
        };
        setLoading(false);
        console.log(data);
        setListing(data);
      }catch(err){
        console.log(err);
      }
    };
    fetchListing();
  },[params.id]);
  return (
    <main>
      {loading && <p className='text-center my-7'>Loading ...</p>}
      {error && <p className='text-center text-red-600 my-7'>Something went wrong !</p>}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url,index)=>{
              return <SwiperSlide key={url} >
                {/* <div className='h-[500px]' style={{background:`url(${url}) center no-repeat`}}></div> */}
                {/* <img src={url} /> */}
                <div className='h-[500px]' style={{background:`url("${url}") center no-repeat`,backgroundSize:'cover'}}>
                  
                </div>
              </SwiperSlide>
            })}
          </Swiper>
        </div>
      )}
    </main>
  )
}
