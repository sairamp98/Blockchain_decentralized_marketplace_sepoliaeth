"use client"
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../../../utils/constants';
import Image from 'next/image';

const MarketplaceDisplay = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractABI, provider);

            const itemListedFilter = contract.filters.ItemListed();
            const logs = await provider.getLogs({ ...itemListedFilter, fromBlock: 0 });
            const parsedLogs = logs.map(log => ({
                ...contract.interface.parseLog(log).args,
                transactionHash: log.transactionHash
            }));

            const items = await contract.getAllItems();
            const itemsFormatted = items.map(item => ({
                id: item.id.toNumber(),
                title: item.title,
                imageHash: item.imageHash,
                price: ethers.utils.formatEther(item.price),
                sold: item.sold,
                description: item.description,
                transactionHash: parsedLogs.find(log => log.itemId.toNumber() === item.id.toNumber()).transactionHash
            }));
            
            setItems(itemsFormatted);
        };

        fetchItems();
    }, []);

    const handleCardClick = (item) => {
        if (!item.sold) {
            window.location.href = `/item_details?title=${encodeURIComponent(item.title)}&imageHash=${encodeURIComponent(item.imageHash)}&price=${encodeURIComponent(item.price)}&sold=${item.sold}&description=${encodeURIComponent(item.description)}&id=${item.id}`;
        }
    };

    const handleContractAddressClick = () => {
        window.location.href = `https://sepolia.etherscan.io/address/0xcdfaa17c5ffccd519b9d56eee372a91406ce7f25`; // Redirect to Etherscan page of the contract
    };

    return (
        <div>
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
            <div className="container mx-auto px-4">
                <br/>
                <div className="flex justify-between items-center">
                    <button className="bg-white text-black font-mono text-3xl font-bold py-2 px-8 rounded-full shadow-lg">LEGO LAND</button>
                    <button className="bg-white text-black font-mono text-sm font-bold py-2 px-8 rounded-full shadow-lg"
                        onClick={handleContractAddressClick}>Contract Address: 
                        {contractAddress.substring(0, 6)}...{contractAddress.substring(contractAddress.length - 4)}
                    </button>
                </div>
                <br/><br/>
                <div className="grid grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item.id} 
                             className={`relative bg-white rounded-xl shadow-xl p-6 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl ${item.sold ? 'opacity-90 cursor-not-allowed' : 'cursor-pointer'}`}
                             onClick={() => handleCardClick(item)}>
                            <img src={`https://gateway.pinata.cloud/ipfs/${item.imageHash}`} alt={item.title} className="rounded w-full h-64 object-cover mb-4" />
                            <h5 className="text-gray-900 font-mono text-xl leading-tight font-bold mb-2">{item.title}</h5>
                            <p className="text-gray-600 font-mono mb-1">Transaction Hash:</p>
                            <p className="text-gray-500 font-mono text-xs mb-3 break-all">{item.transactionHash}</p>
                            <p className="text-gray-600 font-mono mb-1">Price: {item.price} ETH</p>
                            {item.sold && <div className="absolute top-0 left-0 right-0 bottom-0 flex font-mono items-center justify-center font-bold text-white text-xl" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>Sold Out</div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarketplaceDisplay;
