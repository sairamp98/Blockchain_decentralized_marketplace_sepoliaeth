"use client" // Ensures the code runs only on the client-side where the Ethereum object is accessible.
import React, { useState, useRef } from 'react';  // React hooks for managing state and references.
import { ethers } from 'ethers';  // Ethers.js library for interacting with the Ethereum blockchain.
import axios from 'axios';  // Axios for making HTTP requests.
import { contractABI, contractAddress } from '../../../utils/constants';  // Importing contract details.
import Image from 'next/image';  // Optimized image component from Next.js.

// WalletCard component definition.
const WalletCard = () => {
    // State hooks to manage form inputs and application state.
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null); // Ref for the file input element to reset it after form submission.

    // Handles image file selection.
    const onImageChange = (event) => {
        setImage(event.target.files[0]); // Set the selected file into state.
    };

    // Function to upload the selected image to Pinata (IPFS service).
    const uploadImageToPinata = async (file) => {
        const formData = new FormData(); // FormData to handle file upload.
        formData.append('file', file); // Append file to FormData.
        try {
            const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'pinata_api_key': '196610ea044c426509d0', // Your Pinata API key.
                    'pinata_secret_api_key': '891b09da0a2a97b1e1a2ca2d9d4b30fe443ea2a80c1ed9289417126333942b87', // Your Pinata secret API key.
                },
            });
            return response.data.IpfsHash;  // Return the IPFS hash of the uploaded file.
        } catch (error) {
            console.error('Error uploading image to Pinata: ', error);
            setErrorMessage('Failed to upload image to Pinata.');
            return null;
        }
    };
    // Function to handle form submission.
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior.
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            setErrorMessage('MetaMask is not detected.'); // Check for MetaMask
            return;
        }

        setIsLoading(true); // Set loading state to true.
        const ipfsHash = await uploadImageToPinata(image); // Upload image and get IPFS hash.
        if (!ipfsHash) {
            setIsLoading(false); // If upload fails, stop loading.
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum); // Create a provider.
            const signer = provider.getSigner(); // Get the signer from the provider.
            const marketplaceContract = new ethers.Contract(contractAddress, contractABI, signer); // Instantiate the contract.
            const transaction = await marketplaceContract.listItem(title, description, ipfsHash, ethers.utils.parseUnits(price, 'ether')); // Send transaction to list the item.
            await transaction.wait(); // Wait for transaction to be mined.
            setSuccessMessage('Item listed successfully!'); // Set success message.
            // Reset all form fields and states.
            setTitle('');
            setDescription('');
            setPrice('');
            setImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Properly clear the file input
            }
            setTimeout(() => { setSuccessMessage(''); }, 3000); // Clear success message after 3 seconds.
        } catch (error) {
            console.error('Error processing transaction: ', error); // Set error message.
            setErrorMessage('Transaction failed: ' + error.message);
        } finally {
            setIsLoading(false); // Set loading state to false regardless of transaction outcome.
        }
    };
    // Component rendering logic.
    return (
        <div className='flex items-center justify-center h-screen' style={{ position: "relative", zIndex: 1, fontFamily: 'font-mono' }}>
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
                    priority // Prioritizes loading of the background image.
                />
            </div>
            <div className='bg-stone-50 rounded-lg shadow-4xl shadow-inner shadow hover:shadow-lg p-12 max-w-2xl w-full' style={{ borderRadius: '30px', boxShadow: '0 10px 90px rgba(0, 0, 0, 0.5)' }}>
                {successMessage && (
                    <div className="success bg-green-500 text-white p-4 mb-4 text-center font-mono font-bold rounded">
                        {successMessage}
                    </div>
                )}
                <h2 className="text-3xl font-bold font-mono text-gray-800 text-center mb-6">List Your Collection to the Lego Land</h2>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                        <label htmlFor="image-upload" className="block text-gray-800 font-mono font-bold mb-2"> Upload Image</label>
                        <input type="file" ref={fileInputRef} onChange={onImageChange} className="bg-gray-200 appearance-none font-mono border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-800 font-mono font-bold mb-2" htmlFor="item-title">Title</label>
                        <input type="text" id="item-title" value={title} onChange={(e) => setTitle(e.target.value)}
                               className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 font-mono text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" placeholder="Item Title" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-800 font-mono font-bold mb-2" htmlFor="item-description">Description</label>
                        <textarea id="item-description" value={description} onChange={(e) => setDescription(e.target.value)}
                                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 font-mono leading-tight focus:outline-none focus:bg-white focus:border-purple-500" placeholder="Item Description" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-800 font-mono font-bold mb-2" htmlFor="item-price">Price (ETH)</label>
                        <input type="text" id="item-price" value={price} onChange={(e) => setPrice(e.target.value)}
                               className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 font-mono leading-tight focus:outline-none focus:bg-white focus:border-purple-500" placeholder="Price in ETH" required />
                    </div>
                    <div className="flex justify-center">
                        <button type="submit"
                                disabled={isLoading}
                                className={`shadow focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded ${isLoading ? 'bg-gray-400 font-mono hover:bg-gray-400 cursor-not-allowed' : 'bg-purple-500 font-mono hover:bg-purple-400 text-white'}`}>
                            {isLoading ? 'Processing...' : 'List to Lego Land'}
                        </button>
                    </div>
                    {errorMessage && <p className="error text-red-500 font-mono text-center mt-4">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default WalletCard; // Export the component for use in other parts of the application.
