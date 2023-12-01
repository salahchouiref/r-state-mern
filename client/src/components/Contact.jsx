import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {
    const [landlord,setLandlord] = useState(null);
    const [message,setMessage] = useState("");
    useEffect(()=>{
        const bringData = async () =>{
            try{
                const res = await fetch(`/api/user/${listing.userRef}`,{
                    method:"GET"
                });
                const data = await res.json();
                if(data.success === false){
                    return console.log(data.message);
                }
                setLandlord(data);
            }catch(err){
                console.log(err);
            }
        };
        bringData();
    },[listing.userRef]);

  return (
    <>
        {
            landlord && (
                <div className="flex flex-col gap-2">
                    <p className='flex gap-2 flex-col'>You can Contact Here
                        <span className='font-semibold'>{ landlord.username }</span>
                        <textarea placeholder="Enter you're message here ..." name='message' id='message' className='w-full bg-stone-100 p-3 border border-slate-500 rounded-lg' rows={2} value={message} onChange={(e)=>setMessage(e.target.value)} ></textarea>
                        <Link className='bg-stone-600 text-white text-center uppercase p-3 rounded-lg hover:opacity-80' 
                        to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}>Send message</Link>
                    </p> 
                </div>
            )
        }
    </>
  )
}
