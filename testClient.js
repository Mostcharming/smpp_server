// import express from 'express';
const smpp = require('smpp')
// smpp-client.js

// Create a new SMPP session
const session = new smpp.Session({
  host: 'localhost', // Replace with your SMPP server's IP or hostname
  port: 2775 // Replace with your SMPP server's port
})

// Handle SMPP session events
session.on('connect', () => {
  console.log('Connected to SMPP server')

  // Send bind_transceiver request to authenticate
  session.bind_transceiver(
    {
      system_id: 'Infonomics', // Replace with your system ID
      password: 'ThisIsurPasswordDonotLoseIt' // Replace with your password
    },
    pdu => {
      if (pdu.command_status === 0) {
        console.log('Successfully bound to SMPP server')

        // Send an SMS after successful binding
        sendSMS()
      } else {
        console.error('Failed to bind SMPP server:', pdu.command_status)
        return
      }
    }
  )
})

// Send an SMS (submit_sm PDU)
function sendSMS () {
  session.submit_sm(
    {
      source_addr: '1234', // Sender's address
      destination_addr: '08100833879', // Recipient's address
      //'2348090444023' ,
      short_message: 'Hello from SMPP client!' // SMS content
    },
    pdu => {
      if (pdu.command_status === 0) {
        console.log('Message sent successfully, message ID:', pdu.message_id)
      } else {
        console.error('Failed to send message:', pdu.command_status)
      }
    }
  )
}

// Handle errors
session.on('error', err => {
  console.error('SMPP session error:', err)
})
