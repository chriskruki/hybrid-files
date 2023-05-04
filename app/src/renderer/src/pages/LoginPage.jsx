import { useState } from 'react'
import { PAGES } from '../utils/constants'

export default function LoginPage({ currPage, setCurrPage }) {
  const pageVisible = currPage === PAGES.LOGIN
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: ''
  })
  const updateUserInfo = (key, val) => {
    if (!(key in userInfo)) {
      console.error(`Key [${key}] error in userInfo update`)
    }
    setUserInfo((prev) => {
      return {
        ...prev,
        [key]: val
      }
    })
  }
  const [resMsg, setResMsg] = useState('')
  const onLogin = async (e) => {
    e.preventDefault()
    const payload = {
      username: userInfo.username,
      password: userInfo.password
    }
    window.api
      .sqlBridge('validateUser', payload)
      .then((res) => {
        if (res.success) {
          setCurrPage(PAGES.LOGIN)
          setResMsg('Login Success')
        } else {
          setResMsg('Login Failed')
        }
      })
      .catch((reason) => {
        setResMsg(reason)
      })
  }
  return (
    pageVisible && (
      <div className="flex flex-col w-full h-full justify-center items-center">
        <div className="island justify-center items-center">
          <form className="space-y-4 md:space-y-6" action="#" onSubmit={onLogin}>
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="skrillexlover"
                required=""
                value={userInfo.username}
                onChange={(e) => {
                  updateUserInfo('username', e.target.value)
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
                placeholder="bangarang"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
                value={userInfo.password}
                onChange={(e) => {
                  updateUserInfo('password', e.target.value)
                }}
              />
            </div>
            {/* Submit */}
            <button
              type="submit"
              className="w-full text-white text-sm text-center bg-sky-600 hover:bg-sky-700 font-medium rounded-lg px-5 py-2.5 transition-all"
            >
              Sign in
            </button>
            <p className="text-sm text-center text-red-500">{resMsg}</p>
            <p className="text-sm text-center font-light text-gray-500 m-1 ">
              No account? Ask daddy admin
            </p>
          </form>
          {`${userInfo.username} ${userInfo.password}`}
        </div>
      </div>
    )
  )
}
