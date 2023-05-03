import NavBar from '../components/NavBar'
import Logo from '../components/logo'
import GradientLayout from '../layouts/GradientLayout'
import { PAGES } from '../utils/constants'

export default function LoginPage({ currPage, setCurrPage }) {
  const pageVisible = currPage === PAGES.LOGIN
  return (
    pageVisible && (
      <GradientLayout visible={pageVisible}>
        <div className="flex flex-col island">
          
        </div>
      </GradientLayout>
    )
  )
}
