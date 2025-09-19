"use client"
import { MetaMaskInpageProvider } from "@metamask/providers";
import { FundABI } from "@volleyball/shared";
import { BrowserProvider, Contract, JsonRpcSigner } from "ethers";
import { useState } from 'react';

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

    const handleDisConnect = () => {
        setAccount(null);
        setSigner(null);
        setProvider(null);
        setContract(null);
        alert("Account Disconnected");
    }
    const handleConnect = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask extension");
            return;
        }
        try {


            const Provider = new BrowserProvider(window.ethereum!);
            const Signer = await Provider.getSigner();
            const Account = await Signer.getAddress();
            const newContract = new Contract(process.env.NEXT_PUBLIC_CONTRACTADDRESS!, FundABI, Signer)
            setProvider(Provider);
            setSigner(Signer);
            setAccount(Account);
            setContract(newContract);
            console.log("Signer :", Signer);
            console.log("Account ", Account);
            console.log("provider", Provider);
            console.log("contract", newContract);
        } catch (error: any) {
            if (error.code === "ACTION_REJECTED") {
                alert("User rejected the action");

            }
            else {

                console.error("Failed to connect wallet:", error);
                alert("Failed to connect wallet. Please try again.");
            }

        }
    }

    return (
        <nav className='min-w-full px-6 py-4 text-xl shadow-lg nata font-medium shadow-amber-100 '>
            <div className="flex justify-between">
                <h2>Connect your Wallet to pay in ETH</h2>
                <button className='bg-red-400 py-1 px-4 text-white rounded-2xl' onClick={account ? handleDisConnect : handleConnect}> {account ? "Connected" : "connect"}</button>
            </div>
        </nav>
    )
}

export default Navbar