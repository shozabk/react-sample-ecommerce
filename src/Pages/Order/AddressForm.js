import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { Button, Col, Container, Input, Label, Row } from 'reactstrap'
import { ACNetwork, config, Urls } from '../../config'
import '../../styles/CartPage.css'
const initialValues = {
  area: '',
  houseNumber: '',
  streetNumber: '',
}

const AddressForm = ({ setAddress, setOpen, addressList }) => {
  const [countries, setCountries] = useState()
  const [states, setStates] = useState()
  const [cities, setCities] = useState()
  const [loading, setLoading] = useState(true)
  const [countryCode, setCountryCode] = useState()
  const [stateCode, setStateCode] = useState()
  const [city, setCity] = useState()
  useEffect(() => {
    getCountries()
  }, [])
  const getCountries = async () => {
    setLoading(true)
    const response = await ACNetwork.get(
      Urls.getCountries,
      (
        await config()
      ).headers
    )
    const newarray = response.data.countries.map((element) => {
      return {
        label: element.name,
        value: element.countryCode,
      }
    })
    setCountries(newarray)
    setLoading(false)
  }

  const getStates = async (obj) => {
    setLoading(true)
    setCountryCode(obj)
    const response = await ACNetwork.get(
      Urls.getStates + obj.value,
      (
        await config()
      ).headers
    )

    const newarray = response.data.states.map((element) => {
      return {
        label: element.name,
        value: element.stateCode,
      }
    })
    setStates(newarray)
    setLoading(false)
  }

  const getCities = async (obj) => {
    setLoading(true)
    setStateCode(obj)
    const response = await ACNetwork.get(
      Urls.getCities + countryCode.value + '/' + obj.value,
      (
        await config()
      ).headers
    )
    const newarray = response.data.cities.map((element) => {
      return {
        label: element.name,
        value: element.name,
      }
    })
    setCities(newarray)
    setLoading(false)
  }
  const onSubmit = async (value) => {
    const obj = {
      ...value,
      country: countryCode.label,
      state: stateCode.label,
      city: city.label,
    }

    const response = await ACNetwork.post(
      Urls.addNewAddress,
      obj,
      (
        await config()
      ).headers
    )
    console.log(response)
    setAddress([...addressList, response.data.address])
    toast.success('Added', {
      position: toast.POSITION.TOP_RIGHT,
    })
    setOpen(false)
  }
  const { values, handleChange, handleSubmit, errors } = useFormik({
    initialValues,
    onSubmit,
  })

  return (
    <Container className='p-5'>
      <Row>
        <Col lg={12} sm={12}>
          <Label>Country/Region</Label>
          <Select
            options={countries}
            isDisabled={loading}
            onChange={(obj) => getStates(obj)}
          />
        </Col>
        <Col lg={12} sm={12} className='mt-3'>
          <Label>State</Label>

          <Select
            options={states}
            isDisabled={loading}
            onChange={(obj) => getCities(obj)}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12} sm={12} className='mt-3'>
          <Label>City</Label>
          <Select options={cities} isDisabled={loading} onChange={setCity} />
        </Col>
        <Col lg={12} sm={12} className='mt-3'>
          <Label>Area</Label>
          <Input
            name='area'
            placeholder='Area ex:Shahdrah'
            onChange={handleChange}
            value={values.area}
          />
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col lg={12} sm={12}>
          <Label>Street No#</Label>
          <Input
            name='streetNumber'
            placeholder='#'
            onChange={handleChange}
            value={values.streetNumber}
          />
        </Col>
        <Col lg={12} sm={12} className='mt-3'>
          <Label>House No#</Label>
          <Input
            name='houseNumber'
            placeholder='#'
            onChange={handleChange}
            valid={values.houseNumber}
          />
        </Col>
      </Row>
      <div className='d-flex justify-content-center align-items-center mt-5'>
        <Button className='amazon-btn' onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </Container>
  )
}

export default AddressForm
