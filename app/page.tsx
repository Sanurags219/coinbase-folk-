'use client';

import React, { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { 
  X,
  LayoutDashboard, 
  RefreshCcw, 
  Globe, 
  Users, 
  Settings, 
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Search,
  Bell,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount } from 'wagmi';

// Simplified Wagmi/OnchainKit components for the demo
const EmptyState = ({ title, description, icon, action, onAction }: { title: string, description: string, icon: React.ReactNode, action?: string, onAction?: () => void }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-400">
      {icon}
    </div>
    <h4 className="text-xl font-bold mb-2">{title}</h4>
    <p className="text-gray-500 text-sm max-w-xs mb-8">{description}</p>
    {action && (
      <button 
        onClick={onAction}
        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/10"
      >
        {action}
      </button>
    )}
  </div>
);

const AssetRow = ({ name, symbol, amount, value, change, color, icon, iconClass = "", changeColor = "text-green-400" }: any) => (
  <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center text-xl font-bold font-mono shadow-lg ${iconClass}`}>
        {icon}
      </div>
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-gray-500 text-sm">{amount} {symbol}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-mono font-bold">{value}</p>
      <p className={`text-xs ${changeColor}`}>{change}</p>
    </div>
  </div>
);

const NFTCard = ({ id, emoji, color }: any) => (
  <div className="aspect-square rounded-xl overflow-hidden relative group cursor-pointer">
    <div className={`absolute inset-0 bg-gradient-to-br ${color} transition-transform group-hover:scale-110 duration-500`}></div>
    <div className="absolute inset-0 flex items-center justify-center text-4xl drop-shadow-2xl group-hover:scale-125 transition-transform">
      {emoji}
    </div>
    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity">
      <span className="text-[10px] font-mono bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">#{id}</span>
    </div>
  </div>
);

const ActivityRow = ({ title, time, icon, iconColor, opacity = "opacity-100" }: any) => (
  <div className={`flex items-center gap-4 ${opacity}`}>
    <div className={`w-10 h-10 rounded-full ${iconColor} flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">{title}</p>
      <p className="text-[10px] text-gray-500 uppercase">{time}</p>
    </div>
  </div>
);

export default function FolkWalletPage() {
  const { isConnected, address } = useAccount();
  const [isReady, setIsReady] = useState(false);
  const [activeView, setActiveView] = useState<'assets' | 'transactions'>('assets');
  const [txFilter, setTxFilter] = useState<'All' | 'Sent' | 'Received' | 'Swapped'>('All');
  const [expandedTxId, setExpandedTxId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [sendRecipient, setSendRecipient] = useState('');
  const [sendAmount, setSendAmount] = useState('');

  useEffect(() => {
    const initialize = async () => {
      if (typeof window !== 'undefined') {
        sdk.actions.ready();
        setIsReady(true);
      }
    };
    initialize();
  }, []);

  const assets = [
    { name: "Ethereum", symbol: "ETH", amount: "12.4", value: "$31,241.02", change: "+1.2%", color: "bg-[#627EEA]" , icon: "Ξ" },
    { name: "Bitcoin", symbol: "BTC", amount: "0.14", value: "$8,921.45", change: "-0.4%", changeColor: "text-red-400", color: "bg-[#F7931A]", icon: "₿" },
    { name: "Solana", symbol: "SOL", amount: "18.2", value: "$1,906.74", change: "+5.8%", color: "bg-[#14F195]", icon: "S", iconClass: "text-black" },
  ];

  const transactions = [
    { 
      id: 1, 
      type: 'Swapped', 
      title: 'Swapped ETH for SOL', 
      time: '2 hours ago', 
      amount: '0.5 ETH', 
      status: 'Completed', 
      icon: <ArrowLeftRight className="w-4 h-4" />, 
      iconColor: 'bg-blue-500/20 text-blue-400',
      hash: '0x74a...8f9e',
      gasUsed: '21,000 units',
      gasPrice: '1.2 Gwei',
      to: '0x3a...ef21',
      network: 'Base Mainnet'
    },
    { 
      id: 2, 
      type: 'Sent', 
      title: 'Sent to 0x3...4b2', 
      time: '5 hours ago', 
      amount: '1.2 ETH', 
      status: 'Completed', 
      icon: <ArrowUpRight className="w-4 h-4" />, 
      iconColor: 'bg-red-500/20 text-red-400',
      hash: '0x12b...3c4d',
      gasUsed: '21,000 units',
      gasPrice: '0.8 Gwei',
      to: '0x3...4b2',
      network: 'Base Mainnet'
    },
    { 
      id: 3, 
      type: 'Received', 
      title: 'Received from 0x7...1a9', 
      time: 'Yesterday', 
      amount: '0.05 BTC', 
      status: 'Completed', 
      icon: <ArrowDownLeft className="w-4 h-4" />, 
      iconColor: 'bg-green-500/20 text-green-400',
      hash: '0x98e...7f65',
      gasUsed: 'N/A',
      gasPrice: 'N/A',
      to: '0x8b...72a1',
      network: 'Bitcoin'
    },
    { 
      id: 4, 
      type: 'Swapped', 
      title: 'Swapped USDC for wETH', 
      time: '2 days ago', 
      amount: '500 USDC', 
      status: 'Completed', 
      icon: <ArrowLeftRight className="w-4 h-4" />, 
      iconColor: 'bg-blue-500/20 text-blue-400',
      hash: '0x55c...de11',
      gasUsed: '65,241 units',
      gasPrice: '1.5 Gwei',
      to: '0x4...9b3',
      network: 'Base Mainnet'
    },
    { 
      id: 5, 
      type: 'Sent', 
      title: 'Sent to 0x1...8f3', 
      time: '3 days ago', 
      amount: '10.5 SOL', 
      status: 'Completed', 
      icon: <ArrowUpRight className="w-4 h-4" />, 
      iconColor: 'bg-red-500/20 text-red-400',
      hash: '3sJ...4mK',
      gasUsed: '5,000 units',
      gasPrice: '0.000005 SOL',
      to: '0x1...8f3',
      network: 'Solana'
    },
  ];

  const filteredTransactions = (txFilter === 'All' 
    ? transactions 
    : transactions.filter(tx => tx.type === txFilter)
  ).filter(tx => 
    tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.amount.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.hash.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-[#0A0B0D] text-white font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-64 border-r border-white/10 flex-col p-6 shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45"></div>
          </div>
          <span className="font-bold text-xl tracking-tight">Folk Wallet</span>
        </div>

        <nav className="space-y-1">
          <button 
            onClick={() => setActiveView('assets')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'assets' ? 'bg-white/5 text-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Assets
          </button>
          <button 
            onClick={() => setActiveView('transactions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === 'transactions' ? 'bg-white/5 text-blue-400' : 'text-gray-400 hover:text-white'}`}
          >
            <RefreshCcw className="w-5 h-5" />
            Transactions
          </button>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
            <Globe className="w-5 h-5" />
            Browser
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
            <Users className="w-5 h-5" />
            Social
          </a>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10 space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#0A0B0D]">
        {/* Header */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-4 md:px-8 shrink-0 backdrop-blur-md sticky top-0 z-20">
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search assets or addresses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <RefreshCcw className="w-3.5 h-3.5 rotate-45" />
                </button>
              )}
            </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors border border-white/10">
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pl-2 pr-4 py-1.5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-rose-400"></div>
              <div className="hidden sm:block">
                <p className="text-[10px] text-gray-500 font-bold uppercase leading-none mb-0.5">Wallet</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-mono font-bold tracking-tight">
                    {isConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Disconnected'}
                  </span>
                  <Copy className="w-3 h-3 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeView === 'assets' ? (
            <motion.div 
              key="assets-view"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="p-4 md:p-8 flex-1 grid grid-cols-1 md:grid-cols-12 gap-6"
            >
              {/* Left Column: Balance & Assets */}
              <div className="md:col-span-8 flex flex-col gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-white/5 rounded-3xl border border-white/10"
                >
                  <p className="text-gray-400 text-sm mb-1">Portfolio Balance</p>
                  <h1 className="text-4xl md:text-5xl font-bold mb-8">
                    $42,069.21 <span className="text-lg text-green-400 font-normal ml-2">+2.4%</span>
                  </h1>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button className="py-3 bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl font-semibold flex items-center justify-center gap-2">
                      <Plus className="w-5 h-5" />
                      Buy
                    </button>
                    <button 
                      onClick={() => setIsSendModalOpen(true)}
                      className="py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                      Send
                    </button>
                    <button className="py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-semibold flex items-center justify-center gap-2">
                      <ArrowDownLeft className="w-5 h-5" />
                      Receive
                    </button>
                    <button className="py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-semibold flex items-center justify-center gap-2">
                      <ArrowLeftRight className="w-5 h-5" />
                      Swap
                    </button>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex-1 bg-white/5 rounded-3xl border border-white/10 p-6"
                >
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <h3 className="text-lg font-bold">Assets</h3>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5" />
                        <input 
                          type="text" 
                          placeholder="Filter assets..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-xl py-1.5 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm w-40 md:w-48"
                        />
                      </div>
                      <button className="text-sm text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors">
                        View all <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {assets
                      .filter(asset => 
                        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((asset, index) => (
                        <AssetRow 
                          key={index}
                          {...asset}
                        />
                      ))
                    }
                    {assets.filter(asset => 
                      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                      <EmptyState 
                        title="No assets found"
                        description={searchQuery ? `We couldn't find any assets matching "${searchQuery}".` : "Your wallet is currently empty. Start by adding some funds."}
                        icon={<Wallet className="w-8 h-8" />}
                        action={searchQuery ? "Clear Search" : "Add Funds"}
                        onAction={() => searchQuery ? setSearchQuery('') : console.log('Deposit funds requested')}
                      />
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Folk NFTs & Activity */}
              <div className="md:col-span-4 flex flex-col gap-6">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 rounded-3xl border border-white/10 p-6 overflow-hidden"
                >
                  <h3 className="text-lg font-bold mb-4">Folk Art NFTs</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <NFTCard id="042" emoji="👨🌾" color="from-indigo-500/20 to-purple-500/20" />
                    <NFTCard id="119" emoji="🏡" color="from-emerald-500/20 to-teal-500/20" />
                    <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden relative group text-2xl flex items-center justify-center">
                       🧶
                    </div>
                    <div className="aspect-square border border-dashed border-white/20 rounded-xl flex items-center justify-center text-gray-500 text-xs text-center p-4">
                      Mint more from Folk Club
                    </div>
                  </div>
                  <button className="w-full mt-4 py-2 border border-white/10 hover:bg-white/5 transition-colors rounded-xl text-sm">Open Collection</button>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 bg-white/5 rounded-3xl border border-white/10 p-6"
                >
                  <h3 className="text-lg font-bold mb-4 uppercase tracking-widest text-[10px] text-gray-500">Recent Folk Activity</h3>
                  <div className="space-y-4">
                    <ActivityRow 
                      title="Swapped ETH for SOL" 
                      time="2 hours ago" 
                      icon={<ArrowLeftRight className="w-4 h-4" />} 
                      iconColor="bg-blue-500/20 text-blue-400"
                    />
                    <ActivityRow 
                      title="Joined 'Baker's Pool'" 
                      time="Yesterday" 
                      icon={<Users className="w-4 h-4" />} 
                      iconColor="bg-purple-500/20 text-purple-400"
                    />
                    <ActivityRow 
                      title="Received 0.05 BTC" 
                      time="Jan 12, 2024" 
                      icon={<ArrowDownLeft className="w-4 h-4" />} 
                      iconColor="bg-green-500/20 text-green-400"
                      opacity="opacity-50"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="transactions-view"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="p-4 md:p-8 flex-1 flex flex-col gap-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Transaction History</h2>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-hidden shrink-0">
                  {['All', 'Sent', 'Received', 'Swapped'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTxFilter(filter as any)}
                      className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                        txFilter === filter 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-white/5 rounded-3xl border border-white/10 overflow-hidden flex flex-col">
                <div className="overflow-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Transaction</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <AnimatePresence mode="popLayout">
                        {filteredTransactions.map((tx) => (
                          <React.Fragment key={tx.id}>
                            <motion.tr 
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => setExpandedTxId(expandedTxId === tx.id ? null : tx.id)}
                              className={`hover:bg-white/5 transition-colors cursor-pointer group ${expandedTxId === tx.id ? 'bg-white/5' : ''}`}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full ${tx.iconColor} flex items-center justify-center shrink-0`}>
                                    {tx.icon}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{tx.title}</span>
                                    <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${expandedTxId === tx.id ? 'rotate-180' : ''}`} />
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-mono text-sm">{tx.amount}</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold uppercase rounded-full border border-green-500/20">
                                  {tx.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-xs text-gray-500 uppercase tracking-tight">{tx.time}</td>
                            </motion.tr>
                            
                            <AnimatePresence>
                              {expandedTxId === tx.id && (
                                <motion.tr
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="bg-white/[0.03] overflow-hidden"
                                >
                                  <td colSpan={4} className="px-6 py-6 border-b border-white/5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                      {/* Left Stats */}
                                      <div className="space-y-6">
                                        <div>
                                          <p className="text-[10px] font-bold text-blue-500 uppercase mb-2 tracking-widest">Transaction Details</p>
                                          <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                              <span className="text-gray-500">Method</span>
                                              <span className="text-gray-300 font-medium">{tx.type}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                              <span className="text-gray-500">Network</span>
                                              <span className="text-gray-300 font-medium">{tx.network}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                              <span className="text-gray-500">Confirmations</span>
                                              <span className="text-green-400 font-medium">1,241 (Finalized)</span>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/5">
                                          <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Fee Management</p>
                                          <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                              <span className="text-gray-500">Gas Used</span>
                                              <span className="text-gray-300 font-mono">{tx.gasUsed}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                              <span className="text-gray-500">Gas Price</span>
                                              <span className="text-gray-300 font-mono">{tx.gasPrice}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Middle: Addresses */}
                                      <div className="space-y-6">
                                        <div>
                                          <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Route Info</p>
                                          <div className="bg-black/20 rounded-2xl p-4 border border-white/5 space-y-4">
                                            <div>
                                              <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] text-gray-500 font-bold uppercase">From</span>
                                                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                                                  <Copy className="w-3 h-3" />
                                                </button>
                                              </div>
                                              <p className="text-xs font-mono text-gray-300 break-all">{address || '0x4f...e3a2'}</p>
                                            </div>
                                            <div className="flex justify-center">
                                              <div className="w-px h-4 bg-white/10 relative">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A0B0D] p-0.5">
                                                  <ChevronDown className="w-3 h-3 text-gray-500" />
                                                </div>
                                              </div>
                                            </div>
                                            <div>
                                              <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] text-gray-500 font-bold uppercase">To</span>
                                                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                                                  <Copy className="w-3 h-3" />
                                                </button>
                                              </div>
                                              <p className="text-xs font-mono text-gray-300 break-all">{tx.to}</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Right: Actions & Hash */}
                                      <div className="space-y-6 lg:pl-4">
                                        <div>
                                          <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Universal Hash</p>
                                          <div className="flex items-center gap-2 group/hash bg-white/5 px-3 py-2 rounded-xl border border-white/10 hover:border-blue-500/30 transition-colors cursor-pointer">
                                            <p className="text-xs font-mono text-gray-300 group-hover/hash:text-blue-400 transition-colors">{tx.hash}</p>
                                            <ExternalLink className="w-3 h-3 text-gray-600 group-hover/hash:text-blue-400 ml-auto" />
                                          </div>
                                        </div>

                                        <div className="flex flex-col gap-2 pt-4">
                                          <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10">
                                            View on Explorer
                                            <ExternalLink className="w-3.5 h-3.5" />
                                          </button>
                                          <div className="grid grid-cols-2 gap-2">
                                            <button className="py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-white/10">
                                              Receipt
                                            </button>
                                            <button className="py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-white/10">
                                              Share
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </motion.tr>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        ))}
                      </AnimatePresence>
                      {filteredTransactions.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-12">
                            <EmptyState 
                              title="No history found"
                              description={searchQuery || txFilter !== 'All' ? "No transactions match your current filters." : "You haven't made any transactions yet."}
                              icon={<RefreshCcw className="w-8 h-8" />}
                              action={searchQuery || txFilter !== 'All' ? "Reset Filters" : "Make First Swap"}
                              onAction={() => {
                                setSearchQuery('');
                                setTxFilter('All');
                              }}
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Send Modal */}
      <AnimatePresence>
        {isSendModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSendModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#121417] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-bold">Send Tokens</h3>
                <button 
                  onClick={() => setIsSendModalOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Recipient */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-widest">Recipient Address</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="0x... or ENS name"
                      value={sendRecipient}
                      onChange={(e) => setSendRecipient(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                       <Users className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Amount</label>
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest cursor-pointer hover:text-blue-300">Max: 12.4 ETH</span>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-2xl font-mono text-white placeholder:text-white/20"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                       <span className="text-sm font-bold">ETH</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                    <span>Estimated value: ${sendAmount ? (parseFloat(sendAmount) * 2519.43).toLocaleString() : '0.00'}</span>
                    <span>Network Fee: ~$0.42</span>
                  </p>
                </div>

                {/* Summary Box */}
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Network</span>
                    <span className="text-gray-200">Base Mainnet</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Estimated Time</span>
                    <span className="text-green-400">~2 seconds</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-6 bg-white/[0.02] border-t border-white/10">
                <button 
                  disabled={!sendRecipient || !sendAmount}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20"
                >
                  Confirm Transaction
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
