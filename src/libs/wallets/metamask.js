import Web3 from 'web3'
import { ethers } from 'ethers'
const AbiCoder = require('web3-eth-abi')

const toFixed = (x) => {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1])
    if (e) {
      x *= Math.pow(10, e - 1)
      x = '0.' + new Array(e).join('0') + x.toString().substring(2)
    }
  } else {
    var e = parseInt(x.toString().split('+')[1])
    if (e > 20) {
      e -= 20
      x /= Math.pow(10, e)
      x += new Array(e + 1).join('0')
    }
  }
  return x
}

class MetaMask {
  constructor(ethereum) {
    this.ethereum = ethereum
    this.flashbotUrl = 'https://relay.flashbots.net'
    this.web3Endpoint =
      'https://eth.getblock.io/mainnet/?api_key=91953f06-fc0a-4a48-87fc-145e8cf6d385'
  }

  #isMetaMaskInstalled = () => {
    return Boolean(this.ethereum && this.ethereum.isMetaMask)
  }

  getBalance = async (address) => {
    try {
      const web3 = new Web3(this.web3Endpoint)
      const resBalance = await web3.eth.getBalance(address)
      return { status: 200, content: { balance: resBalance } }
    } catch (e) {
      return { status: 400, content: { message: e.message } }
    }
  }

  calculateEtherValue = async (
    value,
    maxFeePerGas,
    maxPriorityFeePerGas,
    gasLimit
  ) => {
    const etherValue = toFixed(
      parseInt(gasLimit) * parseFloat(maxFeePerGas / 1e9) +
        parseFloat(maxPriorityFeePerGas / 1e9) +
        parseFloat(value)
    )

    const rounding = parseFloat(
      parseFloat(String(etherValue)).toFixed(3).replace(/0+$/, '') + 0.001
    )

    return rounding
  }

  estimateGas = async (fromAddress, contractAddress) => {
    try {
      const web3 = new Web3(this.web3Endpoint)
      const gasEstimate = await web3.eth.estimateGas({
        from: fromAddress,
        to: contractAddress,
        value: Number(0),
        maxFeePerGas: Number(0),
        maxPriorityFeePerGas: Number(0)
      })

      if (String(gasEstimate).toLowerCase().includes('revert'))
        return { status: 200, content: { result: false } }

      return { status: 200, content: { result: true } }
    } catch (e) {
      console.log(e.message)
      if (String(e.message).toLowerCase().includes('supply')) {
        return {
          status: 400,
          content: { message: e.message }
        }
      }
      if (String(e.message).toLowerCase().includes('revert')) {
        return { status: 200, content: { result: false } }
      }
      return {
        status: 400,
        content: { message: e.message }
      }
    }
  }

  onClickConnect = async () => {
    if (this.#isMetaMaskInstalled()) {
      await this.ethereum.request({ method: 'eth_requestAccounts' })
      const accounts = await this.ethereum.request({ method: 'eth_accounts' })
      const ethereumAddress = accounts[0]
      return { status: 200, content: { address: ethereumAddress } }
    }

    return {
      status: 400,
      content: { message: 'MetaMask Not Found ! \n Please Install MetaMask' }
    }
  }

  onLoadConnect = () => {
    if (this.#isMetaMaskInstalled()) {
      return this.ethereum.isConnected()
    }
    return false
  }

  signTx = async (
    address,
    value,
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
    contractAddress,
    mintAbi,
    flagAbi,
    args
  ) => {
    try {
      if (maxFeePerGas <= maxPriorityFeePerGas)
        return {
          status: 400,
          content: {
            message: 'maxFeePerGas may more then MaxPriorityFeePerGas'
          }
        }

      const web3 = new Web3(this.web3Endpoint)

      const utils = ethers.utils

      const GWEI = 10n ** 9n

      // eslint-disable-next-line no-eval
      const maxFee = GWEI * eval(`${maxFeePerGas}n`)
      // eslint-disable-next-line no-eval
      const maxPriorityFee = GWEI * eval(`${maxPriorityFeePerGas}n`)

      value = web3.utils.toWei(String(value), 'ether')
      // eslint-disable-next-line no-eval
      value = eval(`${value}n`)

      if (mintAbi == null)
        return {
          status: 400,
          content: {
            message: 'Please Select Your Mint ABI Function.'
          }
        }

      const data = AbiCoder.encodeFunctionCall(mintAbi, args)

      if (!String(flagAbi.name).toLowerCase().includes('main')) {
        if (flagAbi == null)
          return {
            status: 400,
            content: {
              message: 'Please Select Your Flag.'
            }
          }

        const resCheckFlag = await this.checkFlag(flagAbi, contractAddress)

        if (resCheckFlag.status === 400)
          return {
            status: 400,
            content: { message: resCheckFlag.content.message }
          }
      } else {
        const resEstimateGas = await this.estimateGas(address, contractAddress)
        if (resEstimateGas.status === 400) return resEstimateGas
      }

      const nonce = await web3.eth.getTransactionCount(address, 'pending')

      const tx = {
        nonce: nonce,
        chainId: 1,
        type: 2,
        value: value,
        data: data,
        gasLimit: parseInt(gasLimit),
        maxFeePerGas: maxFee,
        maxPriorityFeePerGas: maxPriorityFee,
        to: contractAddress
      }

      const signingDataHashed = utils.keccak256(utils.serializeTransaction(tx))

      const signature = await this.ethereum.request({
        method: 'eth_sign',
        params: [address, signingDataHashed]
      })

      const signedTransaction = utils.serializeTransaction(tx, signature)

      return { status: 200, content: { rawTx: signedTransaction } }
    } catch (e) {
      console.log(e)
      return { status: 400, content: { message: e.message } }
    }
  }

  checkFlag = async (flagAbi, contractAddress) => {
    try {
      const web3 = new Web3(this.web3Endpoint)

      const contract = new web3.eth.Contract([flagAbi], contractAddress)

      let result = await contract.methods
      // eslint-disable-next-line no-eval
      result = await eval(`result.${flagAbi.name}().call()`)

      console.log(result)

      return { status: 200, content: { result: result } }
    } catch (e) {
      console.log(e)
      return { status: 400, content: { message: e.message } }
    }
  }

  flashbotSendSignedTx = async (signedTx, bundle) => {
    try {
      if (bundle) {
        // BUNDLE OR NOT
        const flashbotWeb3 = new Web3('https://rpc.flashbots.net')
        const tx = await flashbotWeb3.eth.sendSignedTransaction(signedTx)
        return {
          status: 200,
          content: { data: tx?.transactionHash || tx?.blockHash }
        }
      }
      const flashbotWeb3 = new Web3('https://rpc.flashbots.net')
      const tx = await flashbotWeb3.eth.sendSignedTransaction(signedTx)
      return {
        status: 200,
        content: { data: tx?.transactionHash || tx?.blockHash }
      }
    } catch (e) {
      console.log(e)
      return {
        status: 400,
        content: { message: e.message }
      }
    }
  }
  sendTx = async (
    fromAddress,
    value,
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
    contractAddress,
    mintAbi,
    args
  ) => {
    try {
      const web3 = new Web3(this.web3Endpoint)

      const data = AbiCoder.encodeFunctionCall(mintAbi, args)

      const transactionParameters = {
        from: fromAddress,
        to: contractAddress,
        value: web3.utils.toHex(
          web3.utils.toWei(Number(value).toString(), 'ether')
        ),
        maxPriorityFeePerGas: web3.utils.numberToHex(
          web3.utils.toWei(maxPriorityFeePerGas, 'gwei')
        ),
        maxFeePerGas: web3.utils.numberToHex(
          web3.utils.toWei(maxFeePerGas, 'gwei')
        ),
        gasLimit: gasLimit,
        data: data
      }

      const resTx = await this.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters]
      })

      console.log(resTx)

      return { status: 200, content: { data: resTx } }
    } catch (e) {
      console.log(e)
      return { status: 400, content: { message: e.message } }
    }
  }
}

export default MetaMask
