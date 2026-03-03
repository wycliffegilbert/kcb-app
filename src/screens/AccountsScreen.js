import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../data/theme';
import { formatCurrency } from '../data/dummyData';
import { useApp } from '../data/AppState';

export default function AccountsScreen() {
  const { accounts, transactions, totalBalance } = useApp();
  const [visibility, setVisibility] = useState({
    total: true, checking: true, savings: true, investment: true,
  });

  const toggleVisibility = (key) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const accountList = [
    { key: 'checking',   data: accounts.checking,   gradient: ['#006B3F', '#004d2c', '#003020'], accentColor: '#22d3a0' },
    { key: 'savings',    data: accounts.savings,    gradient: ['#00a85a', '#006B3F', '#004030'], accentColor: '#4fffd4' },
    { key: 'investment', data: accounts.investment, gradient: ['#D4AF37', '#9a7c10', '#6a5000'], accentColor: '#f5e087' },
  ];

  const recentForAccount = (type) =>
    transactions.filter(t => t.account === type).slice(0, 3);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Accounts</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TOTAL NET WORTH */}
        <View style={styles.totalCard}>
          <View>
            <Text style={styles.totalLabel}>Total Net Worth</Text>
            <Text style={styles.totalValue}>
              {visibility.total ? formatCurrency(totalBalance) : 'KES ••••••••'}
            </Text>
            <Text style={styles.totalSub}>Across all accounts</Text>
          </View>
          <TouchableOpacity onPress={() => toggleVisibility('total')} style={styles.totalEye}>
            <Ionicons name={visibility.total ? 'eye-outline' : 'eye-off-outline'} size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* ACCOUNT CARDS */}
        {accountList.map(({ key, data, gradient, accentColor }) => (
          <View key={key} style={styles.accountCardWrap}>
            <View style={[styles.accountCard, { backgroundColor: gradient[0] }]}>
              <View style={styles.cardDec1} />
              <View style={styles.cardDec2} />
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.cardType}>{data.type.toUpperCase()}</Text>
                  <Text style={styles.cardLabel}>{data.label}</Text>
                </View>
                <TouchableOpacity onPress={() => toggleVisibility(key)} style={styles.cardEye}>
                  <Ionicons name={visibility[key] ? 'eye-outline' : 'eye-off-outline'} size={20} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
              </View>
              <Text style={styles.cardBalance}>
                {visibility[key] ? formatCurrency(data.balance) : 'KES ••••••'}
              </Text>
              <Text style={styles.cardNumber}>{data.number}</Text>
              <View style={styles.cardActions}>
                {['Send', 'Receive', 'Details'].map((action, i) => (
                  <TouchableOpacity key={i} style={[styles.cardActionBtn, { borderColor: accentColor + '50' }]}>
                    <Text style={[styles.cardActionText, { color: accentColor }]}>{action}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ACCOUNT DETAILS */}
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Account Number</Text>
                <Text style={styles.detailValue}>{visibility[key] ? data.shortNumber : '**** ****'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Currency</Text>
                <Text style={styles.detailValue}>{data.currency}</Text>
              </View>
              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.detailLabel}>Status</Text>
                <View style={styles.activeChip}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeText}>Active</Text>
                </View>
              </View>
            </View>

            {/* RECENT TXS */}
            {recentForAccount(key).length > 0 && (
              <View style={styles.recentCard}>
                <Text style={styles.recentTitle}>Recent Activity</Text>
                {recentForAccount(key).map((tx, i, arr) => (
                  <View key={tx.id} style={[styles.txItem, i < arr.length - 1 && styles.txBorder]}>
                    <View style={[styles.txIcon, { backgroundColor: tx.color + '20' }]}>
                      <Text>{tx.icon}</Text>
                    </View>
                    <View style={styles.txInfo}>
                      <Text style={styles.txName}>{tx.name}</Text>
                      <Text style={styles.txDate}>{tx.displayDate}</Text>
                    </View>
                    <Text style={[styles.txAmt, tx.type === 'income' ? styles.amtIn : styles.amtOut]}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.primary, paddingHorizontal: SPACING.base, paddingTop: 50, paddingBottom: SPACING.lg },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '900' },
  headerBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  totalCard: { marginHorizontal: SPACING.base, marginVertical: SPACING.base, backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.base, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...SHADOWS.sm, borderWidth: 1, borderColor: COLORS.border },
  totalLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 4 },
  totalValue: { fontSize: 24, fontWeight: '900', color: COLORS.text, marginBottom: 2 },
  totalSub: { fontSize: 11, color: COLORS.textMuted },
  totalEye: { width: 44, height: 44, borderRadius: 12, backgroundColor: COLORS.primaryTint, alignItems: 'center', justifyContent: 'center' },
  accountCardWrap: { marginHorizontal: SPACING.base, marginBottom: SPACING.lg },
  accountCard: { borderRadius: RADIUS.xl, padding: SPACING.lg, overflow: 'hidden', position: 'relative', ...SHADOWS.lg, marginBottom: 0 },
  cardDec1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)', top: -70, right: -60 },
  cardDec2: { position: 'absolute', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(0,0,0,0.1)', bottom: -40, left: -20 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, zIndex: 2 },
  cardType: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
  cardLabel: { color: '#fff', fontSize: 17, fontWeight: '900' },
  cardEye: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: 6, zIndex: 2 },
  cardBalance: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: -0.5, marginBottom: 8, zIndex: 2 },
  cardNumber: { color: 'rgba(255,255,255,0.35)', fontSize: 13, letterSpacing: 2, marginBottom: 20, zIndex: 2 },
  cardActions: { flexDirection: 'row', gap: 8, zIndex: 2 },
  cardActionBtn: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  cardActionText: { fontSize: 12, fontWeight: '700' },
  detailsCard: { backgroundColor: '#fff', padding: SPACING.base, borderTopWidth: 0, borderWidth: 1, borderColor: COLORS.border },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  detailLabel: { fontSize: 13, color: COLORS.textMuted },
  detailValue: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  activeChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.greenLight, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.green },
  activeText: { fontSize: 12, fontWeight: '700', color: COLORS.green },
  recentCard: { backgroundColor: '#fff', padding: SPACING.base, borderWidth: 1, borderTopWidth: 0, borderColor: COLORS.border, borderBottomLeftRadius: RADIUS.lg, borderBottomRightRadius: RADIUS.lg },
  recentTitle: { fontSize: 12, fontWeight: '800', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  txItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  txIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txName: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  txDate: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  txAmt: { fontSize: 13, fontWeight: '800' },
  amtIn: { color: COLORS.green },
  amtOut: { color: COLORS.red },
});