import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import EntityPage from './pages/EntityPage'
import IndexPage from './pages/IndexPage'
import ViewsPage from './pages/ViewsPage'
import QueriesPage from './pages/QueriesPage'
import { clientFields, productFields } from './utils/fields'

import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

export default function App () {
  const [selectedDB, setSelectedDB] = useState('postgres')
  const toggleDB = () => {
    setSelectedDB(selectedDB === 'postgres' ? 'mongo' : 'postgres')
  }

  return (
    <Router>
      <Navbar expand='lg' className='bg-primary'>
        <Container>
          <Navbar.Brand href='/' className='text-white'>
            BD2 - TPO
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='w-100 d-flex justify-content-between'>
              <div className='d-flex '>
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
                <Nav.Link href='views' className='text-white'>
                  {' '}
                  Views{' '}
                </Nav.Link>
                <Nav.Link href='queries' className='text-white'>
                  {' '}
                  Queries{' '}
                </Nav.Link>
              </div>
              <Nav.Link href='#' className='text-white' onClick={toggleDB}>
                Change to {selectedDB === 'postgres' ? 'MongoDB' : 'PostgreSQL'}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Routes>
        <Route path='/' element={<IndexPage />} />
        <Route
          path='/clients'
          element={
            <EntityPage
              entityName='Client'
              entityFields={clientFields}
              endpoint={`http://localhost:3000/${selectedDB}/clients`}
            />
          }
        />
        <Route
          path='/products'
          element={
            <EntityPage
              entityName='Product'
              entityFields={productFields}
              endpoint={`http://localhost:3000/${selectedDB}/products`}
            />
          }
        />
        <Route
          path='/views'
          element={
            <ViewsPage endpoint={`http://localhost:3000/${selectedDB}/views`} />
          }
        />
        <Route
          path='/queries'
          element={
            <QueriesPage
              endpoint={`http://localhost:3000/${selectedDB}/queries`}
            />
          }
        />
      </Routes>
    </Router>
  )
}
