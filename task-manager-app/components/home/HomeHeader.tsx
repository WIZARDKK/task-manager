import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HomeHeaderProps {
  userName: string;
  userAvatar?: ImageSourcePropType;
  onSettingsPress: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  userName,
  userAvatar,
  onSettingsPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {userAvatar ? (
          <Image source={userAvatar} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={32} color="#9CA3AF" />
          </View>
        )}
      </View>

      <View style={styles.greetingSection}>
        <Text style={styles.greeting}>Good Morning, {userName}</Text>
      </View>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={onSettingsPress}
        activeOpacity={0.7}
      >
        <Ionicons name="settings-outline" size={28} color="#111827" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
  },
  leftSection: {
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F4D4B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: 36,
  },
  settingsButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeHeader;