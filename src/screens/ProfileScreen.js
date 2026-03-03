import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Switch,
  StyleSheet, StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../data/theme';
import { USER, ACCOUNTS, formatCurrency } from '../data/dummyData';

const SETTINGS = [
  {
    title: 'Account',
    items: [
      { id: 's1', icon: 'person-circle-outline', label: 'Personal Information', type: 'arrow' },
      { id: 's2', icon: 'card-outline', label: 'Manage Cards', type: 'arrow' },
      { id: 's3', icon: 'document-text-outline', label: 'Bank Statements', type: 'arrow' },
      { id: 's4', icon: 'gift-outline', label: 'Rewards & Cashback', type: 'arrow', badge: 'New' },
    ],
  },
  {
    title: 'Security',
    items: [
      { id: 's5', icon: 'finger-print-outline', label: 'Biometric Login', type: 'toggle', defaultVal: true },
      { id: 's6', icon: 'notifications-outline', label: 'Push Notifications', type: 'toggle', defaultVal: true },
      { id: 's7', icon: 'shield-checkmark-outline', label: 'Two-Factor Auth', type: 'toggle', defaultVal: false },
      { id: 's8', icon: 'lock-closed-outline', label: 'Change PIN', type: 'arrow' },
      { id: 's9', icon: 'eye-off-outline', label: 'Change Password', type: 'arrow' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 's10', icon: 'language-outline', label: 'Language', type: 'value', value: 'English' },
      { id: 's11', icon: 'color-palette-outline', label: 'Appearance', type: 'value', value: 'Light' },
      { id: 's12', icon: 'cash-outline', label: 'Currency Display', type: 'value', value: 'KES' },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 's13', icon: 'help-circle-outline', label: 'Help Center', type: 'arrow' },
      { id: 's14', icon: 'chatbubble-outline', label: 'Chat with Support', type: 'arrow' },
      { id: 's15', icon: 'star-outline', label: 'Rate the App', type: 'arrow' },
      { id: 's16', icon: 'information-circle-outline', label: 'Terms & Privacy', type: 'arrow' },
    ],
  },
];

