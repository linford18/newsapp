/** @type {import('next').NextConfig} */
require('dotenv').config()
const nextConfig = {
  reactStrictMode: true,
  env:{
    web3storage : process.env.web3storage
  }
}

module.exports = nextConfig



// module.exports = {
//   env:{
//     web3storage = process.env.web3storage
//   }
// }