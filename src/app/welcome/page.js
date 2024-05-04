// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
"use client"
import React, { useState } from 'react';
import { ethers } from "ethers";
import { contractABI, contractAddress } from '../../../utils/constants';
import Link from 'next/link';
import Image from 'next/image';

const WalletCard = () => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Metamask check');

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
        <div className="flex items-center justify-center min-h-screen" style={{ position: "relative", zIndex: 1, fontFamily: 'font-mono' }}>
            <div style={{
                zIndex: -1,
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh"
            }}>
                <Image
                    src="/lego.jpg"
                    layout="fill"
                    objectFit="cover"
                    priority
                />
            </div>
            <div className='bg-stone-50 rounded-lg shadow-4xl shadow-inner shadow hover:shadow-lg p-12 max-w-2xl w-full' style={{ borderRadius: '30px', boxShadow: '0 10px 90px rgba(0, 0, 0, 0.5)' }}>
                <h2 className="text-4xl font-bold font-mono text-center mb-10" style={{ color: 'black' }}>Welcome to Lego Land</h2>
                <div className="grid grid-cols-3 gap-6">
                    <button onClick={connectWalletHandler}
                            className="text-center bg-red-400 hover:bg-red-300 text-white-50 font-bold font-mono py-3 px-6 rounded-full shadow-md transition duration-200 ease-in-out"
                            style={{ width: '100%', fontSize: '1rem' }}>
                        {connButtonText}
                    </button>
                    <Link href="/listingpage" passHref className="text-center bg-yellow-400 hover:bg-yellow-300 text-white-50 font-mono font-bold py-3 px-6 rounded-full shadow-md transition duration-200 ease-in-out"
                           style={{ width: '100%', fontSize: '1rem' }}>
                            Sell Your Lego
                    </Link>
                    <Link href="/buying" passHref className="text-center bg-green-400 hover:bg-green-300 text-white-50 font-bold font-mono py-3 px-6 rounded-full shadow-md transition duration-200 ease-in-out"
                           style={{ width: '100%', fontSize: '1rem' }}>
                            Enter Lego Land
                    </Link>
                </div>
                {defaultAccount && <p className="text-green-600 mt-6 font-mono text-center">Connected as {defaultAccount}</p>}
                {errorMessage && <p className="text-red-500 text-center mt-6">{errorMessage}</p>}
            </div>
        </div>
    );
}

export default WalletCard;
