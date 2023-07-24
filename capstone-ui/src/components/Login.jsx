import { CalendarDaysIcon} from '@heroicons/react/20/solid';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Login({ setAppState }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleOnInputChange = (event) => {
    if (event.target.name === "email") {
      if (event.target.value.indexOf("@") === -1) {
        setErrors((e) => ({ ...e, email: "Please enter a valid email." }));
      } else {
        setErrors((e) => ({ ...e, email: null }));
      }
    }

    setForm((f) => ({ ...f, [event.target.name]: event.target.value }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors((e) => ({ ...e, form: null }));

    // Your axios login code here...

    // Just a mock response here for demonstration purposes
    setTimeout(() => {
      setIsLoading(false);
      navigate("/portal");
    }, 2000);
  };

  return (
    <div className="h-full bg-white">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link to="/"> {/* Use Link to navigate to the home page */}
            <CalendarDaysIcon className="mx-auto h-10 w-auto text-indigo-600" />
    
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-indigo-600">
            Sign in to your account
          </h2>
          </Link>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleOnSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="user@gmail.com"
                  value={form.email}
                  onChange={handleOnInputChange}
                />
              </div>
              {errors.email && <span className="block text-sm text-red-600 mt-1">{errors.email}</span>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleOnInputChange}
                />
              </div>
              {errors.password && <span className="block text-sm text-red-600 mt-1">{errors.password}</span>}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLoading ? "Loading..." : "Sign in"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an accout?{' '}
            <a href="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Get Started
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
