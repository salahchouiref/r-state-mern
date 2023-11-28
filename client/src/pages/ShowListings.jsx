import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { deleteObject, getStorage , ref } from "firebase/storage";
import { app } from "../firebase";

export default function ShowListings() {
  const [error, setError] = useState(null);
  const [listings, setListings] = useState([]);
  const [filteredType, setFilteredType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage] = useState(3);
  const [loading, setLoading] = useState(true); // Added loading state
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    getListings();
  }, [filteredType, searchTerm, currentPage]);

  const getListings = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`, {
        method: "GET",
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
      } else {
        const filteredListings = data.filter((listing) => {
          if (filteredType === "all" || listing.type === filteredType) {
            return listing.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          }
          return false;
        });

        setListings(filteredListings);
        console.log(filteredListings);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = listings.slice(
    indexOfFirstListing,
    indexOfLastListing
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteImages = async (listingId) => {
    const storage = getStorage(app);
    await listings.find(e=>e._id===listingId).imageUrls.map((e)=>{
      const imageRef = ref(storage,e);
      deleteObject(imageRef).then(()=>{
        console.log(true);
      }).then((err)=>{
        console.log(err);
      })
    });
  }; 

  const handleDelete = async (listingId) => {
    // Show a confirmation dialog
    const { value } = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (value) {
      deleteImages(listingId);
      try {
        const res = await fetch(`/api/listing/delete/${listingId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        console.log(data);
        if (data.success === false) {
          return Swal.fire(
            "Error",
            "There was an error deleting your listing. Please try again.",
            "error"
          );
        }
        setListings((prevListings) =>
          prevListings.filter((listing) => listing._id !== listingId)
        );
        Swal.fire("Deleted!", "Your listing has been deleted.", "success"); 
        
      } catch (err) {
        Swal.fire(
          "Error",
          "There was an error deleting your listing. Please try again.",
          "error"
        );
      }
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="border px-4 py-2 rounded focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border px-4 py-2 rounded focus:outline-none"
            value={filteredType}
            onChange={(e) => setFilteredType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>
        
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Image</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {loading ? (
            <tr>
              <td colSpan="3" className="p-2 border text-center">
                Loading...
              </td>
            </tr>
          ) : currentListings.length > 0 ? (
            currentListings.reverse().map((listing) => (
              <tr key={listing.id}>
                <td className="p-3 border">
                  <Link className="hover:underline" to={`/listing/${listing._id}`}>{listing.name}</Link>
                </td>
                <td className="p-3 border">
                  <img
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                    className="w-40 h-30 mx-auto object-cover rounded"
                  />
                </td>
                <td className="p-3 border ">
                    <div className="flex items-center justify-center space-x-2">
                      <Link to={`/update-listing/${listing._id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:opacity-80">
                        Edit
                      </Link>
                      <button type="button" onClick={()=>handleDelete(listing._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:opacity-80">
                        Delete
                      </button>
                    </div>
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-2 border text-center">
                No listings to show.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {listings.length > listingsPerPage && (
        <div className="mt-4 flex justify-center">
          {Array.from({
            length: Math.ceil(listings.length / listingsPerPage),
          }).map((_, index) => (
            <button
              key={index + 1}
              className={`bg-gray-300 text-gray-600 px-4 py-2 hover:opacity-90 rounded mx-2 ${
                currentPage === index + 1 && "bg-gray-600 text-white"
              }`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
}
