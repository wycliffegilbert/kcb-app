import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../data/theme';
import { useApp } from '../data/AppState';
import { USER, formatCurrency } from '../data/dummyData';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { accounts, transactions, totalBalance, incomeThisMonth, expensesThisMonth } = useApp();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning 🌅';
    if (h < 17) return 'Good afternoon ☀️';
    if (h < 21) return 'Good evening 🌆';
    return 'Good night 🌙';
  };

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* TOP BAR */}
      <View style={s.topBar}>
        <View style={s.topLeft}>
          <View style={s.logo}><Text style={s.logoTxt}>KCB</Text></View>
          <View>
            <Text style={s.greeting}>{getGreeting()}</Text>
            <Text style={s.userName}>{USER.firstName}</Text>
          </View>
        </View>
        <View style={s.topRight}>
          <TouchableOpacity style={s.iconBtn}>
            <Ionicons name="search-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color="#fff" />
            <View style={s.badge}><Text style={s.badgeTxt}>3</Text></View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HERO CARD */}
        <View style={s.hero}>
          <View style={s.dec1} /><View style={s.dec2} />
          <View style={{ zIndex: 2 }}>
            <View style={s.heroTop}>
              <View style={{ flex: 1 }}>
                <Text style={s.heroLbl}>Total Balance</Text>
                <View style={s.heroBalRow}>
                  <Text style={s.heroBal} numberOfLines={1} adjustsFontSizeToFit>
                    {balanceVisible ? formatCurrency(totalBalance) : 'KES ••••••••'}
                  </Text>
                  <TouchableOpacity onPress={() => setBalanceVisible(v => !v)} style={s.eyeBtn}>
                    <Ionicons name={balanceVisible ? 'eye-outline' : 'eye-off-outline'} size={20} color="rgba(255,255,255,0.7)" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={s.heroPill}><Text style={s.heroPillTxt}>All Accounts</Text></View>
            </View>
            <Text style={s.heroAccNum}>Acc: {accounts.checking.shortNumber}</Text>
            <View style={s.heroStats}>
              <View style={s.heroStat}>
                <View style={s.heroStatLbl}>
                  <Ionicons name="arrow-down-circle" size={13} color="#22d3a0" />
                  <Text style={s.heroStatLblTxt}>Income</Text>
                </View>
                <Text style={s.heroStatVal} numberOfLines={1}>
                  {balanceVisible ? formatCurrency(incomeThisMonth) : '••••••'}
                </Text>
              </View>
              <View style={s.heroDiv} />
              <View style={s.heroStat}>
                <View style={s.heroStatLbl}>
                  <Ionicons name="arrow-up-circle" size={13} color="#f76f6f" />
                  <Text style={s.heroStatLblTxt}>Expenses</Text>
                </View>
                <Text style={s.heroStatVal} numberOfLines={1}>
                  {balanceVisible ? formatCurrency(expensesThisMonth) : '••••••'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={s.quickActions}>
          {[
            { icon:'send',            label:'Send',      fn: () => navigation.navigate('Transfer', { initFlow:'send' }) },
            { icon:'download',        label:'Receive',   fn: () => navigation.navigate('Transfer', { initFlow:'receive' }) },
            { icon:'receipt',         label:'Pay Bills', fn: () => navigation.navigate('Transfer', { initFlow:'bills' }) },
            { icon:'phone-portrait',  label:'Airtime',   fn: () => navigation.navigate('Transfer', { initFlow:'topup' }) },
            { icon:'bar-chart',       label:'Invest',    fn: () => navigation.navigate('Accounts') },
            { icon:'shield-checkmark',label:'Insure',    fn: () => navigation.navigate('Accounts') },
            { icon:'cash',            label:'Loans',     fn: () => navigation.navigate('Accounts') },
            { icon:'grid',            label:'More',      fn: () => navigation.navigate('Profile') },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={s.qaBtn} onPress={item.fn}>
              <View style={s.qaIcon}>
                <Ionicons name={item.icon + '-outline'} size={22} color={COLORS.primary} />
              </View>
              <Text style={s.qaLbl}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ACCOUNT MINI CARDS */}
        <View style={s.secRow}>
          <Text style={s.secTitle}>My Accounts</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Accounts')}>
            <Text style={s.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft:16, marginBottom:16 }}>
          {Object.entries(accounts).map(([key, acc]) => (
            <View key={key} style={[s.miniCard, { backgroundColor: key==='checking' ? COLORS.primary : key==='savings' ? '#00a85a' : '#a07c10' }]}>
              <Text style={s.miniType}>{acc.type.toUpperCase()}</Text>
              <Text style={s.miniBal} numberOfLines={1} adjustsFontSizeToFit>
                {balanceVisible ? formatCurrency(acc.balance) : 'KES ••••••'}
              </Text>
              <Text style={s.miniNum}>{acc.number}</Text>
            </View>
          ))}
        </ScrollView>

        {/* RECENT TRANSACTIONS */}
        <View style={s.secRow}>
          <Text style={s.secTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={s.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={s.txCard}>
          {transactions.slice(0, 5).map((tx, i) => (
            <View key={tx.id} style={[s.txRow, i < 4 && s.txBorder]}>
              <View style={[s.txIcon, { backgroundColor: tx.color + '22' }]}>
                <Text style={{ fontSize:19 }}>{tx.icon}</Text>
              </View>
              <View style={{ flex:1 }}>
                <Text style={s.txName}>{tx.name}</Text>
                <Text style={s.txDate}>{tx.displayDate}</Text>
              </View>
              <Text style={[s.txAmt, tx.type==='income' ? s.amtIn : s.amtOut]}>
                {tx.type==='income' ? '+' : '-'} {formatCurrency(Math.abs(tx.amount))}
              </Text>
            </View>
          ))}
        </View>

        {/* PROMO */}
        <View style={s.promo}>
          <View style={{ flex:1 }}>
            <Text style={s.promoTitle}>KCB M-Pesa Loan</Text>
            <Text style={s.promoSub}>Get up to KES 1,000,000 instantly</Text>
            <TouchableOpacity style={s.promoBtn}>
              <Text style={s.promoBtnTxt}>Apply Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize:44 }}>🏦</Text>
        </View>
        <View style={{ height:24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex:1, backgroundColor:COLORS.background },
  topBar:       { flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:COLORS.primary, paddingHorizontal:16, paddingTop:50, paddingBottom:20 },
  topLeft:      { flexDirection:'row', alignItems:'center', gap:12 },
  logo:         { width:40, height:40, borderRadius:12, backgroundColor:'#fff', alignItems:'center', justifyContent:'center' },
  logoTxt:      { color:COLORS.primary, fontWeight:'900', fontSize:13 },
  greeting:     { color:'rgba(255,255,255,0.65)', fontSize:12, marginBottom:2 },
  userName:     { color:'#fff', fontWeight:'800', fontSize:16 },
  topRight:     { flexDirection:'row', gap:8 },
  iconBtn:      { width:38, height:38, borderRadius:12, backgroundColor:'rgba(255,255,255,0.15)', alignItems:'center', justifyContent:'center' },
  badge:        { position:'absolute', top:-3, right:-3, width:16, height:16, borderRadius:8, backgroundColor:COLORS.gold, alignItems:'center', justifyContent:'center' },
  badgeTxt:     { color:'#000', fontSize:9, fontWeight:'900' },
  hero:         { margin:16, borderRadius:24, overflow:'hidden', backgroundColor:COLORS.primary, elevation:10, shadowColor:'#006B3F', shadowOffset:{width:0,height:8}, shadowOpacity:0.25, shadowRadius:24, padding:20 },
  dec1:         { position:'absolute', width:200, height:200, borderRadius:100, backgroundColor:'rgba(255,255,255,0.04)', top:-60, right:-60 },
  dec2:         { position:'absolute', width:150, height:150, borderRadius:75, backgroundColor:'rgba(212,175,55,0.07)', bottom:-60, left:-30 },
  heroTop:      { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4, gap:8 },
  heroLbl:      { color:'rgba(255,255,255,0.6)', fontSize:12, marginBottom:4, textTransform:'uppercase', letterSpacing:0.5 },
  heroBalRow:   { flexDirection:'row', alignItems:'center', gap:8, flexShrink:1 },
  heroBal:      { color:'#fff', fontSize:24, fontWeight:'900', flexShrink:1 },
  eyeBtn:       { backgroundColor:'rgba(255,255,255,0.15)', borderRadius:8, padding:4 },
  heroPill:     { backgroundColor:'rgba(255,255,255,0.15)', borderRadius:20, paddingHorizontal:10, paddingVertical:4, borderWidth:1, borderColor:'rgba(255,255,255,0.25)' },
  heroPillTxt:  { color:'rgba(255,255,255,0.85)', fontSize:11, fontWeight:'700' },
  heroAccNum:   { color:'rgba(255,255,255,0.4)', fontSize:12, letterSpacing:1, marginBottom:16 },
  heroStats:    { flexDirection:'row', borderTopWidth:1, borderTopColor:'rgba(255,255,255,0.12)', paddingTop:14 },
  heroStat:     { flex:1 },
  heroDiv:      { width:1, backgroundColor:'rgba(255,255,255,0.12)', marginHorizontal:12 },
  heroStatLbl:  { flexDirection:'row', alignItems:'center', gap:4, marginBottom:3 },
  heroStatLblTxt:{ color:'rgba(255,255,255,0.55)', fontSize:11 },
  heroStatVal:  { color:'#fff', fontSize:13, fontWeight:'800' },
  quickActions: { flexDirection:'row', flexWrap:'wrap', paddingHorizontal:16, marginBottom:16, gap:8 },
  qaBtn:        { width:(width-32-24)/4, alignItems:'center', gap:7 },
  qaIcon:       { width:56, height:56, borderRadius:18, backgroundColor:'#fff', alignItems:'center', justifyContent:'center', elevation:3, shadowColor:'#006B3F', shadowOffset:{width:0,height:2}, shadowOpacity:0.08, shadowRadius:8, borderWidth:1, borderColor:COLORS.border },
  qaLbl:        { color:COLORS.textSecondary, fontSize:11, fontWeight:'600', textAlign:'center' },
  secRow:       { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:16, marginBottom:10 },
  secTitle:     { fontSize:15, fontWeight:'800', color:COLORS.text },
  seeAll:       { fontSize:13, color:COLORS.primary, fontWeight:'600' },
  miniCard:     { width:175, borderRadius:16, padding:16, marginRight:10 },
  miniType:     { color:'rgba(255,255,255,0.6)', fontSize:10, fontWeight:'700', textTransform:'uppercase', letterSpacing:0.5, marginBottom:6 },
  miniBal:      { color:'#fff', fontSize:15, fontWeight:'900', marginBottom:6 },
  miniNum:      { color:'rgba(255,255,255,0.4)', fontSize:11, letterSpacing:1 },
  txCard:       { marginHorizontal:16, backgroundColor:'#fff', borderRadius:20, overflow:'hidden', elevation:3, shadowColor:'#006B3F', shadowOffset:{width:0,height:4}, shadowOpacity:0.1, shadowRadius:16, marginBottom:16, borderWidth:1, borderColor:COLORS.border },
  txRow:        { flexDirection:'row', alignItems:'center', padding:16, gap:12 },
  txBorder:     { borderBottomWidth:1, borderBottomColor:COLORS.border },
  txIcon:       { width:44, height:44, borderRadius:14, alignItems:'center', justifyContent:'center' },
  txName:       { fontSize:13, fontWeight:'600', color:COLORS.text },
  txDate:       { fontSize:11, color:COLORS.textMuted, marginTop:2 },
  txAmt:        { fontSize:13, fontWeight:'800' },
  amtIn:        { color:COLORS.green },
  amtOut:       { color:COLORS.red },
  promo:        { marginHorizontal:16, backgroundColor:COLORS.primaryDark||COLORS.primary, borderRadius:20, padding:20, flexDirection:'row', justifyContent:'space-between', alignItems:'center', elevation:4, borderWidth:1, borderColor:'rgba(212,175,55,0.2)' },
  promoTitle:   { color:'#fff', fontSize:15, fontWeight:'800', marginBottom:4 },
  promoSub:     { color:'rgba(255,255,255,0.6)', fontSize:12, marginBottom:12 },
  promoBtn:     { backgroundColor:COLORS.gold||'#D4AF37', borderRadius:20, paddingHorizontal:16, paddingVertical:7, alignSelf:'flex-start' },
  promoBtnTxt:  { color:'#000', fontSize:12, fontWeight:'800' },
});
