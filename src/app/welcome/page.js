// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
"use client"
import React, { useState } from 'react';
import { ethers } from "ethers";
import { contractABI, contractAddress } from '../../../utils/constants';
import Link from 'next/link';

const WalletCard = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Wallet connection check');

    const connectWalletHandler = async () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setDefaultAccount(accounts[0]);
                setConnButtonText('Wallet Connected');
            } catch (error) {
                setErrorMessage(error.message);
            }
        } else {
            setErrorMessage('Please install MetaMask browser extension to interact');
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black'>
            <div className='bg-white rounded-lg shadow-xl p-8 max-w-lg w-full'>
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Welcome to the Marketplace</h2>
                <div className="grid grid-cols-3 gap-4">
                    <button onClick={connectWalletHandler}
                            className={`font-bold py-2 px-4 rounded ${defaultAccount ? 'bg-green-500 hover:bg-green-400' : 'bg-gray-500 hover:bg-gray-400'} text-white shadow-lg focus:shadow-outline focus:outline-none transition duration-150 ease-in-out`}>
                        {connButtonText}
                    </button>
                        <Link href="/listingpage" passHref className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-150 ease-in-out text-center">
                            List an item
                        </Link>
                        <Link href="/buying" passHref className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-150 ease-in-out text-center">
                            Buy an Item
                        </Link>
                </div>
                {defaultAccount && <p className="text-green-600 mt-4 text-center">Connected as {defaultAccount}</p>}
                {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
            </div>
        </div>
    );
}

export default WalletCard;

