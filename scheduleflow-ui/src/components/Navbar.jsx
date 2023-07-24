import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
  CursorArrowRippleIcon,
  ShareIcon,
  CalendarDaysIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const navigation = [
  { name: "Course Flow", href: "#home", current: true },
  { name: "Plan Schedule", href: "#plan-schedule", current: false },
  { name: "About Us", href: "#about-us", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  // return (
  //   <Disclosure as="nav" className="bg-gray-800">
  //     {({ open }) => (
  //       <>
  //         <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
  //           <div className="relative flex h-16 items-center justify-between">
  //             <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
  //               {/* Mobile menu button*/}
  //               <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
  //                 <span className="sr-only">Open main menu</span>
  //                 {open ? (
  //                   <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
  //                 ) : (
  //                   <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
  //                 )}
  //               </Disclosure.Button>
  //             </div>
  //             <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
  //               <div className="flex flex-shrink-0 items-center">
  //                 <img
  //                   className="h-8 w-auto"
  //                   src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
  //                   alt="Your Company"
  //                 />
  //               </div>
  //               <div className="hidden sm:ml-6 sm:block">
  //                 <div className="flex space-x-4">
  //                   {navigation.map((item) => (
  //                     <a
  //                       key={item.name}
  //                       href={item.href}
  //                       className={classNames(
  //                         item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
  //                         'rounded-md px-3 py-2 text-sm font-medium'
  //                       )}
  //                       aria-current={item.current ? 'page' : undefined}
  //                     >
  //                       {item.name}
  //                     </a>
  //                   ))}
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
  //               <button
  //                 type="button"
  //                 className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
  //               >
  //                 <span className="sr-only">View notifications</span>
  //                 <BellIcon className="h-6 w-6" aria-hidden="true" />
  //               </button>

  //               {/* Profile dropdown */}
  //               <Menu as="div" className="relative ml-3">
  //                 <div>
  //                   <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
  //                     <span className="sr-only">Open user menu</span>
  //                     <img
  //                       className="h-8 w-8 rounded-full"
  //                       src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  //                       alt=""
  //                     />
  //                   </Menu.Button>
  //                 </div>
  //                 <Transition
  //                   as={Fragment}
  //                   enter="transition ease-out duration-100"
  //                   enterFrom="transform opacity-0 scale-95"
  //                   enterTo="transform opacity-100 scale-100"
  //                   leave="transition ease-in duration-75"
  //                   leaveFrom="transform opacity-100 scale-100"
  //                   leaveTo="transform opacity-0 scale-95"
  //                 >
  //                   <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
  //                     <Menu.Item>
  //                       {({ active }) => (
  //                         <a
  //                           href="#"
  //                           className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
  //                         >
  //                           Your Profile
  //                         </a>
  //                       )}
  //                     </Menu.Item>
  //                     <Menu.Item>
  //                       {({ active }) => (
  //                         <a
  //                           href="#"
  //                           className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
  //                         >
  //                           Settings
  //                         </a>
  //                       )}
  //                     </Menu.Item>
  //                     <Menu.Item>
  //                       {({ active }) => (
  //                         <a
  //                           href="#"
  //                           className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
  //                         >
  //                           Sign out
  //                         </a>
  //                       )}
  //                     </Menu.Item>
  //                   </Menu.Items>
  //                 </Transition>
  //               </Menu>
  //             </div>
  //           </div>
  //         </div>

  //         <Disclosure.Panel className="sm:hidden">
  //           <div className="space-y-1 px-2 pb-3 pt-2">
  //             {navigation.map((item) => (
  //               <Disclosure.Button
  //                 key={item.name}
  //                 as="a"
  //                 href={item.href}
  //                 className={classNames(
  //                   item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
  //                   'block rounded-md px-3 py-2 text-base font-medium'
  //                 )}
  //                 aria-current={item.current ? 'page' : undefined}
  //               >
  //                 {item.name}
  //               </Disclosure.Button>
  //             ))}
  //           </div>
  //         </Disclosure.Panel>
  //       </>
  //     )}
  //   </Disclosure>
  // )

  return (
    <header className="absolute inset-x-0 top-0 z-50 h-16">
      <nav
        className="flex items-center justify-between lg:px-24 h-full w-full"
        aria-label="Global"
      >
        <div className="logo flex items-center lg:flex-1 h-full">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Course Flow</span>
            <CalendarDaysIcon className="mx-auto h-10 w-auto text-indigo-600" />
          </a>
        </div>
        <div className="hidden lg:flex lg:gap-x-12 text-white h-full items-center">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={"font-semibold leading-6"}
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="auth-div hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-12 text-white h-2/3 items-center">
          <Link to="/login" className="login-btn bg-indigo-600 font-semibold leading-6 h-5/6 flex items-center justify-center w-1/6 min-w-[7rem] rounded-md">
           Log in
          </Link>
          <Link to="/signup" className="signup-btn font-semibold leading-6 border-2 h-5/6 flex items-center justify-center w-1/6 min-w-[7rem] rounded-md border-indigo-600">
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
