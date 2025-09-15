"use client"
import { MetaMaskInpageProvider } from "@metamask/providers";
import { abi } from "@/constant/Fund.json"
import React from 'react'
import { useEffect, useState } from 'react';
import { ethers, BrowserProvider, JsonRpcSigner, Contract } from "ethers";

declare global {
    interface Window {
        ethereum?: MetaMaskInpageProvider

    }
}

const Navbar = () => {
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
    const [contract, setContract] = useState<Contract | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const handleConnect = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask extension");
            return;
        }
        try {


            const provider = new BrowserProvider(window.ethereum!);
            const signer = await provider.getSigner();
            const account = await signer.getAddress();
            const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACTADDRESS!, abi, signer)
            setProvider(provider);
            setSigner(signer);
            setAccount(account);
            setContract(contract);
            console.log("Signer :", signer);
            console.log("Account ", account);
            console.log("provider", provider);
            console.log("contract", contract);
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            alert("Failed to connect wallet. Please try again.");

        }
    }

    return (
        <nav className='min-w-full px-6 py-4 text-xl shadow-lg nata font-medium shadow-amber-100 '>
            <div className="flex justify-between">
                <h2>Connect your Wallet to pay in ETH</h2>
                <button className='bg-red-400 py-1 px-4 text-white rounded-2xl' onClick={handleConnect}> {account ? "Connected" : "connect"}</button>
            </div>
        </nav>
    )
}

export default Navbar