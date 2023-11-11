import { useState } from "react";
import { Link , useNavigate} from "react-router-dom";

export default function SignUp() {
  const [formdata,setFormData] = useState({});
  const [error,setError] = useState(false);
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate(); 
  const handleChange = (e) =>{
    setFormData({...formdata,[e.target.id]:e.target.value});
  };
  const handleSubmit = async (e) =>{
    e.preventDefault();
    setLoading(true);
    try{
      const res = await fetch("/api/auth/signup",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(formdata),
      });
      const data = await res.json();
      if(data.success === false){
        setError(true);
        return ;  
      };
      navigate("/sign-in");
    }catch(err){
      setLoading(false);
      setError(true);
    }
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" className="bg-violet-50 p-3 rounded-lg " placeholder="username" id='username' onChange={handleChange}/>
        <input type="email" className="bg-violet-50 p-3 rounded-lg " placeholder="email" id='email' onChange={handleChange}/>
        <input type="password" className="bg-violet-50 p-3 rounded-lg " placeholder="password" id='password' onChange={handleChange}/>
        <button disabled={loading?true:false} className="bg-violet-900 text-white p-2 rounded-l uppercase hover:opacity-80">
          {loading ? "Loading ..." : "sign up"}
        </button>
      </form>
      <div className="flex gap-2 mt-2 ">
        <p>Have an account</p>
        <Link to="/sign-in">
          <span className='text-blue-600'>Sign in</span>
        </Link>
      </div>
        {
          error && <p className="text-red-600 mt-3 ">Something went wrong !</p>
        }
    </div>
  )
}