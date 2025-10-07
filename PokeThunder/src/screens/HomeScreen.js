import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import api from "../services/api";

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchVehicle = async () => {
    if (!query) return;
    setLoading(true);
    try {
      // Normaliza termo
      const termo = query.trim().toLowerCase().replace(/\s+/g, "-");
      // Busca slugs
      const response = await api.get(`/vehicles/search/${termo}`);
      setSlugs(response.data); // array de slugs
    } catch (error) {
      console.error("Erro na pesquisa:", error.message);
      setSlugs([]);
    } finally {
      setLoading(false);
    }
  };

  const getVehicleDetails = async (slug) => {
    try {
      const response = await api.get(`/vehicles/${slug}`);
      setVehicle(response.data);
    } catch (error) {
      console.error("Erro detalhes:", error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>WT Dex</Text>

      <TextInput
        placeholder="Digite o veículo (ex: t-34)"
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        }}
      />

      <Button title="Buscar" onPress={searchVehicle} />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {vehicle && (
        <TouchableOpacity onPress={() => getVehicleDetails(slug)}>
          <Text>{slug}</Text>
        </TouchableOpacity>
      )}

      {!loading && !vehicle && query.length > 0 && (
        <Text style={{ marginTop: 20 }}>Nenhum veículo encontrado.</Text>
      )}
    </View>
  );
}