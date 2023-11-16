import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice';

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
    const filename = new Date().getTime() + image.name;
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
        updateUserFailure(data);
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      updateUserFailure(err);
    } 
  };

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
    </form>
    <div className='flex justify-between mt-3 font-bold'>
      <span className='text-red-500 cursor-pointer'>Delete Account</span>
      <span className='text-red-500 cursor-pointer'>Sign out</span>
    </div>
    <p className='text-red-700 mt-3'>{user.error && 'Something went wrong!'}</p>
    <p className='text-green-700 mt-3'>{updateSuccess && 'User updated successfully'}</p>
  </div>
  );
}
