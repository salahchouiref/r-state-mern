import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable,deleteObject } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure , 
         deleteUserStart , deleteUserSuccess , deleteUserFailure , SignOut} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";

export default function Profile() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const filename = "mern-state-profile/"+new Date().getTime() + image.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, image);
    setImageError(false);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(Math.round(progress));
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, profilePicture: downloadUrl });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    // Frontend validation
    const validationErrors = {};

// Check if username is changed or not empty
if (formData.username !== undefined && (formData.username.trim() === '' && formData.username !== user.currentUser.username)) {
  validationErrors.username = 'Username is required';
}

// Check if email is changed or not empty
if (formData.email !== undefined && (formData.email.trim() === '' || formData.email !== user.currentUser.email)) {
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    validationErrors.email = 'Please enter a valid email address';
  }
}

// Minimum length for username and password
const minUsernameLength = 6;
if (formData.username && formData.username.length < minUsernameLength) {
  validationErrors.username = `Username must be at least ${minUsernameLength} characters`;
}

const minPasswordLength = 6;
if ((formData.password && formData.password.length < minPasswordLength) || (formData.password!== undefined && formData.password ==="")) {
  validationErrors.password = `Password must be at least ${minPasswordLength} characters`;
}

if (Object.keys(validationErrors).length > 0) {
  setErrors(validationErrors);
  return;
}

    
     /// we stop here for test
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${user.currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(err));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err));
    } 
  };

  const deleteImageFromFirebase = async (imageUrl) => {
    if(imageUrl.includes("mern-state-profile")){
      const storage = getStorage(app);
      const imageRef = ref(storage,imageUrl);
      await deleteObject(imageRef).then(()=>{
        console.log("Profile picture was deleted  successfuly");
      }).catch((err)=>{
        console.log(err);
      });
    }
  }; 

  const handleDelete = async (e) =>{
    e.preventDefault();
    const { value } = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if(!value) return;
    deleteImageFromFirebase(user.currentUser.profilePicture);
    try{
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${user.currentUser._id}`,{
        method : "DELETE",
      });
      const data = await res.json();
      if(data.success == false){
        dispatch(deleteUserFailure(data));
        return ;
      }
      dispatch(deleteUserSuccess());
    }catch(err){
      dispatch(deleteUserFailure(err))
    }
  };

  const handleSignOut = async (e) =>{
    e.preventDefault();
    try{
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if(data.success){
        console.log(data.message);
      };
      dispatch(SignOut());
    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='file' ref={fileRef} hidden accept='image/*' onChange={(e)=>setImage(e.target.files[0])} />
        <img src={formData.profilePicture || user.currentUser.profilePicture} alt="profile"
          className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2' 
          onClick={()=>fileRef.current.click()}
          />
          <p className='text-sm self-center'>
            {imageError
            ?(<span className='text-red-700'>Error uploading image</span>)
            :imagePercent>0 && imagePercent<100 
            ? <span className='text-slate-700'>{`uploading: ${imagePercent} %`}</span> 
            :imagePercent===100?
            <span className='text-green-700'>Image uploaded successfully</span>
            : '' }
          </p>
          <input
        type='text'
        onChange={handleChange}
        defaultValue={user.currentUser.username}
        id='username'
        placeholder='Username'
        className={`bg-violet-100 rounded-lg p-3 ${
          errors.username ? 'border-red-500' : ''
        }`}
      />
      {errors.username && (
        <p className='text-red-600 mt-1 text-sm'>{errors.username}</p>
      )}
      <input
        type='email'
        onChange={handleChange}
        defaultValue={user.currentUser.email}
        id='email'
        placeholder='Email'
        className={`bg-violet-100 rounded-lg p-3 ${
          errors.email ? 'border-red-500' : ''
        }`}
      />
      {errors.email && (
        <p className='text-red-600 mt-1 text-sm'>{errors.email}</p>
      )}
      <input
        type='password'
        onChange={handleChange}
        id='password'
        placeholder='Password'
        className={`bg-violet-100 rounded-lg p-3 ${
          errors.password ? 'border-red-500' : ''
        }`}
      />
      {errors.password && (
        <p className='text-red-600 mt-1 text-sm'>{errors.password}</p>
      )}
      <button
        disabled={user.loading}
        className='bg-violet-600 p-3 text-white uppercase hover:opacity-60 rounded-lg disabled:opacity-30'
      >
        {user.loading ? 'loading ...' : 'update'}
      </button>
      <div className='flex flex-wrap gap-2'>
  <Link to={"/create-listing"} className='flex-1 bg-green-700 text-white rounded-lg text-center uppercase p-3 hover:opacity-50'>
    Create Listing
  </Link>
  <Link to={"/show-listings"} className='flex-1 bg-yellow-300 rounded-lg text-center uppercase p-3 hover:opacity-50'>
    Show Listings
  </Link>
</div>

    </form>
    <div className='flex justify-between mt-3 font-bold'>
      <span className='text-red-500 cursor-pointer' onClick={handleDelete}>Delete Account</span>
      <span className='text-red-500 cursor-pointer' onClick={handleSignOut}>Sign out</span>
    </div>
    <p className='text-red-700 mt-3'>{user.error && 'Something went wrong!'}</p>
    <p className='text-green-700 mt-3'>{updateSuccess!==false && 'User updated successfully'}</p>
  </div>
  );
}
