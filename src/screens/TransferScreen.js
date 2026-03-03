import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, TextInput, Alert, KeyboardAvoidingView,
  Platform, Dimensions, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../data/theme';
import { useApp } from '../data/AppState';
import { USER, formatCurrency } from '../data/dummyData';

const { width } = Dimensions.get('window');

const CONTACTS = [
  { id:'c1', name:'John Otieno',  phone:'722111222', avatar:'JO', color:'#2196F3', bank:'Equity Bank', acc:'0023456781' },
  { id:'c2', name:'Mary Wanjiku', phone:'733222333', avatar:'MW', color:'#9C27B0', bank:'Co-op Bank',  acc:'0034567892' },
  { id:'c3', name:'Peter Kamau',  phone:'744333444', avatar:'PK', color:'#FF5722', bank:'KCB Bank',    acc:'1324554118' },
  { id:'c4', name:'Grace Akinyi', phone:'755444555', avatar:'GA', color:'#009688', bank:'Absa Bank',   acc:'0056789014' },
  { id:'c5', name:'David Mwangi', phone:'766555666', avatar:'DM', color:'#F44336', bank:'NCBA Bank',   acc:'0067890125' },
];

const BANKS = [
  { id:'b1', name:'KCB Bank',   logo:'🏦' }, { id:'b2', name:'Equity Bank', logo:'🏛️' },
  { id:'b3', name:'Co-op Bank', logo:'🏢' }, { id:'b4', name:'Absa Bank',   logo:'🔴' },
  { id:'b5', name:'NCBA Bank',  logo:'🟣' }, { id:'b6', name:'Stanchart',   logo:'🔵' },
  { id:'b7', name:'I&M Bank',   logo:'🟤' }, { id:'b8', name:'DTB Bank',    logo:'🟠' },
];

const BILLERS = [
  { id:'bl1', name:'KPLC Prepaid',   cat:'Electricity', icon:'⚡' },
  { id:'bl2', name:'KPLC Postpaid',  cat:'Electricity', icon:'💡' },
  { id:'bl3', name:'Nairobi Water',  cat:'Water',       icon:'💧' },
  { id:'bl4', name:'Zuku Fiber',     cat:'Internet',    icon:'📡' },
  { id:'bl5', name:'Safaricom Home', cat:'Internet',    icon:'📶' },
  { id:'bl6', name:'DSTV',           cat:'TV',          icon:'📺' },
  { id:'bl7', name:'GOtv',           cat:'TV',          icon:'🎬' },
  { id:'bl8', name:'Nairobi County', cat:'Government',  icon:'🏛️' },
];

const NETWORKS = [
  { id:'n1', name:'Safaricom', icon:'📱', color:'#4CAF50' },
  { id:'n2', name:'Airtel',    icon:'📲', color:'#FF0000' },
  { id:'n3', name:'Telkom',    icon:'☎️',  color:'#FF9800' },
];

// ── tiny helpers ─────────────────────────────────────────
function StepBar({ current, total, labels }) {
  return (
    <View style={{ flexDirection:'row', paddingHorizontal:16, paddingTop:20, paddingBottom:12 }}>
      {labels.map((lbl, i) => (
        <View key={i} style={{ flex:1, alignItems:'center', position:'relative' }}>
          {i < labels.length - 1 && (
            <View style={{ position:'absolute', top:15, left:'50%', right:'-50%', height:2,
              backgroundColor: i+1 < current ? COLORS.primary : COLORS.border, zIndex:0 }} />
          )}
          <View style={[st.stepCircle, i+1 <= current && st.stepOn]}>
            {i+1 < current
              ? <Ionicons name="checkmark" size={14} color="#fff" />
              : <Text style={[{ fontSize:13, fontWeight:'800', color:COLORS.textMuted }, i+1===current && { color:'#fff' }]}>{i+1}</Text>}
          </View>
          <Text style={[{ fontSize:10, color:COLORS.textMuted, fontWeight:'600', textAlign:'center' },
            i+1===current && { color:COLORS.primary, fontWeight:'800' }]}>{lbl}</Text>
        </View>
      ))}
    </View>
  );
}

function SRow({ label, value, bold, green }) {
  return (
    <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:11, borderBottomWidth:1, borderBottomColor:COLORS.border }}>
      <Text style={{ fontSize:13, color:COLORS.textMuted }}>{label}</Text>
      <Text style={[{ fontSize:13, fontWeight:'600', color:COLORS.text },
        bold && { fontSize:16, fontWeight:'900', color:COLORS.primary },
        green && { color:COLORS.green, fontWeight:'700' }]}>{value}</Text>
    </View>
  );
}

function AmtBox({ value, onChange }) {
  return (
    <View style={st.amtBox}>
      <Text style={st.amtPfx}>KES</Text>
      <TextInput style={st.amtField} placeholder="0.00" placeholderTextColor={COLORS.textMuted}
        keyboardType="numeric" value={value} onChangeText={onChange} />
    </View>
  );
}

