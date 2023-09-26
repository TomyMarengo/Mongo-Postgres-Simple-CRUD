import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import EntityPage from './pages/EntityPage'
import IndexPage from './pages/IndexPage'
import { clientFields, productFields } from './utils/fields'

import 'bootstrap/dist/css/bootstrap.min.css'

import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'



export default function App () {
  return (
    <Router>
      <Navbar expand='lg' className='bg-primary'>
        <Container>
          <Navbar.Brand href='/' className='text-white'>
            BD2 - TPO
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
              <Nav.Link href='/' className='text-white'>
                {' '}
                Home{' '}
              </Nav.Link>
              <Nav.Link href='clients' className='text-white'>
                {' '}
                Clients{' '}
              </Nav.Link>
              <Nav.Link href='products' className='text-white'>
                {' '}
                Products{' '}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Routes>
        <Route path='/' element={<IndexPage />} />
        <Route path='/clients' element={<EntityPage entityName='Client' entityFields={clientFields} entityEndpoint='http://localhost:3000/clients' />} />
        <Route path='/products' element={<EntityPage entityName='Product' entityFields={productFields} entityEndpoint='http://localhost:3000/products' />} />
      </Routes>
    </Router>
  )
}
