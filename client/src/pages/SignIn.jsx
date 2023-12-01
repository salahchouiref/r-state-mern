import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { signInStart,signInFailed } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import {setUserWithTimer} from "../redux/store";


export default function SignIn() {
  const user = useSelector(state=>state.user);
  const [formdata, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Frontend validation
    const validationErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formdata.email || !emailRegex.test(formdata.email.trim())) {
      validationErrors.email = "Please enter the email address";
    }

    // Minimum length for password
    if (!formdata.password || formdata.password.trim().length < 6) {
      validationErrors.password = `Password is too short!`;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    dispatch(signInStart());
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setErrors({ server: data.message });
        dispatch(signInFailed(data.message));
        return;
      }
      setUserWithTimer(data);
      navigate("/profile");
    } catch (err) {
      setLoading(false);
      setErrors({ server: err.message });
      dispatch(signInFailed(err.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* Remove the username input field */}
        <input
          type="email"
          className={`bg-stone-200 p-3 rounded-lg ${errors.email ? "border-red-500" : ""}`}
          placeholder="email"
          id='email'
          onChange={handleChange}
        />
        {errors.email  && (
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
          {(loading || user.loading) ? "Loading..." : "Sign in"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-2 ">
        <p>You don't have an account?</p>
        <Link to="/sign-up">
          <span className='text-blue-600'>Sign up</span>
        </Link>
      </div>
      {(errors.server || user.error) && (
        <p className="text-red-600 mt-3 text-sm">{errors.server || user.error}</p>
      )}
    </div>
  );
}
