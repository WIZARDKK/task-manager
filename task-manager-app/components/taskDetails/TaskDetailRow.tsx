import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TaskDetailRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: string;
  valueColor?: string;
  onPress?: () => void;
  showChevron?: boolean;
}

const TaskDetailRow: React.FC<TaskDetailRowProps> = ({
  icon,
  iconColor,
  iconBgColor,
  label,
  value,
  valueColor = '#6B7280',
  onPress,
  showChevron = true,
}) => {
  const content = (
    <>
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
          <Ionicons name={icon} size={24} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
        </View>
      </View>

      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.container}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
  },
});

export default TaskDetailRow;