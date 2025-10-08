import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  card: '#1E1E1E',
  primaryText: '#EAEAEA',
  secondaryText: '#B0B0B0',
  placeholder: '#333333',
};

const TankCard = ({ item, onPress }) => {
  const { title, imageUrl } = item;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
      onPress={onPress}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <MaterialCommunityIcons name="tank" size={40} color={COLORS.secondaryText} />
        </View>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    margin: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 120,
  },
  placeholderContainer: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.placeholder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    padding: 12,
    height: 60,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primaryText,
    textAlign: 'center',
  },
});

export default TankCard;