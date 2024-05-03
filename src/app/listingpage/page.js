"use client"
import React, { useState, useRef } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { contractABI, contractAddress } from '../../../utils/constants';

const WalletCard = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null); // Reference to the file input

    const onImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const uploadImageToPinata = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'pinata_api_key': '196610ea044c426509d0',
                    'pinata_secret_api_key': '891b09da0a2a97b1e1a2ca2d9d4b30fe443ea2a80c1ed9289417126333942b87',
                },
            });
            return response.data.IpfsHash;
        } catch (error) {
            console.error('Error uploading image to Pinata: ', error);
            setErrorMessage('Failed to upload image to Pinata.');
            return null;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            setErrorMessage('MetaMask is not detected.');
            return;
        }

        setIsLoading(true);
        const ipfsHash = await uploadImageToPinata(image);
        if (!ipfsHash) {
            setIsLoading(false);
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const marketplaceContract = new ethers.Contract(contractAddress, contractABI, signer);
            const transaction = await marketplaceContract.listItem(title, description, ipfsHash, ethers.utils.parseUnits(price, 'ether'));
            await transaction.wait();
            setSuccessMessage('Item listed successfully!');
            setTitle('');
            setDescription('');
            setPrice('');
            setImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Properly clear the file input
            }
            setTimeout(() => { setSuccessMessage(''); }, 3000);
        } catch (error) {
            console.error('Error processing transaction: ', error);
            setErrorMessage('Transaction failed: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-center h-screen bg-gradient-to-r from-gray-800 to-black'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-lg'>
                {successMessage && (
                    <div className="success bg-green-500 text-white p-4 mb-4 text-center font-bold rounded">
                        {successMessage}
                    </div>
                )}
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">List Your Item in the Marketplace</h2>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                        <label htmlFor="image-upload" className="block text-gray-800 font-bold mb-2">Upload Image</label>
                        <input type="file" ref={fileInputRef} onChange={onImageChange} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-800 font-bold mb-2" htmlFor="item-title">Title</label>
                        <input type="text" id="item-title" value={title} onChange={(e) => setTitle(e.target.value)}
                               className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" placeholder="Item Title" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-800 font-bold mb-2" htmlFor="item-description">Description</label>
                        <textarea id="item-description" value={description} onChange={(e) => setDescription(e.target.value)}
                                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" placeholder="Item Description" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-800 font-bold mb-2" htmlFor="item-price">Price (ETH)</label>
                        <input type="text" id="item-price" value={price} onChange={(e) => setPrice(e.target.value)}
                               className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" placeholder="Price in ETH" required />
                    </div>
                    <div className="flex justify-center">
                        <button type="submit"
                                disabled={isLoading}
                                className={`shadow focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded ${isLoading ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-400 text-white'}`}>
                            {isLoading ? 'Processing...' : 'List Item'}
                        </button>
                    </div>
                    {errorMessage && <p className="error text-red-500 text-center mt-4">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default WalletCard;
