import React, { useState } from 'react';
import { useApp } from '../data/AppState';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../data/theme';
import { SPENDING_CHART, formatCurrency } from '../data/dummyData';

const { width } = Dimensions.get('window');
const CHART_MAX = Math.max(...SPENDING_CHART.map(d => d.amount));
const TABS = ['All', 'Income', 'Expenses', 'Transfer', 'Summary'];

export default function TransactionsScreen() {
  const { transactions: TRANSACTIONS, incomeThisMonth: INCOME_THIS_MONTH, expensesThisMonth: EXPENSES_THIS_MONTH } = useApp();
  const [activeTab, setActiveTab] = useState('All');

  const filteredTx = TRANSACTIONS.filter(tx => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Income') return tx.type === 'income';
    if (activeTab === 'Expenses') return tx.type === 'expense';
    if (activeTab === 'Transfer') return tx.type === 'transfer';
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* SUMMARY TAB */}
        {activeTab === 'Summary' ? (
          <SummaryTab />
        ) : (
          <>
            {/* SUMMARY TOTALS ROW */}
            {(activeTab === 'All' || activeTab === 'Income') && (
              <View style={styles.summaryRow}>
                <View style={[styles.summaryCard, styles.summaryGreen]}>
                  <Ionicons name="arrow-down-circle" size={22} color={COLORS.green} />
                  <Text style={styles.summaryLabel}>Income</Text>
                  <Text style={[styles.summaryValue, { color: COLORS.green }]}>
                    {formatCurrency(INCOME_THIS_MONTH)}
                  </Text>
                </View>
                <View style={[styles.summaryCard, styles.summaryRed]}>
                  <Ionicons name="arrow-up-circle" size={22} color={COLORS.red} />
                  <Text style={styles.summaryLabel}>Expenses</Text>
                  <Text style={[styles.summaryValue, { color: COLORS.red }]}>
                    {formatCurrency(EXPENSES_THIS_MONTH)}
                  </Text>
                </View>
              </View>
            )}

            {/* TRANSACTION LIST */}
            <Text style={styles.monthLabel}>February 2024</Text>
            <View style={styles.txCard}>
              {filteredTx.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>📭</Text>
                  <Text style={styles.emptyText}>No transactions found</Text>
                </View>
              ) : filteredTx.map((tx, i) => (
                <View key={tx.id} style={[styles.txItem, i < filteredTx.length - 1 && styles.txBorder]}>
                  <View style={[styles.txIcon, { backgroundColor: tx.color + '20' }]}>
                    <Text style={styles.txEmoji}>{tx.icon}</Text>
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txName}>{tx.name}</Text>
                    <Text style={styles.txCategory}>{tx.category}</Text>
                    <Text style={styles.txDate}>{tx.displayDate}</Text>
                  </View>
                  <View style={styles.txRight}>
                    <Text style={[
                      styles.txAmount,
                      tx.type === 'income' ? styles.amountIn
                        : tx.type === 'transfer' ? styles.amountTransfer
                        : styles.amountOut
                    ]}>
                      {tx.type === 'income' ? '+' : tx.type === 'transfer' ? '↔' : '-'}{' '}
                      {formatCurrency(Math.abs(tx.amount))}
                    </Text>
                    <View style={[
                      styles.typePill,
                      tx.type === 'income' ? styles.pillGreen
                        : tx.type === 'transfer' ? styles.pillBlue
                        : styles.pillRed
                    ]}>
                      <Text style={styles.pillText}>
                        {tx.type === 'income' ? 'In' : tx.type === 'transfer' ? 'Transfer' : 'Out'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function SummaryTab() {
  const net = INCOME_THIS_MONTH - EXPENSES_THIS_MONTH;
  const categories = [
    { label: 'Housing', amount: 45000, icon: '🏠', color: '#3F51B5' },
    { label: 'Food', amount: 5050, icon: '🍽️', color: '#FF5722' },
    { label: 'Bills', amount: 25000, icon: '📋', color: '#9C27B0' },
    { label: 'Transport', amount: 850, icon: '🚗', color: '#607D8B' },
    { label: 'Entertainment', amount: 1100, icon: '🎬', color: '#E50914' },
    { label: 'Other', amount: 500, icon: '💳', color: '#F44336' },
  ];
  const totalCat = categories.reduce((s, c) => s + c.amount, 0);

  return (
    <View>
      {/* KEY STATS */}
      <View style={styles.summaryStats}>
        <View style={styles.summaryStatItem}>
          <Text style={styles.ssLabel}>Income</Text>
          <Text style={[styles.ssValue, { color: COLORS.green }]}>{formatCurrency(INCOME_THIS_MONTH)}</Text>
        </View>
        <View style={styles.summaryStatItem}>
          <Text style={styles.ssLabel}>Expenses</Text>
          <Text style={[styles.ssValue, { color: COLORS.red }]}>{formatCurrency(EXPENSES_THIS_MONTH)}</Text>
        </View>
        <View style={styles.summaryStatItem}>
          <Text style={styles.ssLabel}>Net</Text>
          <Text style={[styles.ssValue, { color: net >= 0 ? COLORS.green : COLORS.red }]}>
            {net >= 0 ? '+' : ''}{formatCurrency(net)}
          </Text>
        </View>
      </View>

      {/* BAR CHART */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Monthly Spending</Text>
        <Text style={styles.chartSub}>6-month overview • KES</Text>
        <View style={styles.barChart}>
          {SPENDING_CHART.map((item, i) => {
            const barH = (item.amount / CHART_MAX) * 100;
            return (
              <View key={i} style={styles.barWrap}>
                <Text style={styles.barValue}>
                  {item.amount >= 1000 ? `${(item.amount / 1000).toFixed(0)}K` : item.amount}
                </Text>
                <View style={styles.barOuter}>
                  <View style={[
                    styles.barFill,
                    { height: barH },
                    item.current && styles.barFillCurrent
                  ]} />
                </View>
                <Text style={[styles.barLabel, item.current && styles.barLabelCurrent]}>
                  {item.month}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
            <Text style={styles.legendText}>Previous months</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.gold }]} />
            <Text style={styles.legendText}>Current month</Text>
          </View>
        </View>
      </View>

      {/* SPENDING BY CATEGORY */}
      <Text style={styles.catTitle}>Spending by Category</Text>
      <View style={styles.txCard}>
        {categories.map((cat, i) => {
          const pct = ((cat.amount / totalCat) * 100).toFixed(0);
          return (
            <View key={i} style={[styles.catItem, i < categories.length - 1 && styles.txBorder]}>
              <View style={[styles.txIcon, { backgroundColor: cat.color + '20' }]}>
                <Text style={styles.txEmoji}>{cat.icon}</Text>
              </View>
              <View style={styles.catInfo}>
                <View style={styles.catRow}>
                  <Text style={styles.txName}>{cat.label}</Text>
                  <Text style={styles.catAmount}>{formatCurrency(cat.amount)}</Text>
                </View>
                <View style={styles.catBarOuter}>
                  <View style={[styles.catBarFill, { width: `${pct}%`, backgroundColor: cat.color }]} />
                </View>
                <Text style={styles.catPct}>{pct}% of spending</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primary, paddingHorizontal: SPACING.base,
    paddingTop: 50, paddingBottom: SPACING.lg,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '900' },
  filterBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },

  tabsWrapper: { backgroundColor: COLORS.primary, paddingBottom: 12 },
  tabs: { paddingHorizontal: SPACING.base, gap: 8 },
  tab: {
    paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  tabActive: { backgroundColor: '#fff' },
  tabText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '700' },
  tabTextActive: { color: COLORS.primary },

  summaryRow: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: SPACING.base, marginVertical: SPACING.md,
  },
  summaryCard: {
    flex: 1, borderRadius: RADIUS.lg, padding: SPACING.md,
    alignItems: 'flex-start', gap: 4, ...SHADOWS.sm,
    borderWidth: 1,
  },
  summaryGreen: { backgroundColor: COLORS.greenLight, borderColor: COLORS.green + '30' },
  summaryRed: { backgroundColor: COLORS.redLight, borderColor: COLORS.red + '30' },
  summaryLabel: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  summaryValue: { fontSize: 14, fontWeight: '800' },

  monthLabel: {
    paddingHorizontal: SPACING.base, fontSize: 12,
    color: COLORS.textMuted, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
  },

  txCard: {
    marginHorizontal: SPACING.base, backgroundColor: '#fff',
    borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOWS.sm,
    marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  txItem: { flexDirection: 'row', alignItems: 'flex-start', padding: SPACING.base, gap: 12 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  txIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  txEmoji: { fontSize: 20 },
  txInfo: { flex: 1 },
  txName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  txCategory: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  txDate: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  txRight: { alignItems: 'flex-end', gap: 4 },
  txAmount: { fontSize: 13, fontWeight: '800' },
  amountIn: { color: COLORS.green },
  amountOut: { color: COLORS.red },
  amountTransfer: { color: COLORS.blue },
  typePill: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  pillGreen: { backgroundColor: COLORS.greenLight },
  pillRed: { backgroundColor: COLORS.redLight },
  pillBlue: { backgroundColor: COLORS.blueLight },
  pillText: { fontSize: 10, fontWeight: '700', color: COLORS.textSecondary },

  emptyState: { padding: 40, alignItems: 'center' },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { color: COLORS.textMuted, fontSize: 14 },

  /* SUMMARY TAB */
  summaryStats: {
    flexDirection: 'row', gap: 8, paddingHorizontal: SPACING.base, marginVertical: SPACING.md,
  },
  summaryStatItem: {
    flex: 1, backgroundColor: '#fff', borderRadius: RADIUS.md,
    padding: SPACING.md, ...SHADOWS.sm, borderWidth: 1, borderColor: COLORS.border,
  },
  ssLabel: { fontSize: 11, color: COLORS.textMuted, marginBottom: 4 },
  ssValue: { fontSize: 15, fontWeight: '900' },

  chartCard: {
    marginHorizontal: SPACING.base, backgroundColor: '#fff',
    borderRadius: RADIUS.lg, padding: SPACING.lg,
    ...SHADOWS.sm, marginBottom: SPACING.base,
    borderWidth: 1, borderColor: COLORS.border,
  },
  chartTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  chartSub: { fontSize: 12, color: COLORS.textMuted, marginBottom: 20 },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 8 },
  barWrap: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 6 },
  barValue: { fontSize: 9, color: COLORS.textMuted, fontWeight: '600' },
  barOuter: {
    width: '100%', borderRadius: 6,
    backgroundColor: COLORS.background,
    height: 90, justifyContent: 'flex-end', overflow: 'hidden',
  },
  barFill: { width: '100%', borderRadius: 6, backgroundColor: COLORS.primaryLight },
  barFillCurrent: { backgroundColor: COLORS.gold },
  barLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '700' },
  barLabelCurrent: { color: COLORS.gold, fontWeight: '900' },
  chartLegend: { flexDirection: 'row', gap: 16, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: COLORS.border },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 3 },
  legendText: { fontSize: 12, color: COLORS.textSecondary },

  catTitle: {
    paddingHorizontal: SPACING.base, fontSize: 15, fontWeight: '800',
    color: COLORS.text, marginBottom: 10,
  },
  catItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.base, gap: 12 },
  catInfo: { flex: 1 },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  catAmount: { fontSize: 13, fontWeight: '800', color: COLORS.text },
  catBarOuter: { height: 5, backgroundColor: COLORS.background, borderRadius: 3, overflow: 'hidden', marginBottom: 3 },
  catBarFill: { height: '100%', borderRadius: 3 },
  catPct: { fontSize: 10, color: COLORS.textMuted },
});
