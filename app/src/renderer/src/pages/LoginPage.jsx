import { useState } from 'react'
import { PAGES } from '../utils/constants'

export default function LoginPage({ currPage, setCurrPage }) {
  const pageVisible = currPage === PAGES.LOGIN
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginPage, setLoginPage] = useState("login")
  const onLogin = async (e) => {
    e.preventDefault()
    const payload = {
      username: username,
      password: password
    }
    const res = await window.api.sqlBridge('validateUser', payload)
    console.log(`Response: ${JSON.stringify(res)}`)
  }
  return (
    pageVisible && (
      <div className="flex flex-col w-full h-full justify-center items-center">
        <div className="island justify-center items-center">
          <form className="space-y-4 md:space-y-6" action="#" onSubmit={onLogin}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required=""
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                }}
              />
            </div>
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
            </div>
            {/* Submit */}
            <button
              type="submit"
              className="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800 transition-all"
            >
              Sign in
            </button>
            {/* Create account */}
            <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
              No account?{' '}
              <a href="#" className="font-medium text-sky-600 hover:underline dark:text-sky-500">
                Sign up
              </a>
            </p>
          </form>
          {`${username} ${password}`}
        </div>
      </div>
    )
  )
}
