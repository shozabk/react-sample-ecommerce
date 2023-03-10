import { useEffect, useState } from 'react'
import {
  Button,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarText,
  NavbarToggler,
  NavItem,
  UncontrolledDropdown,
} from 'reactstrap'

import i18next from 'i18next'
import { debounce } from 'lodash'
import { useTranslation } from 'react-i18next'
import NotificationBadge from 'react-notification-badge'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useToken from '../hooks/useToken'

import FrenchFlag from '../assets/french-flag.svg'
import Amazonlogo from '../assets/logo.png'
import UsaFlag from '../assets/usa-flag.svg'
import { Icons } from '../common'
import NavRoutes from '../common/NavRoutes'
import { ACNetwork, config, Urls } from '../config'
import Chat from '../Pages/Chat'
import ChatList from '../Pages/Chat/ChatList'
import '../styles/Header.css'

const Header = () => {
  const { AI, GI } = Icons
  const cartCount = useSelector((state) => state.cart.cartProducts)
  const { Logout, token, currentUser } = useToken()
  let navigate = useNavigate()
  let location = useLocation()
  const [open, setOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [currentChat, setCurrentChat] = useState({})
  const [query, setQuery] = useState('')
  const [searchedData, setSearchedData] = useState([])
  const handleNavbar = () => {}
  useEffect(() => {
    if (localStorage.getItem('i8nextLng')?.length > 2) {
      i18next.changeLanguage('en')
    }
  }, [])

  const handleLanguage = (e) => {
    i18next.changeLanguage(e.target.value)
    window.location.reload()
  }
  const handleLogout = () => {
    Logout()
    navigate(NavRoutes.Login)
  }

  const handleQuery = debounce(async (text) => {
    setQuery(text)
    const obj = {
      productName: text,
    }
    const response = await ACNetwork.post(
      Urls.productsearch(i18next.language),
      obj,
      (
        await config()
      ).headers
    )

    setSearchedData(response.data.products)
  }, 1000)

  const handleNavigation = (product_id) => {
    setQuery('')
    navigate(NavRoutes.ProductDetail, { state: { id: product_id } })
  }

  const OpenChats = () => {
    setOpen(!open)
  }

  const { t } = useTranslation(['Categories'])

  if (
    location.pathname.includes(NavRoutes.Login) ||
    location.pathname.includes(NavRoutes.Signup)
  )
    return null

  return (
    <>
      <ChatList
        open={open}
        setOpen={setOpen}
        setShowModal={setShowModal}
        showModal={showModal}
        setCurrentChat={setCurrentChat}
      />
      {!open ? (
        <Chat
          shopId={currentChat?.shop}
          Header='Chat'
          conversationId={currentChat.conversation?._id}
          open={showModal}
          setOpen={setShowModal}
        />
      ) : null}
      <div className='AppBar'>
        <Navbar
          style={{ backgroundColor: '#131921', color: 'white' }}
          expand='lg'
        >
          <NavbarBrand href='/'>
            <img src={Amazonlogo} alt='Amazon-Logo' width='150px' />
          </NavbarBrand>
          <NavbarToggler
            onClick={() => handleNavbar()}
            style={{ color: 'white' }}
          >
            <GI.GiHamburgerMenu size={40} />
          </NavbarToggler>
          <Collapse navbar>
            <Nav className='m-auto' navbar>
              <NavItem>
                <div className='d-flex flex-row'>
                  <Input
                    placeholder='Search'
                    onChange={(e) => handleQuery(e.target.value)}
                    className='Search-Box'
                  />
                  <button className='Search-Btn'>
                    <AI.AiOutlineSearch size='25px' />
                  </button>
                </div>
                {query && (
                  <div
                    className='search-results'
                    style={{ backgroundColor: 'white' }}
                  >
                    {searchedData?.length != 0 ? (
                      <>
                        {searchedData?.map((product) => {
                          return (
                            <div
                              className='ps-3 m-2 searched-item'
                              style={{
                                backgroundColor: 'white',
                                color: 'black',
                              }}
                              onClick={() => handleNavigation(product._id)}
                            >
                              {product?.name}
                            </div>
                          )
                        })}
                      </>
                    ) : (
                      <div
                        className='ps-3 m-2 searched-item'
                        style={{
                          backgroundColor: 'white',
                          color: 'black',
                          textAlign: 'center',
                        }}
                      >
                        No data Found
                      </div>
                    )}
                  </div>
                )}
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret style={{ color: 'white' }}>
                  {i18next.language == 'en-US' ? (
                    <img src={UsaFlag} width='30px' height='25px' />
                  ) : (
                    <img src={FrenchFlag} width='30px' height='25px' />
                  )}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem
                    value='en-US'
                    onClick={(e) => handleLanguage(e)}
                  >
                    English
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem value='fr' onClick={(e) => handleLanguage(e)}>
                    French
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
            <NavbarText className='me-3'>
              {/* <Badge color='warning'>{cartCount?.length}</Badge> */}
              <Link to={NavRoutes.CartPage}>
                <div>
                  <NotificationBadge count={cartCount?.length} />
                  <AI.AiOutlineShoppingCart size='2em' color='white' />
                </div>
              </Link>
            </NavbarText>
            {token ? (
              <UncontrolledDropdown>
                <DropdownToggle
                  caret
                  style={{ backgroundColor: 'transparent', border: 0 }}
                >
                  <img
                    src={
                      currentUser.image
                        ? currentUser.image
                        : 'https://mdbcdn.b-cdn.net/img/new/avatars/1.webp'
                    }
                    className='rounded-circle shadow-4'
                    style={{ objectFit: 'cover' }}
                    width='50px'
                    height='50px'
                    alt='Avatar'
                  />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={() => navigate(NavRoutes.profile)}>
                    {t('profile')}
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => navigate(NavRoutes.myOrder)}>
                    Order
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => navigate(NavRoutes.myCards)}>
                    Cards
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => OpenChats()}>Chats</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => navigate(NavRoutes.address)}>
                    Addresses
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={() => handleLogout()}>
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            ) : (
              <NavbarText>
                <Button
                  color='warning'
                  onClick={() => navigate(NavRoutes.Login)}
                >
                  Login
                </Button>
              </NavbarText>
            )}
          </Collapse>
        </Navbar>
      </div>
    </>
  )
}

export default Header
