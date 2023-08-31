import React from "react"
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Navbar, Container, Row, Col } from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import CreateMember from './components/CreateMember'
import ShowMember from "./components/ShowMember"
import EditMember from "./components/EditMember"
import ShowLoan from "./components/ShowLoan"
import CreateLoan from "./components/CreateLoan"
import EditLoan from "./components/EditLoan"
import CreatePay from "./components/CreatePay"
import EditPay from "./components/EditPay"

function App() {

  return (
    <Router>
      <Navbar bg="primary">
        <Container>
          <Link to={"/"} className="navbar-brand text-white">
            ระบบบริหารจัดการเงินกู้
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
              <Route path="/loan/:id" element={<ShowLoan />} />
              <Route path="/loan/create/:id" element={<CreateLoan />} />
              <Route path="/loan/edit/:id" element={<EditLoan />} />
              <Route path="/pay/create/:id" element={<CreatePay />} />
              <Route path="/pay/edit/:id" element={<EditPay />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  )
}

export default App
