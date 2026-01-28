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

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, amount: number, category: string, description?: string) => void;
}

const CATEGORIES = [
  { name: 'Food', icon: 'fast-food-outline' as const, color: COLORS.cardOrange },
  { name: 'Transport', icon: 'car-outline' as const, color: COLORS.cardBlue },
  { name: 'Shopping', icon: 'cart-outline' as const, color: COLORS.cardPink },
  { name: 'Bills', icon: 'receipt-outline' as const, color: COLORS.cardPurple },
  { name: 'Entertainment', icon: 'game-controller-outline' as const, color: COLORS.cardGreen },
  { name: 'Health', icon: 'medical-outline' as const, color: COLORS.cardRed },
  { name: 'Education', icon: 'school-outline' as const, color: COLORS.info },
  { name: 'Other', icon: 'ellipsis-horizontal-outline' as const, color: COLORS.gray400 },
];

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ visible, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string; amount?: string }>({});

  const handleSave = () => {
    const newErrors: { title?: string; amount?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(title.trim(), parseFloat(amount), selectedCategory, description.trim() || undefined);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setAmount('');
    setSelectedCategory('Food');
    setDescription('');
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
            <Text style={styles.headerTitle}>Add New Expense</Text>
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
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                placeholder="What did you spend on?"
                placeholderTextColor={COLORS.gray400}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errors.title) setErrors({ ...errors, title: undefined });
                }}
                accessibilityLabel="Expense title input"
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (Rs)</Text>
              <TextInput
                style={[styles.input, errors.amount && styles.inputError]}
                placeholder="0"
                placeholderTextColor={COLORS.gray400}
                value={amount}
                onChangeText={(text) => {
                  setAmount(text.replace(/[^0-9.]/g, ''));
                  if (errors.amount) setErrors({ ...errors, amount: undefined });
                }}
                keyboardType="numeric"
                accessibilityLabel="Expense amount input"
              />
              {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.name}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.name && {
                        backgroundColor: category.color,
                        borderColor: category.color,
                      },
                    ]}
                    onPress={() => setSelectedCategory(category.name)}
                    accessibilityLabel={`Select ${category.name} category`}
                    accessibilityRole="button"
                  >
                    <Ionicons
                      name={category.icon}
                      size={20}
                      color={selectedCategory === category.name ? COLORS.white : category.color}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === category.name && styles.categoryTextActive,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add additional details..."
                placeholderTextColor={COLORS.gray400}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                accessibilityLabel="Expense description input"
              />
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
              accessibilityLabel="Save expense"
              accessibilityRole="button"
            >
              <Text style={styles.saveButtonText}>Add Expense</Text>
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
    maxHeight: '90%',
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
  textArea: {
    minHeight: 80,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.caption,
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 6,
  },
  categoryText: {
    fontSize: SIZES.caption,
    color: COLORS.gray300,
    fontWeight: '500',
  },
  categoryTextActive: {
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

export default AddExpenseModal;
