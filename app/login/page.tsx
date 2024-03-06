import Link from "next/link";

export default function Login() {
  return (
    <div className="bg-white p-8 w-full">
      <h1 className="text-2xl mb-8 text-center">
        Oral Proficiency Interview - computer (OPIc : UAT)
      </h1>
      <div className="LoginForm flex flex-col justify-center items-center">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-orange-200 focus:shadow-outline"
            id="username"
            type="text"
            placeholder="en-demo"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-orange-200 focus:shadow-outline"
            id="password"
            type="password"
            placeholder="••••••••"
          />
        </div>
        <div>
          <Link
            href="/welcome"
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
