import React from 'react'

import Container from 'react-bootstrap/Container'

export default function IndexPage () {
  return (
    <Container
      className='d-flex align-items-center'
      style={{ minHeight: 'calc(100vh - 56px)' }}
    >
      <div className='m-auto text-center'>
        <h1 className='mb-5'>Welcome</h1>

        <p className='lead'>
          <strong>
            This is a simple application that allows you to manage clients and
            products.
          </strong>
        </p>
        <p className='lead'>
          <strong>
            Also, you can fetch for a view of invoices ordered by date, and a
            view of products that have not been invoiced.
          </strong>
        </p>
        <p className='lead'>
          <strong>
            And last but not least, you can test some queries in PostgreSQL and
            MongoDB.
          </strong>
        </p>
      </div>
    </Container>
  )
}
