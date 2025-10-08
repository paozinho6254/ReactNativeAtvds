import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getColdWarTanks, getTankImageUrl } from '../services/wikipedia';
import TankCard from '../components/TankCard';

// Paleta de cores para um tema moderno
const COLORS = {
  background: '#121212',
  card: '#1E1E1E',
  primaryText: '#EAEAEA',
  secondaryText: '#B0B0B0',
  accent: '#03DAC5',
};

const HomeScreen = ({ navigation }) => {
  const [tanks, setTanks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTanksData = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedTanks = await getColdWarTanks();

      const tanksWithImagesPromises = fetchedTanks.map(async (tank) => {
        const imageUrl = await getTankImageUrl(tank.title);
        return { ...tank, imageUrl };
      });

      const tanksWithImages = await Promise.all(tanksWithImagesPromises);

      setTanks(tanksWithImages);
    } catch (error) {
      console.error("Falha ao buscar dados dos tanques:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTanksData();
    }, [fetchTanksData])
  );

  const handlePressTank = (tank) => {
    navigation.navigate('TankDetails', { tankTitle: tank.title });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.loadingText}>Carregando Blindados...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tanques da Guerra Fria</Text>
      </View>
      <FlatList
        data={tanks}
        keyExtractor={(item) => String(item.pageid)}
        renderItem={({ item }) => (
          <TankCard item={item} onPress={() => handlePressTank(item)} />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.card,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.secondaryText,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen;