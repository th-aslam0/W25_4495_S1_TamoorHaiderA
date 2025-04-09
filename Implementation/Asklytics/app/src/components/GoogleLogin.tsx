import { GoogleLoginPropsType } from "@/lib/types";

export default function GoogleLogin({ googleLogin }: GoogleLoginPropsType) {
  return (<div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="flex flex-col items-center gap-6 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800">Login to Asklytics</h1>
      <button
        onClick={() => googleLogin()}
        className="flex items-center gap-3 bg-white text-gray-700 border border-gray-300 rounded-lg px-4 py-2 shadow hover:shadow-md transition duration-200"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          className="w-5 h-5"
        />
        <span className="text-sm font-medium">Sign in with Google</span>
      </button>
    </div>
  </div>)
}