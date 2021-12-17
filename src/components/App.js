import './App.css';
import uniswapFactory from '../abis/UniswapFactory.json';
import uniswap from '../abis/Uniswap.json';
import kyberRate from '../abis/KyberRate.json'
import Web3 from 'web3';
import { useEffect } from 'react';
import { useState } from 'react';
require('dotenv').config()
  function App() {
  const [account, setAccount]  = useState(null);
  const [balance, setBalance]  = useState(null);

  const initWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }
  const initBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    const balance = await web3.eth.getBalance(accounts[0]);
    // this.setState({ account: accounts[0], balance: balance });
    //uniswap factory
    const uniswapFactoryContract = new web3.eth.Contract(uniswapFactory, process.env.REACT_APP_UNISWAP_FACTORY);
    const kyberRateContract = new web3.eth.Contract(kyberRate, process.env.REACT_APP_KYBER_RATE_ADDRESS)
    const outputTokenAddress = "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"
    const inputTokenAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    const exchangeAddress = await uniswapFactoryContract.methods.getExchange(outputTokenAddress).call()
    const uniswapExchangeContract = new web3.eth.Contract(uniswap, exchangeAddress);
    const inputAmount = web3.utils.toWei('1', 'ETHER')

    const uniswapResult = await uniswapExchangeContract.methods.getEthToTokenInputPrice(inputAmount).call()
    const { expectedRate, slippageRate} = await kyberRateContract.methods.getExpectedRate(inputTokenAddress, outputTokenAddress, inputAmount, true).call()
    console.log( "uniswapResult",web3.utils.fromWei(uniswapResult, 'ETHER'));
    console.log("kyberRateResult", web3.utils.fromWei(expectedRate, 'ETHER'))
  }
  useEffect(async () => {
    await initWeb3();
    await initBlockchainData();
    console.log("1");
  }, [])
  return (
    <div className="App">
      what is this
    </div>
  );
}

export default App;
