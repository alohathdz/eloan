import React from "react"
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Navbar, Container, Row, Col } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import CreateMember from './components/CreateMember'
import ShowMember from "./components/ShowMember"
import EditMember from "./components/EditMember"
import DetailLoan from "./components/DetailLoan"
import CreateLoan from "./components/CreateLoan"
import EditLoan from "./components/EditLoan"
import PayLoan from "./components/PayLoan"

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
              <Route exact path="/" element={<ShowMember />} />
              <Route path="/member" element={<ShowMember />} />
              <Route path="/member/create" element={<CreateMember />} />
              <Route path="/member/edit/:id" element={<EditMember />} />
              <Route path="/member/loan/:id" element={<DetailLoan />} />
              <Route path="/member/loan/create/:id" element={<CreateLoan />} />
              <Route path="/loan/edit/:id" element={<EditLoan />} />
              <Route path="/loan/pay/:id" element={<PayLoan />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  )
}

export default App
