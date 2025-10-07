import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import axios from "axios";

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [resumo, setResumo] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [produto, setproduto] = useState("");
  const [valor, setValor] = useState("");
  const [refresh, setRefresh] = useState(false);

  const API = "http://10.0.2.2:3000/api"; // IP do backend

  // CRUD Clientes
  const carregarClientes = async () => {
    const res = await axios.get(`${API}/clientes`);
    setClientes(res.data);
  };

  const adicionarCliente = async () => {
    await axios.post(`${API}/clientes`, { nome, email });
    setNome(""); setEmail("");
    carregarClientes();
  };

  const adicionarPedido = async () => {
      if(!clienteId || !produto || !valor) return alert("Preencha todos os campos");
    await axios.post(`${API}/pedidos`, { clienteId, produto, valor });
    setproduto(""); setValor(""); setClienteId("");
    await carregarPedidos(); // atualiza lista de pedidos
    await carregarResumo();  // atualiza resumo automaticamente
   };

  const carregarPedidos = async () => {
    const res = await axios.get(`${API}/pedidos`);
    setPedidos(res.data);
  };

  const carregarResumo = async () => {
    const res = await axios.get(`${API}/pedidos/resumo`);
    setResumo(res.data);
    setRefresh(!refresh);
  };

  useEffect(() => {
    carregarClientes();
    carregarPedidos();
    carregarResumo();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📋 Clientes</Text>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <Button title="Adicionar Cliente" onPress={adicionarCliente} />

      <FlatList
        data={clientes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <Text>{item.id} - {item.nome} ({item.email})</Text>}
      />

      <Text style={styles.titulo}>🛒 Pedidos</Text>
      <TextInput style={styles.input} placeholder="ID Cliente" value={clienteId} onChangeText={setClienteId} />
      <TextInput style={styles.input} placeholder="Produto" value={produto} onChangeText={setproduto} />
      <TextInput style={styles.input} placeholder="Valor" value={valor} onChangeText={setValor} />
      <Button title="Adicionar Pedido" onPress={adicionarPedido} />

      <Text style={styles.subtitulo}>Pedidos com Cliente</Text>
      <FlatList
        data={pedidos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.cliente} - {item.produto} - R${item.valor}</Text>
        )}
      />

      <Text style={styles.subtitulo}>Resumo por Cliente</Text>
      <FlatList
        extraData={refresh} // <- isso força a atualização
        data={resumo}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
        <Text>{item.cliente} - Total: R${item.total_gasto}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f2f5' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginVertical: 10, color: '#666ff5' },
  subtitulo: { fontSize: 18, fontWeight: '600', marginTop: 15, color: '#43A047' },
  input: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    marginVertical: 5,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#fff'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  textoCard: { fontSize: 16, fontWeight: '500' },
  botao: { marginVertical: 5, backgroundColor: '#666ff5', padding: 12, borderRadius: 10 },
  textoBotao: { color: '#fff', fontWeight: 'bold', textAlign: 'center' }
});