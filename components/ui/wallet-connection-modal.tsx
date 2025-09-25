import { BorderRadius, Responsive, Typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useBlockchain } from '@/hooks/useBlockchain';
import React from 'react';
import { ActivityIndicator, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from './icon-symbol';

const { width: screenWidth } = Dimensions.get('window');
const responsiveSpacing = Responsive.getSpacing(screenWidth);
const responsiveFonts = Responsive.getFontSizes(screenWidth);

interface WalletConnectionModalProps {
  visible: boolean;
  onClose: () => void;
  onConnect: () => void;
  bountyTitle?: string;
  bountyAmount?: number;
}

export function WalletConnectionModal({
  visible,
  onClose,
  onConnect,
  bountyTitle,
  bountyAmount,
}: WalletConnectionModalProps) {
  const { theme } = useTheme();
  const { connectWallet, isInitializing, isConnected } = useBlockchain();

  const handleConnectWallet = async () => {
    const success = await connectWallet();
    if (success) {
      onConnect();
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View 
            style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}
            entering={FadeInUp.springify()}
          >
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.colors.tabIconDefault }]}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <IconSymbol name="xmark" size={20} color={theme.colors.secondaryText} />
              </TouchableOpacity>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Connect Wallet
              </Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Animated.View entering={FadeInDown.delay(100).springify()}>
                <View style={styles.iconContainer}>
                  <View style={[styles.walletIconBg, { backgroundColor: theme.colors.tint + '20' }]}>
                    <IconSymbol name="wallet.pass" size={48} color={theme.colors.tint} />
                  </View>
                </View>

                <Text style={[styles.mainTitle, { color: theme.colors.text }]}>
                  Connect Your Aptos Wallet
                </Text>
                
                <Text style={[styles.description, { color: theme.colors.secondaryText }]}>
                  You need to connect your Aptos wallet to claim bounties and interact with the GitCare ecosystem.
                </Text>

                {bountyTitle && (
                  <View style={[styles.bountyInfo, { backgroundColor: theme.colors.cardBackground }]}>
                    <View style={styles.bountyHeader}>
                      <IconSymbol name="dollarsign.circle.fill" size={20} color={theme.colors.success} />
                      <Text style={[styles.bountyTitle, { color: theme.colors.text }]}>
                        Claiming Bounty
                      </Text>
                    </View>
                    <Text style={[styles.bountyDescription, { color: theme.colors.secondaryText }]} numberOfLines={2}>
                      {bountyTitle}
                    </Text>
                    {bountyAmount && (
                      <View style={styles.bountyAmount}>
                        <Text style={[styles.bountyAmountText, { color: theme.colors.success }]}>
                          ${bountyAmount} APT
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.features}>
                  <View style={styles.feature}>
                    <IconSymbol name="checkmark.circle.fill" size={20} color={theme.colors.success} />
                    <Text style={[styles.featureText, { color: theme.colors.text }]}>
                      Secure & Decentralized
                    </Text>
                  </View>
                  <View style={styles.feature}>
                    <IconSymbol name="checkmark.circle.fill" size={20} color={theme.colors.success} />
                    <Text style={[styles.featureText, { color: theme.colors.text }]}>
                      Fast Transactions
                    </Text>
                  </View>
                  <View style={styles.feature}>
                    <IconSymbol name="checkmark.circle.fill" size={20} color={theme.colors.success} />
                    <Text style={[styles.featureText, { color: theme.colors.text }]}>
                      Low Gas Fees
                    </Text>
                  </View>
                </View>
              </Animated.View>

              {/* Action Buttons */}
              <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.actions}>
                <TouchableOpacity
                  style={[styles.connectButton, { backgroundColor: theme.colors.tint }]}
                  onPress={handleConnectWallet}
                  disabled={isInitializing}
                >
                  {isInitializing ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <IconSymbol name="wallet.pass.fill" size={20} color="#FFFFFF" />
                  )}
                  <Text style={[styles.connectButtonText, { opacity: isInitializing ? 0.7 : 1 }]}>
                    {isInitializing ? 'Connecting...' : 'Connect Aptos Wallet'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.cancelButton, { backgroundColor: theme.colors.cardBackground }]}
                  onPress={onClose}
                  disabled={isInitializing}
                >
                  <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>
                    Maybe Later
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsiveSpacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveSpacing.lg,
    paddingVertical: responsiveSpacing.md,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.headline,
    fontWeight: '600',
  },
  content: {
    padding: responsiveSpacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: responsiveSpacing.lg,
  },
  walletIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    ...Typography.title2,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: responsiveSpacing.md,
  },
  description: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: responsiveSpacing.lg,
  },
  bountyInfo: {
    padding: responsiveSpacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: responsiveSpacing.lg,
  },
  bountyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.sm,
    marginBottom: responsiveSpacing.xs,
  },
  bountyTitle: {
    ...Typography.subheadline,
    fontWeight: '600',
  },
  bountyDescription: {
    ...Typography.body,
    marginBottom: responsiveSpacing.sm,
  },
  bountyAmount: {
    alignItems: 'flex-start',
  },
  bountyAmountText: {
    ...Typography.title3,
    fontWeight: '700',
  },
  features: {
    gap: responsiveSpacing.sm,
    marginBottom: responsiveSpacing.xl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing.sm,
  },
  featureText: {
    ...Typography.body,
  },
  actions: {
    gap: responsiveSpacing.md,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveSpacing.md,
    borderRadius: BorderRadius.md,
    gap: responsiveSpacing.sm,
  },
  connectButtonText: {
    ...Typography.headline,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: responsiveSpacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...Typography.body,
    fontWeight: '500',
  },
});