// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
// Using client-side rendering for this component to ensure Ethereum object is available in window.
"use client"
import React, { useState } from 'react';
import { ethers } from "ethers";//Importing ethers to interact with Ethereum.
import { contractABI, contractAddress } from '../../../utils/constants'; // Importing contract ABI and address utilities.
import Link from 'next/link'; // Link component for client-side navigation.
import Image from 'next/image'; // Next.js Image component for optimized image handling.

// WalletCard functional component for wallet interaction functionality.
const WalletCard = () => {
    const [errorMessage, setErrorMessage] = useState(null); // State for storing error messages.
    const [defaultAccount, setDefaultAccount] = useState(null); // State for storing the user's default Ethereum account.
    const [connButtonText, setConnButtonText] = useState('Metamask check'); // State for the connect button text.

    // Handler for connecting to MetaMask wallet.
    const connectWalletHandler = async () => {
        if (window.ethereum && window.ethereum.isMetaMask) { // Check if MetaMask is installed.
            try {
                // Requesting accounts access.
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setDefaultAccount(accounts[0]); // Set the first account as the default.
                setConnButtonText('Wallet Connected'); // Update button text to show successful connection.
            } catch (error) {
                setErrorMessage(error.message); // Handle errors by setting the error message state.
            }
        } else {
            setErrorMessage('Please install MetaMask browser extension to interact'); // Error message if MetaMask is not installed.
        }
    };
    
    // Component layout using Tailwind CSS for styling.
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

export default WalletCard; // Exporting the component for use in other parts of the application.
