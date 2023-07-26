import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CalendarDaysIcon } from "@heroicons/react/20/solid";

export default function Register({ setAppState }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    date: "",
    password: "",
    confirmPassword: "",
    school: "",
    photo: null,
    agreeToTerms: false,
  });

  const handleOnInputChange = (event) => {
    if (event.target.name === "password") {
      if (form.confirmPassword && form.confirmPassword !== event.target.value) {
        setErrors((e) => ({ ...e, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors((e) => ({ ...e, confirmPassword: null }));
      }
    }
    if (event.target.name === "confirmPassword") {
      if (form.password && form.password !== event.target.value) {
        setErrors((e) => ({ ...e, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors((e) => ({ ...e, confirmPassword: null }));
      }
    }
    if (event.target.name === "email") {
      if (event.target.value.indexOf("@") === -1) {
        setErrors((e) => ({ ...e, email: "Please enter a valid email." }));
      } else {
        setErrors((e) => ({ ...e, email: null }));
      }
    }

    // Additional handling for school and photo fields
    if (event.target.name === "school") {
      setForm((f) => ({ ...f, school: event.target.value }));
    }
    if (event.target.name === "photo") {
      setForm((f) => ({ ...f, photo: event.target.files[0] }));
    }

    setForm((f) => ({ ...f, [event.target.name]: event.target.value }));
  };

  const handleOnSubmit = async () => {
    setIsLoading(true);
    setErrors((e) => ({ ...e, form: null }));

    if (form.confirmPassword !== form.password) {
      setErrors((e) => ({ ...e, confirmPassword: "Passwords do not match." }));
      setIsLoading(false);
      return;
    } else {
      setErrors((e) => ({ ...e, confirmPassword: null }));
    }

    // Here would be the axios.post() request to submit the form data to the server
    // The response would be used to handle the user registration and redirection

    setIsLoading(false);
    navigate("/portal");
  };

  return (
    <div className="h-full bg-white">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link to="/">
            {" "}
            {/* Use Link to navigate to the home page */}
            <CalendarDaysIcon className="mx-auto h-10 w-auto text-indigo-600" />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-indigo-600">
              Register for Course Flow
            </h2>
          </Link>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6">
            <div className="split-inputs">
              <div className="input-field">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Jane"
                    value={form.firstName}
                    onChange={handleOnInputChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {errors.firstName && (
                  <span className="block text-sm text-red-600 mt-1">
                    {errors.firstName}
                  </span>
                )}
              </div>
              <div className="input-field">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Last Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={handleOnInputChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {errors.lastName && (
                  <span className="block text-sm text-red-600 mt-1">
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

            <div className="input-field">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  placeholder="jane@doe.io"
                  value={form.email}
                  onChange={handleOnInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.email && (
                <span className="block text-sm text-red-600 mt-1">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="input-field">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleOnInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.password && (
                <span className="block text-sm text-red-600 mt-1">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="input-field">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleOnInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {errors.confirmPassword && (
                <span className="block text-sm text-red-600 mt-1">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* New input field for school */}
            <div className="input-field">
              <label
                htmlFor="school"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                School
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="school"
                  placeholder="Enter your school"
                  value={form.school}
                  onChange={handleOnInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {/* Add error handling for school if needed */}
            </div>

            {/* New input field for photo */}
            <div className="input-field">
              <label
                htmlFor="photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Photo
              </label>
              <div className="mt-2">
                <label
                  htmlFor="photo"
                  className="cursor-pointer bg-indigo-600 rounded-md py-1.5 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Choose file
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handleOnInputChange}
                  className="sr-only"
                />
              </div>
              {/* Add error handling for photo if needed */}
            </div>

            <div className="input-field">
              <button
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={isLoading}
                onClick={handleOnSubmit}
              >
                {isLoading ? "Loading..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="footer">
            <p className="mt-10 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
