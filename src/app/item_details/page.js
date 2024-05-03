"use client"
import React, { useState } from 'react';
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../../../utils/constants";
import { useSearchParams } from "next/navigation";

const ItemDetails = () => {
    const searchParams = useSearchParams();
    const [isBuying, setIsBuying] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [buttonText, setButtonText] = useState('Buy Item');

    const title = searchParams.get('title');
    const description = searchParams.get('description');
    const price = searchParams.get('price');
    const imageHash = searchParams.get('imageHash');
    const id = searchParams.get('id');
    //console.log(typeof(id));

    const connectWalletHandler = async () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" });
            } catch (error) {
                console.log('Error connecting to MetaMask:', error);
                setErrorMessage('Failed to connect wallet. Make sure MetaMask is installed and unlocked.');
            }
        } else {
            console.log('MetaMask is not installed');
            setErrorMessage('Please install MetaMask browser extension to interact');
        }
    };

    const buyItem = async () => {
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            setErrorMessage('Please install MetaMask to perform the transaction.');
            return;
        }

        setIsBuying(true);
        setButtonText('Processing...');

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
             const new_price = ethers.utils.parseUnits(price.toString(), "ether");
            // console.log(ethers.utils.parseEther(new_price.toString()));
            console.log(id);
            console.log(1);
            

            const transaction = await contract.buyItem(id, {value:new_price});
            console.log(4);
            await transaction.wait();

            setIsBuying(false);
            setTimeout(() => window.location.href = '/buying', 3000);  // Redirect after success message
        } catch (error) {
            console.error('Transaction failed:', error);
            setErrorMessage('Transaction failed. Please try again.');
            setIsBuying(false);
            setButtonText('Buy Item');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800 p-6">
            <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
                <img src={`https://gateway.pinata.cloud/ipfs/${imageHash}`} alt={title} className="rounded w-full object-cover h-64 mb-2" />
                <p className="text-gray-600 mb-2">{description}</p>
                <p className="text-xl text-gray-900 mb-4">{price} ETH</p>
                <button 
                    className={`w-full py-2 px-4 text-white font-bold rounded ${isBuying ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-400'}`}
                    onClick={()=>buyItem(id)} 
                    disabled={isBuying}>
                    {buttonText}
                </button>
                {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default ItemDetails;
