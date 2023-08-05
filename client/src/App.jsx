import React from "react"
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Navbar, Container, Row, Col } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import CreateMember from './components/member/CreateMember'
import ShowMember from "./components/member/ShowMember"

function App() {

  return (
    <Router>
      <Navbar bg="primary">
        <Container>
          <Link to={"/"} className="navbar-brand text-white">
            Loan Management System
          </Link>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <Row>
          <Col md="12">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/member" element={<ShowMember />} />
              <Route path="/member/create" element={<CreateMember />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  )
}

export default App
