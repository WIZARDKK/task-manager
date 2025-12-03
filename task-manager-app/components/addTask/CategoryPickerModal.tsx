import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CategoryPickerModalProps {
  visible: boolean;
  selectedCategory: 'Work' | 'Personal';
  onClose: () => void;
  onSelectCategory: (category: 'Work' | 'Personal') => void;
}

const CategoryPickerModal: React.FC<CategoryPickerModalProps> = ({
  visible,
  selectedCategory,
  onClose,
  onSelectCategory,
}) => {
  const categories = [
    {
      value: 'Work' as const,
      label: 'Work',
      icon: 'briefcase' as const,
      color: '#2563EB',
      bgColor: '#EFF6FF',
      description: 'Professional tasks and projects',
    },
    {
      value: 'Personal' as const,
      label: 'Personal',
      icon: 'person' as const,
      color: '#10B981',
      bgColor: '#ECFDF5',
      description: 'Personal errands and activities',
    },
  ];

  const handleSelectCategory = (category: 'Work' | 'Personal') => {
    onSelectCategory(category);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Category Options */}
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.value && styles.categoryCardSelected,
                ]}
                onPress={() => handleSelectCategory(category.value)}
                activeOpacity={0.7}
              >
                {/* Icon Container */}
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: category.bgColor },
                  ]}
                >
                  <Ionicons
                    name={category.icon}
                    size={28}
                    color={category.color}
                  />
                </View>

                {/* Content */}
                <View style={styles.categoryContent}>
                  <View style={styles.categoryTitleRow}>
                    <Text style={styles.categoryLabel}>{category.label}</Text>
                    {selectedCategory === category.value && (
                      <View style={styles.checkmarkContainer}>
                        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Cancel Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  checkmarkContainer: {
    marginLeft: 8,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});

export default CategoryPickerModal;
