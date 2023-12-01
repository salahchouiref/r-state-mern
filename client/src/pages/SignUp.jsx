import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formdata, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Frontend validation
    const validationErrors = {};
    if (!formdata.username || formdata.username.trim() === "") {
      validationErrors.username = "Username is required";
    }
    if (!formdata.email || formdata.email.trim() === "") {
      validationErrors.email = "Email is required";
    }
    if (!formdata.password || formdata.password.trim() === "") {
      validationErrors.password = "Password is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formdata.email || !emailRegex.test(formdata.email.trim())) {
      validationErrors.email = "Please enter a valid email address";
    }

    // Minimum length for username and password
    const minUsernameLength = 6;
    if (!formdata.username || formdata.username.trim().length < minUsernameLength) {
      validationErrors.username = `Username must be at least ${minUsernameLength} characters`;
    }

    const minPasswordLength = 6;
    if (!formdata.password || formdata.password.trim().length < minPasswordLength) {
      validationErrors.password = `Password must be at least ${minPasswordLength} characters`;
    }


    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setErrors({ server: "Something went wrong!" });
        return;
      }
      navigate("/sign-in");
    } catch (err) {
      setLoading(false);
      setErrors({ server: "Something went wrong!" });
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type="text"
          className={`bg-stone-200 p-3 rounded-lg ${errors.username ? "border-red-500" : ""}`}
          placeholder="username"
          id='username'
          onChange={handleChange}
        />
        {errors.username && (
          <p className="text-red-600 mt-1 text-sm">{errors.username}</p>
        )}
        <input
          type="email"
          className={`bg-stone-200 p-3 rounded-lg ${errors.email ? "border-red-500" : ""}`}
          placeholder="email"
          id='email'
          onChange={handleChange}
        />
        {errors.email && (
          <p className="text-red-600 mt-1 text-sm">{errors.email}</p>
        )}
        <input
          type="password"
          className={`bg-stone-200 p-3 rounded-lg ${errors.password ? "border-red-500" : ""}`}
          placeholder="password"
          id='password'
          onChange={handleChange}
        />
        {errors.password && (
          <p className="text-red-600 mt-1 text-sm">{errors.password}</p>
        )}
        <button
          disabled={loading ? true : false}
          className="bg-stone-900 text-white p-2 rounded-l uppercase hover:opacity-80"
        >
          {loading ? "Loading..." : "Sign up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-2 ">
        <p>Have an account</p>
        <Link to="/sign-in">
          <span className='text-blue-600'>Sign in</span>
        </Link>
      </div>
      {errors.server && (
        <p className="text-red-600 mt-3 text-sm">Something went wrong!</p>
      )}
    </div>
  );
}
