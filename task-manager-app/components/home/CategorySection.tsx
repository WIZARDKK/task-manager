import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CategorySectionProps {
  title: string;
  count: number;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, count }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title} ({count})
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
});

export default CategorySection;