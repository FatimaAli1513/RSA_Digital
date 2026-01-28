import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

interface AddCustomerModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, phone: string, balance: number) => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ visible, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [balance, setBalance] = useState('');
  const [balanceType, setBalanceType] = useState<'receive' | 'pay'>('receive');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  const handleSave = () => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.length < 10) {
      newErrors.phone = 'Enter a valid phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const numericBalance = parseFloat(balance) || 0;
    const finalBalance = balanceType === 'pay' ? -numericBalance : numericBalance;

    onSave(name.trim(), phone.trim(), finalBalance);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setPhone('');
    setBalance('');
    setBalanceType('receive');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add New Customer</Text>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              accessibilityLabel="Close modal"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Customer Name</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Enter customer name"
                placeholderTextColor={COLORS.gray400}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                accessibilityLabel="Customer name input"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="03XX XXXXXXX"
                placeholderTextColor={COLORS.gray400}
                value={phone}
                onChangeText={(text) => {
                  setPhone(text.replace(/[^0-9]/g, ''));
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                keyboardType="phone-pad"
                maxLength={11}
                accessibilityLabel="Phone number input"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Opening Balance (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={COLORS.gray400}
                value={balance}
                onChangeText={(text) => setBalance(text.replace(/[^0-9.]/g, ''))}
                keyboardType="numeric"
                accessibilityLabel="Opening balance input"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Balance Type</Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    balanceType === 'receive' && styles.toggleButtonActive,
                    balanceType === 'receive' && { backgroundColor: COLORS.success },
                  ]}
                  onPress={() => setBalanceType('receive')}
                  accessibilityLabel="To Receive"
                  accessibilityRole="button"
                >
                  <Ionicons
                    name="arrow-down-circle"
                    size={20}
                    color={balanceType === 'receive' ? COLORS.white : COLORS.gray400}
                  />
                  <Text
                    style={[
                      styles.toggleText,
                      balanceType === 'receive' && styles.toggleTextActive,
                    ]}
                  >
                    To Receive
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    balanceType === 'pay' && styles.toggleButtonActive,
                    balanceType === 'pay' && { backgroundColor: COLORS.error },
                  ]}
                  onPress={() => setBalanceType('pay')}
                  accessibilityLabel="To Pay"
                  accessibilityRole="button"
                >
                  <Ionicons
                    name="arrow-up-circle"
                    size={20}
                    color={balanceType === 'pay' ? COLORS.white : COLORS.gray400}
                  />
                  <Text
                    style={[
                      styles.toggleText,
                      balanceType === 'pay' && styles.toggleTextActive,
                    ]}
                  >
                    To Pay
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              accessibilityLabel="Cancel"
              accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              accessibilityLabel="Save customer"
              accessibilityRole="button"
            >
              <Text style={styles.saveButtonText}>Add Customer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: SIZES.padding,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 14,
    fontSize: SIZES.body,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.caption,
    marginTop: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  toggleButtonActive: {
    borderColor: 'transparent',
  },
  toggleText: {
    fontSize: SIZES.body,
    color: COLORS.gray400,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  footer: {
    flexDirection: 'row',
    padding: SIZES.padding,
    paddingBottom: 30,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: SIZES.radius,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.gray400,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.gray300,
  },
  saveButton: {
    flex: 1,
    padding: 14,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.cardBlue,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  saveButtonText: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default AddCustomerModal;
