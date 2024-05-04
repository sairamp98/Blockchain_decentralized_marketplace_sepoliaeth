"use client" // Ensure the component runs only on the client-side where window object and Ethereum are available.
import React, { useState, Suspense } from 'react'; // Import useState for state management, Suspense for lazy loading components.
import { ethers } from "ethers"; // Ethers.js for interacting with the Ethereum blockchain.
import { contractABI, contractAddress } from "../../../utils/constants"; // Import ABI and address for smart contract interaction.
import { useSearchParams } from "next/navigation"; // Hook from Next.js for accessing URL search parameters.
import Image from 'next/image'; // Optimized image component from Next.js for better performance and SEO.

const ItemDetails = () => {
    // State hooks for managing the purchase state, error messages, transaction hash, and button text.
    const [isBuying, setIsBuying] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [transactionHash, setTransactionHash] = useState('');
    const [buttonText, setButtonText] = useState('Buy Item');

    // Function to handle item purchases.
    const buyItem = async (id, price) => {
        // Check for MetaMask presence.
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            setErrorMessage('Please install MetaMask to perform the transaction.');
            return;
        }

        setIsBuying(true);  // Disable the button and indicate processing state.
        setButtonText('Processing...');

        try {
            // Setup provider and signer for transactions.
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const new_price = ethers.utils.parseUnits(price.toString(), "ether"); // Convert the price to ether.

            // Execute the purchase transaction.
            const transaction = await contract.buyItem(id, {value: new_price});
            const receipt = await transaction.wait(); // Wait for the transaction to be confirmed.

            // Update state with the transaction hash and mark the item as sold.
            setTransactionHash(receipt.transactionHash);
            setButtonText('Sold Out');
            setIsBuying(true);      // Keep button disabled as the item is sold.
        } catch (error) {
            console.error('Transaction failed:', error);
            setErrorMessage('Transaction failed. Please try again.');
            setIsBuying(false);     // Enable the button to allow retry.
            setButtonText('Buy Item');
        }
    };

    // Component for displaying item details using URL search parameters.
    const SearchParamsComponent = () => {
        const searchParams = useSearchParams();
        // Extract item details from URL parameters.
        const title = searchParams.get('title');
        const description = searchParams.get('description');
        const price = searchParams.get('price');
        const imageHash = searchParams.get('imageHash');
        const id = searchParams.get('id');

        return (
            <React.Fragment>
                <h1 className="text-3xl font-bold font-mono text-gray-800 mb-2">{title}</h1>
                <img src={`https://gateway.pinata.cloud/ipfs/${imageHash}`} alt={title} className="rounded w-full object-cover h-64 mb-2" />
                <p className="text-gray-600 font-mono mb-2">{description}</p>
                <p className="text-xl font-mono text-gray-900 mb-4">Price: {price} ETH</p>
                <button 
                    className={`w-full py-2 px-4 text-white font-mono font-bold rounded ${isBuying ? 'bg-gray-400' : 'bg-purple-500 hover:bg-purple-400'}`}
                    onClick={() => buyItem(id, price)} 
                    disabled={isBuying}>
                    {buttonText}
                </button>
                {transactionHash && <p className="text-green-500 text-center mt-2">Purchase successful! Transaction ID: {transactionHash}</p>}
            </React.Fragment>
        );
    };

    // Main component rendering.
    return (
        <div className="flex items-center justify-center min-h-screen" style={{ position: "relative", zIndex: 1 }}>
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
                    priority    // Marks the image as high priority to load earlier.
                />
            </div>
            <div className='bg-stone-50 rounded-lg shadow-4xl p-10 max-w-2xl w-full' style={{ borderRadius: '30px', boxShadow: '0 10px 90px rgba(0, 0, 0, 0.7)' }}>
                <Suspense fallback={<p>Loading details...</p>}>
                    <SearchParamsComponent />   
                </Suspense>
                {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default ItemDetails;  // Export the component for broader application use.
