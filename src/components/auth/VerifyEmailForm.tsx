import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

export default function VerifyEmailForm() {
     const inputRef = useRef<(HTMLInputElement | null)[]>([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
   const [isLoading2, setIsLoading2] = useState(false);
    const { backendUrl, getUserData , userData , setUserData } = useContext(AppContext);

  const handlePaste = (e: {
    preventDefault: () => void;
    clipboardData: { getData: (arg0: string) => string };
  }) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");

    pasteData.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
      }
      });
    };
  
      // OTP verification
      const handleVerify = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsLoading(true);
        const otp = inputRef.current
          .filter((input) => input !== null)
          .map((input) => input.value)
          .join("");
      
        if (otp.length !== 6) {
          toast.error("Please enter a valid OTP");
          return;
        }
        try {
          await axios.post(
            `${backendUrl}/verify-email`,
            { email: userData.email, otp },
            { withCredentials: true }
          );
          toast.success("Email verified successfully");
          navigate("/");
          const data = await getUserData();
          setUserData(data);
        } catch (error) {
          console.log(error);
          let errorMessage = "An error occurred while verifying the OTP";
          if (axios.isAxiosError(error) && error.response) {
            errorMessage = error.response.data || errorMessage;
          }
          toast.error(errorMessage);
        }finally{
          setIsLoading(false);
        }
      };
    
    
      // Resend OTP
      const handleResend = async () => {
        setIsLoading2(true);
        try {
          if(userData.authenticated) {
            toast.error("Admin already registred");
            navigate('/');
            return;
          }
          await axios.post(
            `${backendUrl}/verify-email-otp`,
            { email: userData.email },
            { withCredentials: true }
          );
          toast.success("OTP resent successfully");
        } catch (error) {
          toast.error("Failed to resend OTP");
        } finally{
          setIsLoading2(false)
        }
      };



  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Verify Email
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please Enter the OTP Sent to Your Email
            </p>
          </div>
          <div>
             <form onSubmit={handleVerify}>
                <div className="space-y-6">
                  <div>
                    <Label>
                      OTP <span className="text-error-500">*</span>{" "}
                    </Label>
                    <div className="flex justify-center gap-2 mb-4">
                      {[...Array(6)].map((_, index) => (
                        <input
                          key={index}
                          type="number"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          ref={(el) => {
                            inputRef.current[index] = el;
                          }}
                          onChange={(e) => {
                            if (e.target.value.length === 1 && index < 5) {
                              inputRef.current[index + 1]?.focus();
                            } else if (
                              e.target.value.length === 0 &&
                              index > 0
                            ) {
                              inputRef.current[index - 1]?.focus();
                            }
                          }}
                          onPaste={handlePaste}
                          className="w-11 h-14 text-xl font-semibold text-center border rounded-lg outline-none bg-white text-gray-800 border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:border-brand-400 dark:focus:ring-brand-300 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Button className="w-full" size="sm" type="submit" disabled={isLoading}>
                      {isLoading && (
                        <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
</svg>
                      )}
                      {isLoading ? "Processing..." : " Verify OTP"}
                    </Button>
                  </div>
                </div>
              </form>

           <div className="mt-5">
  <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
    Didn’t get the code?{" "}
    <button
      onClick={handleResend}
      type="button"
      className="ml-1 text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-medium transition-colors"
      disabled={isLoading2}
    >
      {isLoading2 ? "Resending..." : "Resend OTP"}
    </button>
  </p>
</div>

          </div>
        </div>
      </div>
    </div>
  );
}
