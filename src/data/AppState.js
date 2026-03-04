import React, { createContext, useContext, useState } from 'react';

const initialAccounts = {
  checking: {
    id: 'acc-001', label: 'Checking Account', type: 'checking',
    number: '**** **** **** 4118', shortNumber: '1324554118',
    balance: 8276741.00, currency: 'KES', icon: '🏦',
  },
  savings: {
    id: 'acc-002', label: 'Savings Account', type: 'savings',
    number: '**** **** **** 3309', shortNumber: '1324554118',
    balance: 0.00, currency: 'KES', icon: '💰',
  },
  investment: {
    id: 'acc-003', label: 'Investment Portfolio', type: 'investment',
    number: '**** **** **** 7741', shortNumber: '1324554118',
    balance: 0.00, currency: 'KES', icon: '📈',
  },
};

const initialTransactions = [
  { id:'t001', name:'M-Pesa Transfer',      category:'Transfer',     type:'income',   amount:50000,  displayDate:'Today, 09:14 AM',     icon:'📱', color:'#4CAF50', account:'checking',   note:'Received from John Otieno' },
  { id:'t002', name:'Glovo Delivery',       category:'Food',         type:'expense',  amount:-3850,  displayDate:'Today, 08:32 AM',     icon:'🛵', color:'#FF5722', account:'checking',   note:'Food delivery' },
  { id:'t003', name:'Business Revenue',     category:'Income',       type:'income',   amount:20000,  displayDate:'Yesterday, 06:00 AM', icon:'💼', color:'#2196F3', account:'checking',   note:'Feb 2024 business income' },
  { id:'t004', name:'Zuku Fiber',           category:'Bills',        type:'expense',  amount:-4500,  displayDate:'Yesterday, 10:15 AM', icon:'📡', color:'#9C27B0', account:'checking',   note:'Monthly internet bill' },
  { id:'t005', name:'Java House',           category:'Food & Drink', type:'expense',  amount:-3200,  displayDate:'Feb 24, 1:30 PM',     icon:'☕', color:'#795548', account:'checking',   note:'Lunch with client' },
  { id:'t006', name:'KCB Savings Transfer', category:'Transfer',     type:'transfer', amount:-5000,  displayDate:'Feb 24, 9:00 AM',     icon:'🔄', color:'#006B3F', account:'checking',   note:'Monthly savings top-up' },
  { id:'t007', name:'Uber',                 category:'Transport',    type:'expense',  amount:-2850,  displayDate:'Feb 23, 7:45 PM',     icon:'🚗', color:'#607D8B', account:'checking',   note:'Ride to Imara Daima' },
  { id:'t008', name:'Freelance Payment',    category:'Income',       type:'income',   amount:2500,   displayDate:'Feb 22, 3:00 PM',     icon:'💻', color:'#009688', account:'checking',   note:'Web design project' },
  { id:'t009', name:'KCB Visa Bill',        category:'Bills',        type:'expense',  amount:-5000,  displayDate:'Feb 22, 12:00 PM',    icon:'💳', color:'#F44336', account:'checking',   note:'Credit card payment' },
  { id:'t010', name:'KPLC Token',           category:'Bills',        type:'expense',  amount:-5000,  displayDate:'Feb 21, 8:00 AM',     icon:'⚡', color:'#FFC107', account:'checking',   note:'Electricity top-up' },
  { id:'t011', name:'Netflix',              category:'Entertainment',type:'expense',  amount:-2200,  displayDate:'Feb 20, 12:00 AM',    icon:'🎬', color:'#E50914', account:'checking',   note:'Monthly subscription' },
  { id:'t012', name:'Safaricom Dividend',   category:'Income',       type:'income',   amount:8000,   displayDate:'Feb 19, 10:00 AM',    icon:'📊', color:'#4CAF50', account:'checking',   note:'Q4 2023 dividends' },
  { id:'t013', name:'Airtel Data Bundle',   category:'Utilities',    type:'expense',  amount:-1500,  displayDate:'Feb 18, 5:20 PM',     icon:'📶', color:'#FF0000', account:'checking',   note:'Monthly data bundle' },
  { id:'t014', name:'Rent – Imara Daima',   category:'Housing',      type:'expense',  amount:-25900, displayDate:'Feb 01, 8:00 AM',     icon:'🏠', color:'#3F51B5', account:'checking',   note:'February 2024 rent' },
  { id:'t015', name:'KCB Fixed Saving Plan',category:'Savings',      type:'income',   amount:0,      displayDate:'Feb 01, 6:00 AM',     icon:'🏛️', color:'#006B3F', account:'savings',    note:'Monthly interest earned' },
];

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [transactions, setTransactions] = useState(initialTransactions);

  const totalBalance = Object.values(accounts).reduce((s, a) => s + a.balance, 0);

  // Income = only income-type transactions (excludes t015 which is 0)
  const incomeThisMonth = transactions
    .filter(t => t.type === 'income' && t.amount > 0)
    .reduce((s, t) => s + t.amount, 0);

  // Expenses = sum of expense-type transactions, capped display at 50000
  const expensesThisMonth = transactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + Math.abs(t.amount), 0);

  const executeTransfer = ({ fromAccount, toName, amount, type, icon, color, category, note }) => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return { success: false, error: 'Invalid amount' };
    if (accounts[fromAccount].balance < amt) return { success: false, error: 'Insufficient funds' };

    setAccounts(prev => ({
      ...prev,
      [fromAccount]: { ...prev[fromAccount], balance: +(prev[fromAccount].balance - amt).toFixed(2) },
    }));

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
    setTransactions(prev => [{
      id: 'tx_' + Date.now(),
      name: toName, category, type: type || 'expense',
      amount: -amt, displayDate: `Today, ${timeStr}`,
      icon, color, account: fromAccount, note: note || '',
    }, ...prev]);

    return { success: true };
  };

  return (
    <AppContext.Provider value={{
      accounts, transactions, totalBalance,
      incomeThisMonth, expensesThisMonth, executeTransfer,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);