import React, { useEffect, useState } from 'react';
import {FaSearch} from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import {  useSelector } from 'react-redux';

export default function Header() {
    const user = useSelector(state=>state.user);
    const [searchTerm,setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {           
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm',searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(()=>{
       const urlParams = new URLSearchParams(location.search);
       const searchTermFormUrl = urlParams.get('searchTerm');
       if(searchTermFormUrl){
        setSearchTerm(searchTermFormUrl);
       } 
    },[location.search]);
  return (
    <header className='bg-stone-200 shadow-md'>
     <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to="/">
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                <span className='text-stone-400'>Sech</span>
                <span className='text-stone-800'>R-state</span>
            </h1>
        </Link>
        <form className='bg-stone-100 p-3 rounded-lg flex items-center' onSubmit={handleSubmit}>
            <input type='text' placeholder='search...' className='bg-transparent focus:outline-none w-24 sm:w-64' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            <button>
                <FaSearch className='text-stone-500' />
            </button>
        </form>
        <ul className='flex gap-4'>
            <Link to="/">
                <li className='hidden sm:inline hover:underline cursor-pointer'>Home</li>
            </Link>
            <Link to="/about">
                <li className='hidden sm:inline hover:underline cursor-pointer'>About</li>
            </Link>
            <Link to="/profile">
            {
                user.currentUser ? <li>
                    <img className='rounded-full h-7 w-7 object-cover' 
                    src={user.currentUser.profilePicture} alt='profilePicture'/>
                </li> 
                : <li className='hover:underline cursor-pointer'>Sign in</li>
            }
            </Link>
        </ul>
     </div>
    </header>
  )
}
