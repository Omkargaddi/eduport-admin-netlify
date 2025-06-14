import { AppContext } from "../../context/AppContext";
import { useContext } from "react";
import { AlertHexaIcon, CheckCircleIcon } from "../../icons";


export default function UserInfoCard() {

  const {
      userData,
    } = useContext(AppContext);

    if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
               First Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userData.username?.split(" ")[0]?.charAt(0).toUpperCase() + userData.username?.split(" ")[0]?.slice(1).toLowerCase() }
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Last Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
               {userData.username?.split(" ")[1]?.charAt(0).toUpperCase() + userData.username?.split(" ")[1]?.slice(1).toLowerCase()}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
               {userData.email}
              </p>
             {userData.authenticated ? (
<span className="relative group text-xs font-medium text-green-500 dark:text-green-400">
  <CheckCircleIcon className="inline-block w-5 h-5 mr-1 cursor-pointer" />
  <div
    id="tooltip-top"
    className="absolute left-1/2 bottom-full mb-2 z-10 hidden w-max -translate-x-1/2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-xs group-hover:block dark:bg-gray-800 dark:text-white"
  >
    Email verified
  </div>
</span>
              ) : (
               <span className="relative group text-xs font-medium text-green-500 dark:text-green-400">
  <AlertHexaIcon className="inline-block w-5 h-5 mr-1 cursor-pointer" />
  <div
    id="tooltip-top"
    className="absolute left-1/2 bottom-full mb-2 z-10 hidden w-max -translate-x-1/2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-xs group-hover:block dark:bg-gray-800 dark:text-white"
  >
    Email Not Verified
  </div>
</span>
              )}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Bio
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                Admin
              </p>
            </div>
          </div>
        </div>

       
      </div>

      
    </div>
  );
}
