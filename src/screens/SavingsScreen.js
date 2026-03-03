import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Modal, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../data/theme';
import { SAVINGS_GOALS, formatCurrency } from '../data/dummyData';
import { useApp } from '../data/AppState';

export default function SavingsScreen() {
  const { accounts } = useApp();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const savings = accounts.savings;
  const totalSaved = SAVINGS_GOALS.reduce((s, g) => s + g.current, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Savings</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* SAVINGS HERO */}
        <View style={styles.heroCard}>
          <View style={styles.heroInner}>
            <Text style={styles.heroLabel}>Savings Balance</Text>
            <View style={styles.heroBalRow}>
              <Text style={styles.heroBal}>
                {balanceVisible ? formatCurrency(savings.balance) : 'KES ••••••'}
              </Text>
              <TouchableOpacity
                onPress={() => setBalanceVisible(!balanceVisible)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={balanceVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={20} color="rgba(255,255,255,0.7)"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.heroAccNum}>{savings.number}</Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={styles.hsLabel}>Interest Rate</Text>
                <Text style={styles.hsValue}>7.5% p.a.</Text>
              </View>
              <View style={styles.hsDivider} />
              <View style={styles.heroStat}>
                <Text style={styles.hsLabel}>Earned This Month</Text>
                <Text style={styles.hsValue}>{formatCurrency(12000)}</Text>
              </View>
            </View>
          </View>
          <View style={styles.dec1} />
          <View style={styles.dec2} />
        </View>

        {/* GOALS TOTAL */}
        <View style={styles.goalsTotalCard}>
          <View>
            <Text style={styles.gtLabel}>Total Saved Across Goals</Text>
            <Text style={styles.gtValue}>{balanceVisible ? formatCurrency(totalSaved) : 'KES ••••••'}</Text>
          </View>
          <View style={styles.gtIcon}>
            <Ionicons name="trophy" size={28} color={COLORS.gold} />
          </View>
        </View>

        {/* GOALS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Savings Goals</Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Text style={styles.seeAll}>+ New Goal</Text>
          </TouchableOpacity>
        </View>

        {SAVINGS_GOALS.map(goal => {
          const pct = Math.min((goal.current / goal.target) * 100, 100);
          const remaining = goal.target - goal.current;
          return (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalLeft}>
                  <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                  <View>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalPct}>{pct.toFixed(0)}% complete</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.goalMenuBtn}>
                  <Ionicons name="ellipsis-horizontal" size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: goal.color }]} />
              </View>
              <View style={styles.goalFooter}>
                <View>
                  <Text style={styles.gfLabel}>Saved</Text>
                  <Text style={[styles.gfValue, { color: goal.color }]}>
                    {balanceVisible ? formatCurrency(goal.current) : '••••••'}
                  </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.gfLabel}>Remaining</Text>
                  <Text style={styles.gfValueGray}>
                    {balanceVisible ? formatCurrency(remaining) : '••••••'}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.gfLabel}>Target</Text>
                  <Text style={styles.gfValueGray}>
                    {balanceVisible ? formatCurrency(goal.target) : '••••••'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.addFundsBtn, { backgroundColor: goal.color + '15', borderColor: goal.color + '40' }]}>
                <Ionicons name="add-circle-outline" size={16} color={goal.color} />
                <Text style={[styles.addFundsTxt, { color: goal.color }]}>Add Funds</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* TIPS */}
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={22} color={COLORS.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Savings Tip</Text>
            <Text style={styles.tipText}>
              Setting up automatic transfers on payday can help you save consistently without thinking about it.
            </Text>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* NEW GOAL MODAL */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Savings Goal</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Goal Name</Text>
            <TextInput style={styles.input} placeholder="e.g. New Laptop" placeholderTextColor={COLORS.textMuted} />
            <Text style={styles.inputLabel}>Target Amount (KES)</Text>
            <TextInput style={styles.input} placeholder="e.g. 150,000" placeholderTextColor={COLORS.textMuted} keyboardType="numeric" />
            <Text style={styles.inputLabel}>Emoji Icon</Text>
            <TextInput style={styles.input} placeholder="e.g. 🎯" placeholderTextColor={COLORS.textMuted} />
            <TouchableOpacity style={styles.modalBtn} onPress={() => setShowModal(false)}>
              <Text style={styles.modalBtnText}>Create Goal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primary, paddingHorizontal: SPACING.base,
    paddingTop: 50, paddingBottom: SPACING.lg,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '900' },
  addBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },

  heroCard: {
    marginHorizontal: SPACING.base, marginTop: SPACING.base, marginBottom: SPACING.md,
    borderRadius: RADIUS.xl, overflow: 'hidden',
    backgroundColor: COLORS.primaryDark, ...SHADOWS.lg,
  },
  heroInner: { padding: SPACING.lg, zIndex: 2 },
  heroLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  heroBalRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  heroBal: { color: '#fff', fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
  eyeBtn: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: 4 },
  heroAccNum: { color: 'rgba(255,255,255,0.35)', fontSize: 13, letterSpacing: 2, marginBottom: 20 },
  heroStats: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)', paddingTop: 16 },
  heroStat: { flex: 1 },
  hsDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginHorizontal: 16 },
  hsLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 4 },
  hsValue: { color: '#fff', fontSize: 15, fontWeight: '800' },
  dec1: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.04)', top: -60, right: -50 },
  dec2: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(34,211,160,0.06)', bottom: -40, left: -20 },

  goalsTotalCard: {
    marginHorizontal: SPACING.base, backgroundColor: '#fff',
    borderRadius: RADIUS.lg, padding: SPACING.base,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    ...SHADOWS.sm, marginBottom: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  gtLabel: { color: COLORS.textMuted, fontSize: 12, marginBottom: 4 },
  gtValue: { color: COLORS.text, fontSize: 20, fontWeight: '900' },
  gtIcon: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#fffde7', alignItems: 'center', justifyContent: 'center' },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.base, marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },

  goalCard: {
    marginHorizontal: SPACING.base, marginBottom: SPACING.md,
    backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.base,
    ...SHADOWS.sm, borderWidth: 1, borderColor: COLORS.border,
  },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  goalLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  goalEmoji: { fontSize: 30 },
  goalName: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  goalPct: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  goalMenuBtn: { padding: 4 },
  progressBar: { height: 8, backgroundColor: COLORS.background, borderRadius: 4, overflow: 'hidden', marginBottom: 14 },
  progressFill: { height: '100%', borderRadius: 4 },
  goalFooter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  gfLabel: { fontSize: 11, color: COLORS.textMuted, marginBottom: 2 },
  gfValue: { fontSize: 14, fontWeight: '800' },
  gfValueGray: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  addFundsBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, borderRadius: 12, paddingVertical: 10, borderWidth: 1,
  },
  addFundsTxt: { fontSize: 13, fontWeight: '700' },

  tipCard: {
    marginHorizontal: SPACING.base, backgroundColor: '#fffde7',
    borderRadius: RADIUS.lg, padding: SPACING.base,
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    borderWidth: 1, borderColor: '#D4AF3740',
  },
  tipTitle: { fontSize: 13, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  tipText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: '#fff', borderRadius: 24,
    padding: SPACING.lg, paddingBottom: 36,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: COLORS.text },
  inputLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 6 },
  input: {
    backgroundColor: COLORS.background, borderRadius: RADIUS.sm,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: COLORS.text, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  modalBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md,
    paddingVertical: 16, alignItems: 'center', marginTop: 4,
  },
  modalBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});