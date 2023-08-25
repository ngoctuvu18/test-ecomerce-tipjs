'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const { _SECONDS } = require('../helpers/consts')

//check Count Connect
const countConnect = () => {
  const numConnection = mongoose.connections.length
  console.log(`Number of Connections :: ${numConnection}`)
}

// check Over Load
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    /*gia su may chiu dc 5 connections (example maximum number  of connections based on number osf cores) */
    const maxConnections = numCores * 5
    console.log(`Active connection:: ${numConnection}`)
    console.log(`Memory Usage:: ${memoryUsage / 1024 / 1024} MB`)
    if (numConnection > maxConnections) {
      console.log(`Connection overload detected !!`)
    }
  }, _SECONDS) // Monitor every 5 seconds
}

module.exports = {
  countConnect,
  checkOverload,
}