export default function ProfileScreen() {
  const [toggles, setToggles] = useState({ s5: true, s6: true, s7: false });
  const [activeSection, setActiveSection] = useState('profile');

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => {} },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* PROFILE SECTION TABS */}
      <View style={styles.sectionTabs}>
        <TouchableOpacity
          style={[styles.sTab, activeSection === 'profile' && styles.sTabActive]}
          onPress={() => setActiveSection('profile')}
        >
          <Text style={[styles.sTabText, activeSection === 'profile' && styles.sTabTextActive]}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sTab, activeSection === 'settings' && styles.sTabActive]}
          onPress={() => setActiveSection('settings')}
        >
          <Text style={[styles.sTabText, activeSection === 'settings' && styles.sTabTextActive]}>Settings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {activeSection === 'profile' ? (
          <>
            {/* AVATAR */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{USER.avatar}</Text>
                </View>
                <TouchableOpacity style={styles.avatarEditBtn}>
                  <Ionicons name="camera" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.profileName}>{USER.name}</Text>
              <Text style={styles.profileEmail}>{USER.email}</Text>
              <View style={styles.kycChip}>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.green} />
                <Text style={styles.kycText}>KYC Verified</Text>
              </View>
            </View>

            {/* PROFILE DETAILS */}
            <View style={styles.detailsCard}>
              <Text style={styles.detailsTitle}>Personal Details</Text>
              {[
                { label: 'Full Name', value: USER.name, icon: 'person-outline' },
                { label: 'Email', value: USER.email, icon: 'mail-outline' },
                { label: 'Phone', value: USER.phone, icon: 'call-outline' },
                { label: 'Date of Birth', value: USER.dob, icon: 'calendar-outline' },
                { label: 'Address', value: USER.address, icon: 'location-outline' },
                { label: 'Member Since', value: USER.accountSince, icon: 'time-outline' },
                { label: 'Member ID', value: USER.memberId, icon: 'id-card-outline' },
              ].map((item, i, arr) => (
                <View key={i} style={[styles.detailRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
                  <View style={styles.detailLeft}>
                    <View style={styles.detailIcon}>
                      <Ionicons name={item.icon} size={16} color={COLORS.primary} />
                    </View>
                    <View>
                      <Text style={styles.detailLabel}>{item.label}</Text>
                      <Text style={styles.detailValue}>{item.value}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                </View>
              ))}
            </View>

            {/* QUICK STATS */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>💳</Text>
                <Text style={styles.statValue}>3</Text>
                <Text style={styles.statLabel}>Accounts</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>📊</Text>
                <Text style={styles.statValue}>47</Text>
                <Text style={styles.statLabel}>Transactions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🎯</Text>
                <Text style={styles.statValue}>4</Text>
                <Text style={styles.statLabel}>Goals</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* SETTINGS SECTIONS */}
            {SETTINGS.map((section, si) => (
              <View key={si} style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>{section.title}</Text>
                <View style={styles.settingsCard}>
                  {section.items.map((item, i, arr) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.settingRow, i < arr.length - 1 && styles.settingBorder]}
                      onPress={() => {
                        if (item.type === 'toggle') return;
                        Alert.alert(item.label, 'This feature is coming soon.');
                      }}
                      activeOpacity={item.type === 'toggle' ? 1 : 0.7}
                    >
                      <View style={styles.settingLeft}>
                        <View style={styles.settingIconWrap}>
                          <Ionicons name={item.icon} size={18} color={COLORS.primary} />
                        </View>
                        <Text style={styles.settingLabel}>{item.label}</Text>
                        {item.badge && (
                          <View style={styles.badgeChip}>
                            <Text style={styles.badgeChipText}>{item.badge}</Text>
                          </View>
                        )}
                      </View>
                      {item.type === 'toggle' ? (
                        <Switch
                          value={toggles[item.id] ?? item.defaultVal}
                          onValueChange={val => setToggles(p => ({ ...p, [item.id]: val }))}
                          trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                          thumbColor={toggles[item.id] ? COLORS.primary : '#ccc'}
                        />
                      ) : item.type === 'value' ? (
                        <Text style={styles.settingValue}>{item.value}</Text>
                      ) : (
                        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            {/* LOGOUT */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.red} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>KCB Bank App v1.0.0</Text>
          </>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
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
  editBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },

  sectionTabs: {
    flexDirection: 'row', backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.base, paddingBottom: 12, gap: 8,
  },
  sTab: {
    flex: 1, paddingVertical: 8, borderRadius: 20, alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  sTabActive: { backgroundColor: '#fff' },
  sTabText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '700' },
  sTabTextActive: { color: COLORS.primary },

  avatarSection: { alignItems: 'center', paddingVertical: SPACING.xl },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: COLORS.gold,
  },
  avatarText: { color: '#fff', fontSize: 30, fontWeight: '900' },
  avatarEditBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  profileName: { fontSize: 22, fontWeight: '900', color: COLORS.text, marginBottom: 4 },
  profileEmail: { fontSize: 13, color: COLORS.textMuted, marginBottom: 10 },
  kycChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.greenLight, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  kycText: { fontSize: 12, fontWeight: '700', color: COLORS.green },

  detailsCard: {
    marginHorizontal: SPACING.base, backgroundColor: '#fff',
    borderRadius: RADIUS.lg, padding: SPACING.base,
    ...SHADOWS.sm, marginBottom: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },
  detailsTitle: { fontSize: 14, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  detailIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: COLORS.primaryTint, alignItems: 'center', justifyContent: 'center' },
  detailLabel: { fontSize: 11, color: COLORS.textMuted, marginBottom: 2 },
  detailValue: { fontSize: 13, fontWeight: '600', color: COLORS.text },

  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: SPACING.base, marginBottom: SPACING.md },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: RADIUS.lg,
    padding: SPACING.md, alignItems: 'center', gap: 4,
    ...SHADOWS.sm, borderWidth: 1, borderColor: COLORS.border,
  },
  statIcon: { fontSize: 24 },
  statValue: { fontSize: 20, fontWeight: '900', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.textMuted },

  settingsSection: { marginBottom: SPACING.md },
  settingsSectionTitle: {
    paddingHorizontal: SPACING.base, fontSize: 12,
    fontWeight: '800', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
  },
  settingsCard: {
    marginHorizontal: SPACING.base, backgroundColor: '#fff',
    borderRadius: RADIUS.lg, overflow: 'hidden',
    ...SHADOWS.sm, borderWidth: 1, borderColor: COLORS.border,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.base },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.primaryTint, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: 14, fontWeight: '500', color: COLORS.text, flex: 1 },
  settingValue: { fontSize: 13, color: COLORS.textMuted },
  badgeChip: { backgroundColor: COLORS.primaryTint, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeChipText: { fontSize: 10, fontWeight: '800', color: COLORS.primary },

  logoutBtn: {
    marginHorizontal: SPACING.base, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, padding: SPACING.base,
    backgroundColor: COLORS.redLight, borderRadius: RADIUS.lg,
    marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.red + '30',
  },
  logoutText: { fontSize: 15, fontWeight: '800', color: COLORS.red },
  versionText: { textAlign: 'center', fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md },
});
