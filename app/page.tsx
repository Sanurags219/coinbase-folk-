'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown, 
  WalletDropdownDisconnect, 
  WalletDropdownLink 
} from '@coinbase/onchainkit/wallet';
import { 
  Address, 
  Avatar, 
  Name, 
  Identity, 
  EthBalance 
} from '@coinbase/onchainkit/identity';
import { 
  Home, 
  LayoutDashboard, 
  Globe, 
  Users, 
  Bell, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowLeftRight, 
  RefreshCcw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FolkWalletPage() {
  const { isConnected, address } = useAccount();
  const [isReady, setIsReady] = useState(false);
  const [activeView, setActiveView] = useState<'assets' | 'transactions'>('assets');
  const [txFilter, setTxFilter] = useState<'All' | 'Sent' | 'Received' | 'Swapped'>('All');

  useEffect(() => {
    const initialize = async () => {
      await sdk.actions.ready();
    };
    if (!isReady) {
      initialize();
      setIsReady(true);
    }
  }, [isReady]);

  const transactions = [
    { id: 1, type: 'Swapped', title: 'Swapped ETH for SOL', time: '2 hours ago', amount: '0.5 ETH', status: 'Completed', icon: <ArrowLeftRight className="w-4 h-4" />, iconColor: 'bg-blue-500/20 text-blue-400' },
    { id: 2, type: 'Sent', title: 'Sent to 0x3...4b2', time: '5 hours ago', amount: '1.2 ETH', status: 'Completed', icon: <ArrowUpRight className="w-4 h-4" />, iconColor: 'bg-red-500/20 text-red-400' },
    { id: 3, type: 'Received', title: 'Received from 0x7...1a9', time: 'Yesterday', amount: '0.05 BTC', status: 'Completed', icon: <ArrowDownLeft className="w-4 h-4" />, iconColor: 'bg-green-500/20 text-green-400' },
    { id: 4, type: 'Swapped', title: 'Swapped USDC for wETH', time: '2 days ago', amount: '500 USDC', status: 'Completed', icon: <ArrowLeftRight className="w-4 h-4" />, iconColor: 'bg-blue-500/20 text-blue-400' },
    { id: 5, type: 'Sent', title: 'Sent to 0x1...8f3', time: '3 days ago', amount: '10.5 SOL', status: 'Completed', icon: <ArrowUpRight className="w-4 h-4" />, iconColor: 'bg-red-500/20 text-red-400' },
  ];

  const filteredTransactions = txFilter === 'All' 
    ? transactions 
    : transactions.filter(tx => tx.type === txFilter);

  return (
    <div className="flex h-screen w-full bg-[#0A0B0D] text-white font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-64 border-r border-white/10 flex-col p-6 shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45"></div>
          </div>
          <span className="text-xl font-bold tracking-tight">Folk Wallet</span>
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
            Community
          </a>
        </nav>

        <div className="mt-auto p-4 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl border border-white/5">
          <p className="text-xs text-blue-300 font-semibold mb-1 uppercase tracking-wider">Staking APY</p>
          <p className="text-lg font-bold">4.2% on ETH</p>
          <button className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg text-sm font-medium">Stake Now</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full text-sm font-mono border border-white/10 text-gray-300">
              {isConnected ? (
                <Address address={address} className="text-gray-300" />
              ) : (
                "Not Connected"
              )}
            </div>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-gray-400">Base Mainnet</span>
          </div>
          
          <div className="flex gap-4 items-center">
            <button className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="wallet-container">
              <Wallet>
                <ConnectWallet>
                  <Avatar className="h-10 w-10" />
                  <Name />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownLink
                    icon="wallet"
                    href="https://keys.coinbase.com"
                  >
                    Wallet
                  </WalletDropdownLink>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
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
                    <button className="py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-semibold flex items-center justify-center gap-2">
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
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Assets</h3>
                    <button className="text-sm text-blue-400 flex items-center gap-1">
                      View all <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <AssetRow 
                      name="Ethereum" 
                      symbol="ETH" 
                      amount="12.4" 
                      value="$31,241.02" 
                      change="+1.2%" 
                      color="bg-[#627EEA]" 
                      icon="Ξ" 
                    />
                    <AssetRow 
                      name="Bitcoin" 
                      symbol="BTC" 
                      amount="0.14" 
                      value="$8,921.45" 
                      change="-0.4%" 
                      changeColor="text-red-400"
                      color="bg-[#F7931A]" 
                      icon="₿" 
                    />
                    <AssetRow 
                      name="Solana" 
                      symbol="SOL" 
                      amount="18.2" 
                      value="$1,906.74" 
                      change="+5.8%" 
                      color="bg-[#14F195]" 
                      icon="S"
                      iconClass="text-black"
                    />
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
                          <motion.tr 
                            layout
                            key={tx.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hover:bg-white/5 transition-colors cursor-pointer group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${tx.iconColor} flex items-center justify-center shrink-0`}>
                                  {tx.icon}
                                </div>
                                <span className="font-medium">{tx.title}</span>
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
                        ))}
                      </AnimatePresence>
                      {filteredTransactions.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center text-gray-500 italic">
                            No transactions found for this filter.
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
    </div>
  );
}

function AssetRow({ name, symbol, amount, value, change, color, icon, iconClass = "", changeColor = "text-green-400" }: any) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center font-bold ${iconClass}`}>
          {icon}
        </div>
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-xs text-gray-400">{amount} {symbol}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold">{value}</p>
        <p className={`text-xs ${changeColor}`}>{change}</p>
      </div>
    </div>
  );
}

function NFTCard({ id, emoji, color }: any) {
  return (
    <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden relative group cursor-pointer">
      <div className={`absolute inset-0 bg-gradient-to-br ${color}`}></div>
      <div className="absolute bottom-2 left-2 text-[10px] font-bold bg-black/50 px-1.5 py-0.5 rounded">#{id}</div>
      <div className="w-full h-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
        {emoji}
      </div>
    </div>
  );
}

function ActivityRow({ title, time, icon, iconColor, opacity = "" }: any) {
  return (
    <div className={`flex gap-3 ${opacity}`}>
      <div className={`w-8 h-8 rounded-full ${iconColor} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-tight">{time}</p>
      </div>
    </div>
  );
}
