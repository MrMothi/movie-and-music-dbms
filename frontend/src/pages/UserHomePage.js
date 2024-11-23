import React from 'react'
import CustomerOrders from '../components/customerOrders'
import CustomerInfoCard from '../components/customerInfoCard'
function UserHomePage() {
  return (
    <div>
      <h1>User Home Page</h1>
      <div><CustomerInfoCard></CustomerInfoCard></div>
      <div><CustomerOrders></CustomerOrders></div>
    </div>
  )
}

export default UserHomePage