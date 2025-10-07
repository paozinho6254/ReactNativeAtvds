import React from "react";
import { View, Text, Image, ScrollView } from "react-native";

export default function VehicleDetails({ route }) {
  const { vehicle } = route.params;

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        {vehicle.identifier}
      </Text>

      {vehicle.images?.image && (
        <Image
          source={{ uri: vehicle.images.image }}
          style={{ width: "100%", height: 200, borderRadius: 10, marginBottom: 20 }}
          resizeMode="contain"
        />
      )}

      <Text><Text style={{ fontWeight: "bold" }}>País:</Text> {vehicle.country}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Tipo:</Text> {vehicle.vehicle_type}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Subtipos:</Text> {vehicle.vehicle_sub_types.join(", ")}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>BR Arcade:</Text> {vehicle.arcade_br}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>BR Realistic:</Text> {vehicle.realistic_br}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Premium:</Text> {vehicle.is_premium ? "Sim" : "Não"}</Text>
      <Text><Text style={{ fontWeight: "bold" }}>Data de lançamento:</Text> {new Date(vehicle.release_date).toLocaleDateString()}</Text>
    </ScrollView>
  );
}