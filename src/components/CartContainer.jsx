import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'reactstrap'

import {
  Decrement,
  DeleteProduct,
  Increment,
} from '../app/CartHandler/CartSlice'
import { Icons } from '../common'

const CartContainer = ({ product }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation(['Products'])
  const { AI, MD } = Icons

  const deleteProduct = () => {
    dispatch(DeleteProduct(product))
  }
  return (
    <>
      <Row className='mt-4'>
        <Col sm={4} className='d-flex align-items-center'>
          <img src={product.imageUrl} style={{ width: '150px' }} alt='' />
        </Col>
        <Col sm={2} className='d-flex align-items-center'>
          <h5>{t(product.name)}</h5>
        </Col>
        <Col sm={2} className='d-flex align-items-center'>
          <h5>Rs{t(product.sellingPrice)}</h5>
        </Col>
        <Col sm={2} className='d-flex align-items-center'>
          <AI.AiOutlineMinus
            size={15}
            onClick={() => {
              dispatch(Decrement(product))
            }}
            style={{ cursor: 'pointer', marginRight: '10px' }}
          />
          <h5 className='border p-2'>{product.quantity}</h5>
          <AI.AiOutlinePlus
            size={15}
            onClick={() => {
              dispatch(Increment(product))
            }}
            style={{ marginLeft: '10px', cursor: 'pointer' }}
          />
        </Col>
        <Col sm={2} className='d-flex align-items-center'>
          <MD.MdOutlineDelete
            color='red'
            size={25}
            onClick={deleteProduct}
            style={{ cursor: 'pointer' }}
          />
        </Col>
      </Row>
    </>
  )
}
export default CartContainer