function QuickBtns({ list, sel, onSel }) {
  return (
    <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:14 }}>
      {list.map(a => (
        <TouchableOpacity key={a} style={[st.qBtn, sel===a && st.qBtnOn]} onPress={() => onSel(a)}>
          <Text style={[{ fontSize:12, fontWeight:'700', color:COLORS.textSecondary }, sel===a && { color:'#fff' }]}>
            {parseInt(a).toLocaleString()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function PinRow({ value }) {
  return (
    <View style={{ flexDirection:'row', justifyContent:'center', gap:14, marginBottom:8 }}>
      {[0,1,2,3].map(i => (
        <View key={i} style={[{ width:14, height:14, borderRadius:7, backgroundColor:COLORS.border },
          i < value.length && { backgroundColor:COLORS.primary }]} />
      ))}
    </View>
  );
}

function SuccessScreen({ meta, onDone }) {
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(scale, { toValue:1, useNativeDriver:true, tension:60, friction:8 }).start();
  }, []);
  return (
    <View style={st.successWrap}>
      <Animated.View style={[st.successCircle, { transform:[{ scale }] }]}>
        <Ionicons name="checkmark" size={56} color="#fff" />
      </Animated.View>
      <Text style={st.successTitle}>{meta.title}</Text>
      <Text style={st.successAmt}>{formatCurrency(parseFloat(meta.amount)||0)}</Text>
      <Text style={st.successSub}>{meta.sub}</Text>
      <View style={st.refCard}>
        <Text style={{ fontSize:11, color:COLORS.textMuted, textTransform:'uppercase', letterSpacing:0.5, marginBottom:4 }}>Transaction Reference</Text>
        <Text style={{ fontSize:16, fontWeight:'900', color:COLORS.text, marginBottom:4 }}>{meta.ref}</Text>
        <Text style={{ fontSize:12, color:COLORS.textMuted }}>{new Date().toLocaleString('en-KE')}</Text>
      </View>
      <TouchableOpacity style={st.doneBtn} onPress={onDone}>
        <Text style={{ color:'#fff', fontSize:16, fontWeight:'900' }}>Done</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ flexDirection:'row', alignItems:'center', gap:8, paddingVertical:10 }}>
        <Ionicons name="share-social-outline" size={16} color={COLORS.primary} />
        <Text style={{ color:COLORS.primary, fontSize:14, fontWeight:'700' }}>Share Receipt</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── MAIN ────────────────────────────────────────────────
export default function TransferScreen({ route }) {
  const { accounts, executeTransfer } = useApp();

  const [flow,    setFlow]    = useState(null);
  const [step,    setStep]    = useState(1);
  const [txType,  setTxType]  = useState('mpesa');
  const [contact, setContact] = useState(null);
  const [bank,    setBank]    = useState(null);
  const [biller,  setBiller]  = useState(null);
  const [network, setNetwork] = useState(null);
  const [fromAcc, setFromAcc] = useState('checking');
  const [amount,  setAmount]  = useState('');
  const [phone,   setPhone]   = useState('');
  const [accNo,   setAccNo]   = useState('');
  const [note,    setNote]    = useState('');
  const [pin,     setPin]     = useState('');
  const [success, setSuccess] = useState(false);
  const [meta,    setMeta]    = useState({});

  useEffect(() => {
    if (route?.params?.initFlow) { setFlow(route.params.initFlow); setStep(1); }
  }, [route?.params?.initFlow, route?.params?.ts]);

  const reset = () => {
    setFlow(null); setStep(1); setTxType('mpesa'); setContact(null);
    setBank(null); setBiller(null); setNetwork(null); setFromAcc('checking');
    setAmount(''); setPhone(''); setAccNo(''); setNote(''); setPin(''); setSuccess(false);
  };

  const insufficient = amount && parseFloat(amount) > accounts[fromAcc]?.balance;

  const doConfirm = () => {
    if (pin.length < 4) { Alert.alert('Invalid PIN', 'Please enter your 4-digit PIN'); return; }
    if (pin !== '1234') { Alert.alert('Wrong PIN', 'Incorrect PIN.\n\nDemo PIN: 1234'); setPin(''); return; }
    const amt = parseFloat(amount);
    const acc = accounts[fromAcc];
    if (amt > acc.balance) {
      Alert.alert('Insufficient Funds',
        `Your ${acc.label} balance is ${formatCurrency(acc.balance)}.\nYou cannot send ${formatCurrency(amt)}.`);
      setPin(''); return;
    }
    const configs = {
      send:  { toName: contact?.name || `+254 ${phone}`, icon:'📱', color:'#4CAF50', category:'Transfer', note: note||'Send Money', title:'Transfer Successful!', sub:`Sent to ${contact?.name||`+254 ${phone}`}` },
      bills: { toName: biller?.name||'Bill Payment',     icon: biller?.icon||'🧾', color:'#9C27B0', category:'Bills', note:`${biller?.name} payment`, title:'Bill Paid!', sub:`Paid to ${biller?.name}` },
      topup: { toName:`${network?.name} Airtime`,        icon: network?.icon||'📱', color: network?.color||'#4CAF50', category:'Airtime', note:`${network?.name} airtime`, title:'Airtime Purchased!', sub:`${network?.name} • +254 ${phone}` },
      own:   { toName:`Own Transfer`,                    icon:'🔄', color:'#006B3F', category:'Transfer', note:'Own account transfer', title:'Transfer Successful!', sub:`From ${acc.label}` },
    };
    const c = configs[flow];
    const result = executeTransfer({ fromAccount:fromAcc, toName:c.toName, amount, type: flow==='own'?'transfer':'expense', icon:c.icon, color:c.color, category:c.category, note:c.note });
    if (!result.success) { Alert.alert('Error', result.error); return; }
    setMeta({ title:c.title, amount, sub:c.sub, ref:'KCB' + Math.random().toString(36).substring(2,10).toUpperCase() });
    setSuccess(true);
  };

  const titleMap = { send:'Send Money', receive:'Receive Money', bills:'Pay Bills', topup:'Buy Airtime', own:'Own Transfer' };

  if (success) return <SuccessScreen meta={meta} onDone={reset} />;

  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':undefined}>
      <View style={st.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

        {/* HEADER */}
        <View style={st.header}>
          {flow
            ? <TouchableOpacity onPress={step>1 ? ()=>setStep(p=>p-1) : reset} style={st.backBtn}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
            : <View style={{ width:38 }} />}
          <Text style={st.headerTitle}>{titleMap[flow]||'Transfer'}</Text>
          <View style={{ width:38 }} />
        </View>

        {/* ── MAIN MENU ── */}
        {!flow && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* LIVE BALANCE STRIP */}
            <View style={st.balStrip}>
              {Object.entries(accounts).map(([key, acc], i, arr) => (
                <React.Fragment key={key}>
                  <View style={st.balItem}>
                    <Text style={st.balLbl}>{acc.type === 'checking' ? 'Checking' : acc.type === 'savings' ? 'Savings' : 'Invest'}</Text>
                    <Text style={st.balVal} numberOfLines={1} adjustsFontSizeToFit>{formatCurrency(acc.balance)}</Text>
                  </View>
                  {i < arr.length - 1 && <View style={st.balDiv} />}
                </React.Fragment>
              ))}
            </View>

            <Text style={st.secTitle}>What would you like to do?</Text>
            <View style={st.menuGrid}>
              {[
                { key:'send',    icon:'send',            label:'Send Money',    sub:'M-Pesa / Bank',    color:'#006B3F', bg:'#e6f5ee' },
                { key:'receive', icon:'download',        label:'Receive Money', sub:'Get paid instantly',color:'#2196F3', bg:'#e3f2fd' },
                { key:'bills',   icon:'receipt',         label:'Pay Bills',     sub:'Utilities & more',  color:'#9C27B0', bg:'#f3e5f5' },
                { key:'topup',   icon:'phone-portrait',  label:'Buy Airtime',   sub:'Any network',       color:'#FF5722', bg:'#fbe9e7' },
                { key:'own',     icon:'swap-horizontal', label:'Own Transfer',  sub:'Between accounts',  color:'#D4AF37', bg:'#fffde7' },
              ].map(m => (
                <TouchableOpacity key={m.key} style={st.menuCard}
                  onPress={() => { setFlow(m.key); setStep(1); }}>
                  <View style={[st.menuIcon, { backgroundColor:m.bg }]}>
                    <Ionicons name={m.icon+'-outline'} size={26} color={m.color} />
                  </View>
                  <Text style={st.menuLabel}>{m.label}</Text>
                  <Text style={st.menuSub}>{m.sub}</Text>
                  <View style={[st.menuArrow, { backgroundColor:m.bg }]}>
                    <Ionicons name="arrow-forward" size={14} color={m.color} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={st.secTitle}>Recent Contacts</Text>
            <View style={st.listCard}>
              {CONTACTS.map((c, i) => (
                <TouchableOpacity key={c.id}
                  style={[st.contactRow, i < CONTACTS.length-1 && st.borderB]}
                  onPress={() => { setFlow('send'); setContact(c); setPhone(c.phone); setStep(2); }}>
                  <View style={[st.av, { backgroundColor:c.color }]}>
                    <Text style={st.avTxt}>{c.avatar}</Text>
                  </View>
                  <View style={{ flex:1 }}>
                    <Text style={st.cName}>{c.name}</Text>
                    <Text style={st.cSub}>+254 {c.phone} · {c.bank}</Text>
                  </View>
                  <View style={st.sendBtn}>
                    <Ionicons name="send" size={13} color={COLORS.primary} />
                    <Text style={{ fontSize:12, color:COLORS.primary, fontWeight:'700' }}>Send</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ height:24 }} />
          </ScrollView>
        )}

        {/* ── RECEIVE ── */}
        {flow==='receive' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding:16, gap:14 }}>
            <View style={st.card}>
              <Text style={st.cardTitle}>Your M-Pesa Number</Text>
              <Text style={{ fontSize:26, fontWeight:'900', color:COLORS.primary, marginBottom:4 }}>{USER.phone}</Text>
              <Text style={{ fontSize:13, color:COLORS.textMuted, marginBottom:20 }}>Share this to receive money</Text>
              <View style={{ alignItems:'center', padding:28, backgroundColor:COLORS.background, borderRadius:16, marginBottom:16 }}>
                <Text style={{ fontSize:72 }}>📱</Text>
                <Text style={{ fontWeight:'800', fontSize:16, color:COLORS.text }}>QR Code</Text>
                <Text style={{ color:COLORS.textMuted, fontSize:12 }}>Scan to pay me</Text>
              </View>
              <TouchableOpacity style={st.outlineBtn}>
                <Ionicons name="share-social-outline" size={18} color={COLORS.primary} />
                <Text style={st.outlineTxt}>Share Payment Details</Text>
              </TouchableOpacity>
            </View>
            <View style={st.card}>
              <Text style={st.cardTitle}>Bank Account Details</Text>
              {[
                ['Bank',           'KCB Bank Kenya'],
                ['Account Name',   USER.name],
                ['Account Number', accounts.checking.shortNumber],
                ['Branch',         'Imara Daima Branch'],
                ['Swift Code',     'KCBLKENX'],
              ].map(([l, v], i, a) => (
                <View key={i} style={{ flexDirection:'row', justifyContent:'space-between', paddingVertical:11,
                  borderBottomWidth: i < a.length-1 ? 1 : 0, borderBottomColor:COLORS.border }}>
                  <Text style={{ fontSize:13, color:COLORS.textMuted }}>{l}</Text>
                  <Text style={{ fontSize:13, fontWeight:'700', color:COLORS.text }}>{v}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {/* ── SEND MONEY ── */}
        {flow==='send' && (
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <StepBar current={step} total={3} labels={['Recipient','Amount','Confirm']} />
            <View style={{ paddingHorizontal:16 }}>

              {step===1 && (
                <>
                  {/* TYPE TOGGLE */}
                  <View style={st.typeTabs}>
                    {[{k:'mpesa',lbl:'📱  M-Pesa'},{k:'bank',lbl:'🏦  Bank Transfer'}].map(t => (
                      <TouchableOpacity key={t.k} style={[st.typeTab, txType===t.k && st.typeTabOn]}
                        onPress={() => setTxType(t.k)}>
                        <Text style={[st.typeTabTxt, txType===t.k && { color:COLORS.primary }]}>{t.lbl}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {txType==='mpesa' ? (
                    <>
                      <Text style={st.lbl}>Phone Number</Text>
                      <View style={st.phoneRow}>
                        <View style={st.flag}><Text style={{ fontSize:13 }}>🇰🇪 +254</Text></View>
                        <TextInput style={st.phoneInput} placeholder="7XX XXX XXX"
                          placeholderTextColor={COLORS.textMuted} keyboardType="phone-pad"
                          value={phone} onChangeText={setPhone} maxLength={9} />
                      </View>
                      <Text style={st.lbl}>Quick Select Contact</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:16 }}>
                        {CONTACTS.map(c => (
                          <TouchableOpacity key={c.id}
                            style={[st.chip, contact?.id===c.id && st.chipOn]}
                            onPress={() => { setContact(c); setPhone(c.phone); }}>
                            <View style={[st.chipAv, { backgroundColor:c.color }]}>
                              <Text style={{ color:'#fff', fontWeight:'800', fontSize:13 }}>{c.avatar}</Text>
                            </View>
                            <Text style={{ fontSize:11, fontWeight:'600', color:COLORS.text, textAlign:'center' }}>
                              {c.name.split(' ')[0]}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </>
                  ) : (
                    <>
                      <Text style={st.lbl}>Select Bank</Text>
                      <View style={st.bankGrid}>
                        {BANKS.map(b => (
                          <TouchableOpacity key={b.id} style={[st.bankChip, bank?.id===b.id && st.bankOn]}
                            onPress={() => setBank(b)}>
                            <Text style={{ fontSize:22, marginBottom:3 }}>{b.logo}</Text>
                            <Text style={{ fontSize:10, fontWeight:'600', color:COLORS.text, textAlign:'center' }}>{b.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      <Text style={st.lbl}>Account Number</Text>
                      <TextInput style={st.input} placeholder="Enter account number"
                        placeholderTextColor={COLORS.textMuted} keyboardType="numeric"
                        value={accNo} onChangeText={setAccNo} />
                    </>
                  )}

                  <TouchableOpacity style={[st.nextBtn, !(phone||accNo) && st.nextOff]}
                    onPress={() => (phone||accNo) && setStep(2)}>
                    <Text style={st.nextTxt}>Continue</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                </>
              )}

              {step===2 && (
                <>
                  {/* RECIPIENT BADGE */}
                  <View style={st.recipBadge}>
                    <View style={[st.av, { backgroundColor:contact?.color||COLORS.primary, width:50, height:50, borderRadius:25 }]}>
                      <Text style={[st.avTxt, { fontSize:17 }]}>{contact?.avatar||'👤'}</Text>
                    </View>
                    <View style={{ flex:1 }}>
                      <Text style={st.cName}>{contact?.name||'New Recipient'}</Text>
                      <Text style={st.cSub}>{txType==='mpesa' ? `+254 ${phone}` : `${bank?.name} · ${accNo}`}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setStep(1)}>
                      <Text style={{ color:COLORS.primary, fontSize:13, fontWeight:'700' }}>Edit</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={st.lbl}>From Account</Text>
                  {Object.entries(accounts).map(([key, acc]) => (
                    <TouchableOpacity key={key} style={[st.accRow, fromAcc===key && st.accRowOn]}
                      onPress={() => setFromAcc(key)}>
                      <View style={{ flex:1 }}>
                        <Text style={{ fontSize:13, fontWeight:'700', color:COLORS.text }}>{acc.label}</Text>
                        <Text style={{ fontSize:11, color:COLORS.textMuted }}>{acc.number}</Text>
                      </View>
                      <Text style={{ fontSize:13, fontWeight:'800', color:COLORS.primary }}>
                        {formatCurrency(acc.balance)}
                      </Text>
                      {fromAcc===key && <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} style={{ marginLeft:8 }} />}
                    </TouchableOpacity>
                  ))}

                  <Text style={st.lbl}>Amount (KES)</Text>
                  <AmtBox value={amount} onChange={setAmount} />

                  {insufficient && (
                    <View style={st.errBanner}>
                      <Ionicons name="warning" size={14} color={COLORS.red} />
                      <Text style={{ fontSize:12, color:COLORS.red, fontWeight:'700' }}>
                        Exceeds available balance ({formatCurrency(accounts[fromAcc].balance)})
                      </Text>
                    </View>
                  )}

                  <QuickBtns list={['500','1000','2000','5000','10000','20000']} sel={amount} onSel={setAmount} />

                  <Text style={st.lbl}>Note (Optional)</Text>
                  <TextInput style={st.input} placeholder="What's this for?"
                    placeholderTextColor={COLORS.textMuted} value={note} onChangeText={setNote} />

                  <TouchableOpacity style={[st.nextBtn, (!amount||insufficient) && st.nextOff]}
                    onPress={() => amount && !insufficient && setStep(3)}>
                    <Text style={st.nextTxt}>Review Transfer</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                </>
              )}

              {step===3 && (
                <>
                  <Text style={st.confirmTitle}>Review & Confirm</Text>
                  <View style={st.summCard}>
                    <SRow label="To"               value={contact?.name||`+254 ${phone}`} />
                    <SRow label="Via"              value={txType==='mpesa'?'M-Pesa':bank?.name||'Bank'} />
                    <SRow label="From"             value={accounts[fromAcc].label} />
                    <SRow label="Available Balance" value={formatCurrency(accounts[fromAcc].balance)} green />
                    <SRow label="Amount"           value={formatCurrency(parseFloat(amount)||0)} bold />
                    <SRow label="Fee"              value="KES 0.00" />
                    <SRow label="Balance After"    value={formatCurrency(accounts[fromAcc].balance-(parseFloat(amount)||0))} green />
                    {note ? <SRow label="Note" value={note} /> : null}
                  </View>

                  <Text style={st.lbl}>Enter 4-Digit PIN to Authorize</Text>
                  <TextInput style={st.pinInput} secureTextEntry keyboardType="numeric"
                    maxLength={4} value={pin} onChangeText={setPin}
                    textAlign="center" placeholder="••••" placeholderTextColor={COLORS.textMuted} />
                  <PinRow value={pin} />
                  <Text style={{ fontSize:12, color:COLORS.textMuted, textAlign:'center', marginBottom:16 }}>
                    Demo PIN: 1234
                  </Text>
                  <TouchableOpacity style={st.confirmBtn} onPress={doConfirm}>
                    <Ionicons name="shield-checkmark" size={18} color="#fff" />
                    <Text style={st.nextTxt}>Confirm & Send Money</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            <View style={{ height:40 }} />
          </ScrollView>
        )}

        {/* ── PAY BILLS ── */}
        {flow==='bills' && (
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <StepBar current={step} total={3} labels={['Biller','Amount','Confirm']} />
            <View style={{ paddingHorizontal:16 }}>
              {step===1 && (
                <>
                  <Text style={st.lbl}>Select Biller</Text>
                  <View style={st.billerGrid}>
                    {BILLERS.map(b => (
                      <TouchableOpacity key={b.id}
                        style={[st.billerCard, biller?.id===b.id && st.billerOn]}
                        onPress={() => setBiller(b)}>
                        <Text style={{ fontSize:28, marginBottom:4 }}>{b.icon}</Text>
                        <Text style={{ fontSize:10, fontWeight:'700', color:COLORS.text, textAlign:'center' }}>{b.name}</Text>
                        <Text style={{ fontSize:9, color:COLORS.textMuted }}>{b.cat}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity style={[st.nextBtn, !biller && st.nextOff]}
                    onPress={() => biller && setStep(2)}>
                    <Text style={st.nextTxt}>Continue</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                </>
              )}
              {step===2 && (
                <>
                  <View style={st.recipBadge}>
                    <Text style={{ fontSize:38 }}>{biller.icon}</Text>
                    <View style={{ flex:1 }}>
                      <Text style={st.cName}>{biller.name}</Text>
                      <Text style={st.cSub}>{biller.cat}</Text>
                    </View>
                  </View>
                  <Text style={st.lbl}>From Account</Text>
                  {Object.entries(accounts).map(([key, acc]) => (
                    <TouchableOpacity key={key} style={[st.accRow, fromAcc===key && st.accRowOn]}
                      onPress={() => setFromAcc(key)}>
                      <View style={{ flex:1 }}>
                        <Text style={{ fontSize:13, fontWeight:'700', color:COLORS.text }}>{acc.label}</Text>
                      </View>
                      <Text style={{ fontSize:13, fontWeight:'800', color:COLORS.primary }}>
                        {formatCurrency(acc.balance)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <Text style={st.lbl}>Account / Meter Number</Text>
                  <TextInput style={st.input} placeholder="Enter number"
                    placeholderTextColor={COLORS.textMuted} keyboardType="numeric"
                    value={accNo} onChangeText={setAccNo} />
                  <Text style={st.lbl}>Amount (KES)</Text>
                  <AmtBox value={amount} onChange={setAmount} />
                  <QuickBtns list={['500','1000','2000','5000']} sel={amount} onSel={setAmount} />
                  <TouchableOpacity style={[st.nextBtn, !amount && st.nextOff]}
                    onPress={() => amount && setStep(3)}>
                    <Text style={st.nextTxt}>Review Payment</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                </>
              )}
              {step===3 && (
                <>
                  <Text style={st.confirmTitle}>Review & Confirm</Text>
                  <View style={st.summCard}>
                    <SRow label="Biller"        value={biller.name} />
                    <SRow label="Account No."   value={accNo||'N/A'} />
                    <SRow label="From"          value={accounts[fromAcc].label} />
                    <SRow label="Balance"       value={formatCurrency(accounts[fromAcc].balance)} green />
                    <SRow label="Amount"        value={formatCurrency(parseFloat(amount)||0)} bold />
                    <SRow label="Balance After" value={formatCurrency(accounts[fromAcc].balance-(parseFloat(amount)||0))} green />
                  </View>
                  <Text style={st.lbl}>Enter PIN</Text>
                  <TextInput style={st.pinInput} secureTextEntry keyboardType="numeric"
                    maxLength={4} value={pin} onChangeText={setPin}
                    textAlign="center" placeholder="••••" placeholderTextColor={COLORS.textMuted} />
                  <PinRow value={pin} />
                  <Text style={{ fontSize:12, color:COLORS.textMuted, textAlign:'center', marginBottom:16 }}>Demo PIN: 1234</Text>
                  <TouchableOpacity style={st.confirmBtn} onPress={doConfirm}>
                    <Ionicons name="shield-checkmark" size={18} color="#fff" />
                    <Text style={st.nextTxt}>Confirm Payment</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            <View style={{ height:40 }} />
          </ScrollView>
        )}

        {/* ── BUY AIRTIME ── */}
        {flow==='topup' && (
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <StepBar current={step} total={3} labels={['Network','Amount','Confirm']} />
            <View style={{ paddingHorizontal:16 }}>
              {step===1 && (
                <>
                  <Text style={st.lbl}>Select Network</Text>
                  <View style={{ flexDirection:'row', gap:10, marginBottom:16 }}>
                    {NETWORKS.map(n => (
                      <TouchableOpacity key={n.id}
                        style={[st.netCard, network?.id===n.id && st.netCardOn]}
                        onPress={() => setNetwork(n)}>
                        <Text style={{ fontSize:36, marginBottom:6 }}>{n.icon}</Text>
                        <Text style={{ fontSize:13, fontWeight:'700', color:COLORS.text }}>{n.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={st.lbl}>Phone Number</Text>
                  <View style={st.phoneRow}>
                    <View style={st.flag}><Text style={{ fontSize:13 }}>🇰🇪 +254</Text></View>
                    <TextInput style={st.phoneInput} placeholder="7XX XXX XXX"
                      placeholderTextColor={COLORS.textMuted} keyboardType="phone-pad"
                      value={phone} onChangeText={setPhone} maxLength={9} />
                  </View>
                  <TouchableOpacity
                    style={{ flexDirection:'row', alignItems:'center', gap:6, marginBottom:16 }}
                    onPress={() => setPhone('712345678')}>
                    <Ionicons name="person-circle-outline" size={16} color={COLORS.primary} />
                    <Text style={{ fontSize:13, color:COLORS.primary, fontWeight:'700' }}>Buy for Myself</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[st.nextBtn, (!network||!phone) && st.nextOff]}
                    onPress={() => (network&&phone) && setStep(2)}>
                    <Text style={st.nextTxt}>Continue</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                </>
              )}
              {step===2 && (
                <>
                  <View style={st.recipBadge}>
                    <Text style={{ fontSize:38 }}>{network.icon}</Text>
                    <View style={{ flex:1 }}>
                      <Text style={st.cName}>{network.name} Airtime</Text>
                      <Text style={st.cSub}>+254 {phone}</Text>
                    </View>
                  </View>
                  <Text style={st.lbl}>From Account</Text>
                  {Object.entries(accounts).map(([key, acc]) => (
                    <TouchableOpacity key={key} style={[st.accRow, fromAcc===key && st.accRowOn]}
                      onPress={() => setFromAcc(key)}>
                      <View style={{ flex:1 }}>
                        <Text style={{ fontSize:13, fontWeight:'700', color:COLORS.text }}>{acc.label}</Text>
                      </View>
                      <Text style={{ fontSize:13, fontWeight:'800', color:COLORS.primary }}>
                        {formatCurrency(acc.balance)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <Text style={st.lbl}>Amount (KES)</Text>
                  <AmtBox value={amount} onChange={setAmount} />
                  <QuickBtns list={['50','100','200','500','1000','2000']} sel={amount} onSel={setAmount} />
                  <TouchableOpacity style={[st.nextBtn, !amount && st.nextOff]}
                    onPress={() => amount && setStep(3)}>
                    <Text style={st.nextTxt}>Review</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                </>
              )}
              {step===3 && (
                <>
                  <Text style={st.confirmTitle}>Review & Confirm</Text>
                  <View style={st.summCard}>
                    <SRow label="Network"       value={network.name} />
                    <SRow label="Phone"         value={`+254 ${phone}`} />
                    <SRow label="From"          value={accounts[fromAcc].label} />
                    <SRow label="Balance"       value={formatCurrency(accounts[fromAcc].balance)} green />
                    <SRow label="Amount"        value={formatCurrency(parseFloat(amount)||0)} bold />
                    <SRow label="Balance After" value={formatCurrency(accounts[fromAcc].balance-(parseFloat(amount)||0))} green />
                  </View>
                  <Text style={st.lbl}>Enter PIN</Text>
                  <TextInput style={st.pinInput} secureTextEntry keyboardType="numeric"
                    maxLength={4} value={pin} onChangeText={setPin}
                    textAlign="center" placeholder="••••" placeholderTextColor={COLORS.textMuted} />
                  <PinRow value={pin} />
                  <Text style={{ fontSize:12, color:COLORS.textMuted, textAlign:'center', marginBottom:16 }}>Demo PIN: 1234</Text>
                  <TouchableOpacity style={st.confirmBtn} onPress={doConfirm}>
                    <Ionicons name="shield-checkmark" size={18} color="#fff" />
                    <Text style={st.nextTxt}>Confirm Purchase</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            <View style={{ height:40 }} />
          </ScrollView>
        )}

        {/* ── OWN TRANSFER ── */}
        {flow==='own' && (
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <StepBar current={step} total={2} labels={['Details','Confirm']} />
            <View style={{ paddingHorizontal:16 }}>
              {step===1 && (
                <>
                  <Text style={st.lbl}>From Account</Text>
                  {Object.entries(accounts).map(([key, acc]) => (
                    <TouchableOpacity key={key} style={[st.accRow, fromAcc===key && st.accRowOn]}
                      onPress={() => setFromAcc(key)}>
                      <View style={{ flex:1 }}>
                        <Text style={{ fontSize:13, fontWeight:'700', color:COLORS.text }}>{acc.label}</Text>
                        <Text style={{ fontSize:11, color:COLORS.textMuted }}>{acc.number}</Text>
                      </View>
                      <Text style={{ fontSize:13, fontWeight:'800', color:COLORS.primary }}>
                        {formatCurrency(acc.balance)}
                      </Text>
                      {fromAcc===key && <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} style={{ marginLeft:8 }} />}
                    </TouchableOpacity>
                  ))}
                  <Text style={st.lbl}>Amount (KES)</Text>
                  <AmtBox value={amount} onChange={setAmount} />
                  {insufficient && (
                    <View style={st.errBanner}>
                      <Ionicons name="warning" size={14} color={COLORS.red} />
                      <Text style={{ fontSize:12, color:COLORS.red, fontWeight:'700' }}>
                        Exceeds available balance
                      </Text>
                    </View>
                  )}
                  <QuickBtns list={['500','1000','2000','5000','10000','20000']} sel={amount} onSel={setAmount} />
                  <TouchableOpacity style={[st.nextBtn, (!amount||insufficient) && st.nextOff]}
                    onPress={() => amount && !insufficient && setStep(2)}>
                    <Text style={st.nextTxt}>Review Transfer</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </TouchableOpacity>
                </>
              )}
              {step===2 && (
                <>
                  <Text style={st.confirmTitle}>Review & Confirm</Text>
                  <View style={st.summCard}>
                    <SRow label="From"          value={accounts[fromAcc].label} />
                    <SRow label="Balance"       value={formatCurrency(accounts[fromAcc].balance)} green />
                    <SRow label="Amount"        value={formatCurrency(parseFloat(amount)||0)} bold />
                    <SRow label="Balance After" value={formatCurrency(accounts[fromAcc].balance-(parseFloat(amount)||0))} green />
                  </View>
                  <Text style={st.lbl}>Enter PIN</Text>
                  <TextInput style={st.pinInput} secureTextEntry keyboardType="numeric"
                    maxLength={4} value={pin} onChangeText={setPin}
                    textAlign="center" placeholder="••••" placeholderTextColor={COLORS.textMuted} />
                  <PinRow value={pin} />
                  <Text style={{ fontSize:12, color:COLORS.textMuted, textAlign:'center', marginBottom:16 }}>Demo PIN: 1234</Text>
                  <TouchableOpacity style={st.confirmBtn} onPress={doConfirm}>
                    <Ionicons name="shield-checkmark" size={18} color="#fff" />
                    <Text style={st.nextTxt}>Confirm Transfer</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            <View style={{ height:40 }} />
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  container:    { flex:1, backgroundColor:COLORS.background },
  header:       { flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:COLORS.primary, paddingHorizontal:16, paddingTop:50, paddingBottom:20 },
  headerTitle:  { color:'#fff', fontSize:20, fontWeight:'900' },
  backBtn:      { width:38, height:38, borderRadius:12, backgroundColor:'rgba(255,255,255,0.15)', alignItems:'center', justifyContent:'center' },
  balStrip:     { margin:16, backgroundColor:'#fff', borderRadius:16, padding:16, flexDirection:'row', elevation:3, shadowColor:'#006B3F', shadowOffset:{width:0,height:4}, shadowOpacity:0.1, shadowRadius:12, borderWidth:1, borderColor:COLORS.border },
  balItem:      { flex:1, alignItems:'center' },
  balLbl:       { fontSize:10, color:COLORS.textMuted, fontWeight:'600', textTransform:'uppercase', letterSpacing:0.3, marginBottom:4 },
  balVal:       { fontSize:11, fontWeight:'800', color:COLORS.primary, textAlign:'center' },
  balDiv:       { width:1, backgroundColor:COLORS.border, marginHorizontal:8 },
  secTitle:     { fontSize:15, fontWeight:'800', color:COLORS.text, paddingHorizontal:16, marginBottom:10 },
  menuGrid:     { flexDirection:'row', flexWrap:'wrap', paddingHorizontal:16, gap:12, marginBottom:20 },
  menuCard:     { width:(width-44)/2, backgroundColor:'#fff', borderRadius:20, padding:16, elevation:3, shadowColor:'#006B3F', shadowOffset:{width:0,height:4}, shadowOpacity:0.1, shadowRadius:12, borderWidth:1, borderColor:COLORS.border, position:'relative' },
  menuIcon:     { width:54, height:54, borderRadius:16, alignItems:'center', justifyContent:'center', marginBottom:10 },
  menuLabel:    { fontSize:14, fontWeight:'800', color:COLORS.text, marginBottom:2 },
  menuSub:      { fontSize:12, color:COLORS.textMuted },
  menuArrow:    { position:'absolute', top:12, right:12, width:26, height:26, borderRadius:13, alignItems:'center', justifyContent:'center' },
  listCard:     { marginHorizontal:16, backgroundColor:'#fff', borderRadius:20, overflow:'hidden', elevation:3, shadowColor:'#006B3F', shadowOffset:{width:0,height:4}, shadowOpacity:0.1, shadowRadius:12, borderWidth:1, borderColor:COLORS.border },
  contactRow:   { flexDirection:'row', alignItems:'center', padding:16, gap:12 },
  borderB:      { borderBottomWidth:1, borderBottomColor:COLORS.border },
  av:           { width:42, height:42, borderRadius:21, alignItems:'center', justifyContent:'center' },
  avTxt:        { color:'#fff', fontWeight:'800', fontSize:14 },
  cName:        { fontSize:14, fontWeight:'700', color:COLORS.text },
  cSub:         { fontSize:12, color:COLORS.textMuted, marginTop:1 },
  sendBtn:      { flexDirection:'row', alignItems:'center', gap:4, backgroundColor:COLORS.primaryTint||'#e6f5ee', borderRadius:20, paddingHorizontal:12, paddingVertical:6 },
  card:         { backgroundColor:'#fff', borderRadius:20, padding:20, elevation:3, shadowColor:'#006B3F', shadowOffset:{width:0,height:4}, shadowOpacity:0.1, shadowRadius:12, borderWidth:1, borderColor:COLORS.border },
  cardTitle:    { fontSize:15, fontWeight:'800', color:COLORS.text, marginBottom:8 },
  outlineBtn:   { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, borderWidth:1.5, borderColor:COLORS.primary, borderRadius:14, paddingVertical:12 },
  outlineTxt:   { fontSize:14, fontWeight:'700', color:COLORS.primary },
  stepCircle:   { width:32, height:32, borderRadius:16, backgroundColor:COLORS.background, borderWidth:2, borderColor:COLORS.border, alignItems:'center', justifyContent:'center', marginBottom:6, zIndex:2 },
  stepOn:       { backgroundColor:COLORS.primary, borderColor:COLORS.primary },
  typeTabs:     { flexDirection:'row', backgroundColor:COLORS.background, borderRadius:14, padding:4, marginBottom:16 },
  typeTab:      { flex:1, alignItems:'center', justifyContent:'center', paddingVertical:12, borderRadius:10 },
  typeTabOn:    { backgroundColor:'#fff', elevation:2 },
  typeTabTxt:   { fontSize:13, fontWeight:'700', color:COLORS.textMuted },
  lbl:          { fontSize:13, fontWeight:'700', color:COLORS.textSecondary||COLORS.text, marginBottom:8, marginTop:4 },
  input:        { backgroundColor:'#fff', borderRadius:14, paddingHorizontal:14, paddingVertical:14, fontSize:15, color:COLORS.text, marginBottom:14, borderWidth:1, borderColor:COLORS.border },
  phoneRow:     { flexDirection:'row', backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:COLORS.border, marginBottom:14, overflow:'hidden' },
  flag:         { paddingHorizontal:12, justifyContent:'center', borderRightWidth:1, borderRightColor:COLORS.border, backgroundColor:COLORS.background },
  phoneInput:   { flex:1, paddingHorizontal:14, paddingVertical:14, fontSize:15, color:COLORS.text },
  chip:         { alignItems:'center', marginRight:12, padding:8, borderRadius:14, borderWidth:1, borderColor:COLORS.border, backgroundColor:'#fff', width:72 },
  chipOn:       { borderColor:COLORS.primary, backgroundColor:COLORS.primaryTint||'#e6f5ee' },
  chipAv:       { width:40, height:40, borderRadius:20, alignItems:'center', justifyContent:'center', marginBottom:4 },
  bankGrid:     { flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:14 },
  bankChip:     { width:(width-32-28)/4, alignItems:'center', padding:10, borderRadius:12, borderWidth:1, borderColor:COLORS.border, backgroundColor:'#fff' },
  bankOn:       { borderColor:COLORS.primary, backgroundColor:COLORS.primaryTint||'#e6f5ee' },
  recipBadge:   { flexDirection:'row', alignItems:'center', gap:14, backgroundColor:'#fff', borderRadius:20, padding:16, marginBottom:16, elevation:2, borderWidth:1, borderColor:COLORS.border },
  accRow:       { flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:14, padding:14, borderWidth:1.5, borderColor:COLORS.border, marginBottom:8 },
  accRowOn:     { borderColor:COLORS.primary, backgroundColor:COLORS.primaryTint||'#e6f5ee' },
  amtBox:       { flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:14, borderWidth:1, borderColor:COLORS.border, marginBottom:12, overflow:'hidden' },
  amtPfx:       { paddingHorizontal:14, paddingVertical:16, fontSize:15, fontWeight:'700', color:COLORS.primary, borderRightWidth:1, borderRightColor:COLORS.border, backgroundColor:COLORS.primaryTint||'#e6f5ee' },
  amtField:     { flex:1, paddingHorizontal:14, fontSize:26, fontWeight:'900', color:COLORS.text },
  qBtn:         { paddingHorizontal:14, paddingVertical:8, borderRadius:20, borderWidth:1, borderColor:COLORS.border, backgroundColor:'#fff' },
  qBtnOn:       { backgroundColor:COLORS.primary, borderColor:COLORS.primary },
  errBanner:    { flexDirection:'row', alignItems:'center', gap:6, backgroundColor:'#fff0f0', borderRadius:10, padding:10, marginBottom:12, borderWidth:1, borderColor:COLORS.red+'40' },
  confirmTitle: { fontSize:18, fontWeight:'900', color:COLORS.text, marginBottom:14 },
  summCard:     { backgroundColor:'#fff', borderRadius:20, padding:16, marginBottom:16, elevation:2, borderWidth:1, borderColor:COLORS.border },
  pinInput:     { backgroundColor:'#fff', borderRadius:14, paddingVertical:16, fontSize:32, color:COLORS.text, borderWidth:1, borderColor:COLORS.border, letterSpacing:16, marginBottom:10 },
  nextBtn:      { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, backgroundColor:COLORS.primary, borderRadius:14, paddingVertical:16, marginTop:8, elevation:4, shadowColor:'#006B3F', shadowOffset:{width:0,height:4}, shadowOpacity:0.25, shadowRadius:12 },
  nextOff:      { opacity:0.4, elevation:0 },
  nextTxt:      { color:'#fff', fontSize:16, fontWeight:'800' },
  confirmBtn:   { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, backgroundColor:COLORS.primary, borderRadius:14, paddingVertical:16, marginTop:8, elevation:4, shadowColor:'#006B3F', shadowOffset:{width:0,height:4}, shadowOpacity:0.25, shadowRadius:12 },
  billerGrid:   { flexDirection:'row', flexWrap:'wrap', gap:10, marginBottom:14 },
  billerCard:   { width:(width-32-30)/4, alignItems:'center', padding:10, borderRadius:12, borderWidth:1, borderColor:COLORS.border, backgroundColor:'#fff' },
  billerOn:     { borderColor:COLORS.primary, backgroundColor:COLORS.primaryTint||'#e6f5ee' },
  netCard:      { flex:1, alignItems:'center', padding:18, borderRadius:16, borderWidth:1.5, borderColor:COLORS.border, backgroundColor:'#fff' },
  netCardOn:    { borderColor:COLORS.primary, backgroundColor:COLORS.primaryTint||'#e6f5ee' },
  successWrap:  { flex:1, backgroundColor:COLORS.background, justifyContent:'center', alignItems:'center', padding:32 },
  successCircle:{ width:110, height:110, borderRadius:55, backgroundColor:COLORS.green||'#006B3F', alignItems:'center', justifyContent:'center', marginBottom:28, elevation:12, shadowColor:'#006B3F', shadowOffset:{width:0,height:8}, shadowOpacity:0.35, shadowRadius:20 },
  successTitle: { fontSize:26, fontWeight:'900', color:COLORS.text, marginBottom:8 },
  successAmt:   { fontSize:38, fontWeight:'900', color:COLORS.primary, marginBottom:10 },
  successSub:   { fontSize:15, color:COLORS.textSecondary||COLORS.text, marginBottom:20 },
  refCard:      { backgroundColor:'#fff', borderRadius:16, padding:16, width:'100%', alignItems:'center', marginBottom:28, borderWidth:1, borderColor:COLORS.border },
  doneBtn:      { backgroundColor:COLORS.primary, borderRadius:14, paddingVertical:16, width:'100%', alignItems:'center', marginBottom:12, elevation:6, shadowColor:'#006B3F', shadowOffset:{width:0,height:6}, shadowOpacity:0.25, shadowRadius:16 },
});
