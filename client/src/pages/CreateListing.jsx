import { useState } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage";
import {app} from "../firebase";
import { useSelector } from 'react-redux';
import {useNavigate} from "react-router-dom";

export default function CresetateListing() {
  const {currentUser} = useSelector(state=>state.user);
  const [files,setFiles] = useState([]);
  const [formData,setFormData] = useState({
    imageUrls : [],
    name : "",
    description : "",
    address : "",
    type : "rent",
    bedrooms : 1,
    bathrooms : 1,
    regularPrice : 50,
    discountPrice : 0,
    offer : false,
    parking : false,
    furnished : false,
  }); 
  const [imageUploadError,setImageUploadError] = useState(null);
  const [uploading,setUploading] = useState(false);
  const [uploadingSuccess,setUploadingSuccess] = useState(false);
  const [loading,setLoading] = useState(false);
  const [loadingSuccess,setLoadingSuccess] = useState(false);
  const [loadingError,setLoadingError] = useState(false);
  const [errorMessage,setErrorMessage] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();
  const handleImageChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);

    // Create image previews for selected files
    const previews = Array.from(selectedFiles).map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };


  const handleImageSubmit = (e) =>{
    if(files.length>0 && files.length + formData.imageUrls.length <7){
      setErrorMessage(null);
      setLoadingError(false);
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for(let i = 0;i<files.length;i++){
        promises.push(storeImage(files[i]));
      } 
      Promise.all(promises).then((urls)=>{
        setFormData({...formData,imageUrls:formData.imageUrls.concat(urls)});
        setImageUploadError(false);
        setUploading(false);
        setUploadingSuccess(true);
        setFiles([]);
        setImagePreviews([]);
      }).catch((err)=>{
        setImageUploadError("Image upload failed (2mb max per image)");   
        setUploading(false);
        setUploadingSuccess(false);
      });
    }else{
      setImageUploadError("You can upload at least 1 to 6 images per listing");
      setUploading(false);
      setUploadingSuccess(false);
    }
  };
  
  const storeImage = async (file) =>{
      return new Promise((resolve,reject)=>{
        const storage = getStorage(app);
        const fileName ="mern-state-listing/"+ new Date().getTime() + file.name;
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef,file);
        uploadTask.on(
          "state_changed",
          (snapshot)=>{
            const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
          },
          (error)=>{
            reject(error);
          },
          ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
              resolve(downloadURL);
            });
          }
        )

      })
  };
  
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls : formData.imageUrls.filter((_,i)=>i!==index),
    });
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
    
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleChange = (e) => {
    if(e.target.id === "sale" || e.target.id === "rent"){
      setFormData({
        ...formData,
        type : e.target.id
      });
    }
    
    if(e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer"){
      setFormData({
        ...formData,
        [e.target.id] : e.target.checked
      });
    }
    
    if(e.target.id === "sale" || e.target.id === "rent"){
      setFormData({
        ...formData,
        type : e.target.id
      })
    }
    
    if(e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea"){
      setFormData({
        ...formData,
        [e.target.id] : isNaN(e.target.value)?e.target.value:Number(e.target.value)
      });
    }
  };

  const handleSubmit = async (e) =>{
      e.preventDefault();
      if(formData.imageUrls.length<1){
        setLoadingError(true); 
        setErrorMessage("You must upload at least one image"); 
        return;
      }
      if(+formData.regularPrice <= +formData.discountPrice){
        setLoadingError(true); 
        setErrorMessage("The discount price must be less than the regular price"); 
        return;
      }
      try{
        setLoading(true);
        setLoadingError(false);
        const res = await fetch("/api/listing/create",{
          method : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...formData , userRef : currentUser._id}),
        });
        const data = await res.json();
        if(data.success === false){
          setLoading(false);
          setLoadingError(true); 
          setErrorMessage(data.message); 
          return;
        }
        setLoading(false);
        setErrorMessage(null);
        setLoadingSuccess(true);
        navigate(`/listing/${data._id}`); 

      }catch(err){
        setLoading(false);
        setLoadingError(true);
        setErrorMessage(err);
      }
  }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input type='text' placeholder='Name' className='border p-3 rounded-lg bg-slate-50' id='name' maxLength="62" minLength="10" required value={formData.name}  onChange={handleChange}/>
          <textarea type='text' placeholder='Description' className='border p-3 rounded-lg bg-slate-50' id='description' required value={formData.description}  onChange={handleChange}/>
          <input type='text' placeholder='Address' className='border p-3 rounded-lg bg-slate-50' id='address'  required value={formData.address}  onChange={handleChange}/>
          <div className='font-semibold flex gap-6 flex-wrap'>
              <div className='flex gap-2'>
              <input type='checkbox' id='sale' className='w-5' checked={formData.type === "sale"}  onChange={handleChange}/>
              <span>Sell</span>
              </div>
              <div className='flex gap-2'>
              <input type='checkbox' id='rent' className='w-5' checked={formData.type === "rent"}  onChange={handleChange} />
              <span>Rent</span>
              </div>
              <div className='flex gap-2'>
              <input type='checkbox' id='parking' className='w-5' checked={formData.parking}  onChange={handleChange} />
              <span>Parking spot</span>
              </div>
              <div className='flex gap-2'>
              <input type='checkbox' id='furnished' className='w-5' checked={formData.furnished}  onChange={handleChange}/>
              <span>Furnished</span>
              </div>
              <div className='flex gap-2'>
              <input type='checkbox' id='offer' className='w-5' checked={formData.offer}  onChange={handleChange}/>
              <span>Offer</span>
              </div>
          </div>
          <div className='font-semibold flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input type='number' id='bedrooms' min="1" max="10" required className='p-3 border border-gray-300 bg-slate-50 rounded-lg' value={formData.bedrooms} onChange={handleChange}/>
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type='number' id='bathrooms' min="1" max="10" required className='p-3 border border-gray-300 bg-slate-50 rounded-lg' value={formData.bathrooms} onChange={handleChange} />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type='number' id='regularPrice' min="50" max="1000000" required className='p-3 border border-gray-300 bg-slate-50 rounded-lg' value={formData.regularPrice} onChange={handleChange}/>
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className='text-xs'>($ /month)</span>
              </div>
            </div>
            {formData.offer && (<div className='flex items-center gap-2'>
              <input type='number' id='discountPrice' min="0" max="1000000" required className='p-3 border border-gray-300 bg-slate-50 rounded-lg' value={formData.discountPrice} onChange={handleChange} />
              <div className="flex flex-col items-center">
               <p>Discounted price</p>
               <span className='text-xs'>($ /month)</span>
              </div>
            </div>)}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
        <p className='font-semibold'>Images :
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover</span>
        </p>
        <div className="flex gap-4">
          <input
            onChange={handleImageChange}
            className='p-3 border border-gray-300 rounded w-full'
            type='file'
            id='images'
            accept='image/*'
            multiple
            disabled={uploadingSuccess}
          />
          <button
            type='button'
            onClick={handleImageSubmit}
            className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            disabled={uploading || uploadingSuccess}
          >
            {uploading ? "...Uploading" : "Upload"}
          </button>
        </div>
        <p className='text-red-700 text-sm font-semibold'>{imageUploadError && imageUploadError}</p>
        {
          uploadingSuccess && <p className='text-green-700 text-sm font-semibold'>
          Images was saved successfuly
          <span className='text-yellow-300 text-xs font-semibold mx-3'>  (You can't cancel this opration)</span>
        </p>
        }
        
          {imagePreviews.map((preview, index) => (
            <div key={index} className='flex justify-between p-2 border items-center'>
              <img src={preview} alt={`preview-${index}`} className='w-40 h-40 object-contain rounded-lg' />
              <div className='flex items-center flex-col'>
                <p className='text-gray-600 text-xs mt-2'>
                  Size: {(files[index].size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <p className='text-gray-600 text-xs'>
                  File: {files[index].name.length > 15 ? files[index].name.substring(0, 15) + '...' + files[index].name.split('.').pop() : files[index].name}
                </p>
              </div>
              <button
                type='button'
                onClick={() => handleRemoveImage(index)}
                className='p-3 text-red-700 rounded-lg uppercase hover:opacity-90'
                disabled={uploading}
              >
                Delete
              </button>
            </div>
          ))}
          <button className='p-3 bg-stone-700 text-white uppercase rounded-lg hover:opacity-80 disabled:opacity-70' disabled={loading || uploading}>
            {
              loading ? "... Saving" : "Create Listing"
            }
          </button>
          { loadingError && <p className='text-red-700 text-sm font-semibold'>{errorMessage}</p> }
          { loadingSuccess && <p className='text-green-700 text-sm font-semibold'>Listing  saved successfuly</p>}
      </div>
      </form>
    </main>
  )
}
