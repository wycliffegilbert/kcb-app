export const USER = {
  name: 'Mary Mbiu',
  firstName: 'Mary',
  email: 'mary.mbiu@gmail.com',
  phone: '+254 706 670 976',
  memberId: 'KCB-2019-004821',
  address: 'Imara Daima, Nairobi, Kenya',
  dob: '25 July 1994',
  accountSince: 'January 2019',
  kycStatus: 'Verified',
  avatar: 'MM',
};

export const SAVINGS_GOALS = [
  { id:'sg001', name:'Emergency Fund',    emoji:'🛡️', current:850000,  target:1000000, color:'#006B3F' },
  { id:'sg002', name:'New Car',           emoji:'🚗', current:1200000, target:3500000, color:'#D4AF37' },
  { id:'sg003', name:'Holiday – Mombasa', emoji:'🏖️', current:145000,  target:280000,  color:'#2196F3' },
  { id:'sg004', name:'MacBook Pro',       emoji:'💻', current:178000,  target:320000,  color:'#9C27B0' },
];

export const SPENDING_CHART = [
  { month:'Sep', amount:320000 },
  { month:'Oct', amount:480000 },
  { month:'Nov', amount:295000 },
  { month:'Dec', amount:650000 },
  { month:'Jan', amount:410000 },
  { month:'Feb', amount:50000, current:true },
];

export const SETTINGS_MENU = [
  { id:'s1',  icon:'person-outline',           label:'Personal Information', screen:'Profile' },
  { id:'s2',  icon:'notifications-outline',    label:'Notifications',        toggle:true, value:true },
  { id:'s3',  icon:'finger-print-outline',     label:'Biometric Login',      toggle:true, value:true },
  { id:'s4',  icon:'shield-checkmark-outline', label:'Security & Privacy',   screen:'Security' },
  { id:'s5',  icon:'card-outline',             label:'Manage Cards',         screen:'Cards' },
  { id:'s6',  icon:'language-outline',         label:'Language',             value:'English (Kenya)' },
  { id:'s7',  icon:'color-palette-outline',    label:'Appearance',           value:'Light Mode' },
  { id:'s8',  icon:'help-circle-outline',      label:'Help & Support',       screen:'Help' },
  { id:'s9',  icon:'document-text-outline',    label:'Terms & Conditions',   screen:'Terms' },
  { id:'s10', icon:'log-out-outline',          label:'Logout',               danger:true },
];

export const formatCurrency = (amount) => {
  const abs = Math.abs(amount);
  return 'KES ' + abs.toLocaleString('en-KE', { minimumFractionDigits:2, maximumFractionDigits:2 });
};