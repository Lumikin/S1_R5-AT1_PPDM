// Importa a barra de status do Expo
import { StatusBar } from "expo-status-bar";

// Hooks do React para estado, efeitos e memorização de funções
import { useState, useEffect, useCallback } from "react";

// Componentes básicos de interface do React Native
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

// Hooks de navegação entre telas
import { useNavigation, useFocusEffect } from "@react-navigation/native";

// Função para inicializar o banco de dados
import { initDB } from "../../api/api";

import api from "../../api/api";

export default function ProdutoScreen() {
  // Hook para navegação
  const navigation = useNavigation();

  // Instância do repositório de produtos
  // const produtoRep = new ProdutoRepository();

  // Estado que armazena a lista de produtos
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);

  async function loadCategorias() {
    try {
      const response = await api.get("/categorias");
      setCategorias(response.data.result);
    } catch (error) {
      console.log(error);
    }
  }
  // Executa ao montar o componente (uma única vez)
  useEffect(() => {
    try {
      const setup = async () => {
        await loadData();
        await loadCategorias();
      };
      setup();
    } catch (error) {
      console.log(error);
      Alert.alert("Ocorreu um erro");
    }
  }, []);

  // Executa sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      async function load() {
        await loadData(); // Atualiza a lista ao voltar para a tela
      }
      load();
    }, []),
  );
  function NomeCategoria(id) {
    const categoria = categorias.find(cat => cat.id === id);
    if (categoria) {
      return categoria.Nome;
    } else {
      return "Não encontrada";
    }
  }

  async function deletarCategoria(id) {
    // Exibe alerta de confirmação
    Alert.alert("Confirmação", "Deseja realmente excluir este produto?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            // Validação básica do ID
            if (!id || id <= 0) {
              Alert.alert("Atencão", "ID da categoria é inválido");
              return;
            }

            // Executa exclusão
            await api.delete(`/produtos/${id}`);

            // Atualiza lista após exclusão
            await loadData();
          } catch (error) {
            // Tratamento de erro específico de chave estrangeira
            if (error?.message?.includes("FOREIGN KEY constraint failed")) {
              Alert.alert(
                "Exclusão bloqueada",
                "Essa categoria possui produtos vinculados.",
              );
            } else {
              Alert.alert("Erro", "Não foi possível excluir a categoria.");
            }
          }
        },
      },
    ]);
  }
  // Função para carregar todos os produtos do banco
  async function loadData() {
    try {
      const response = await api.get("/produtos");
      console.log(response.data.result);
      setProdutos(response.data.result); // Atualiza o estado com os dados
    } catch (error) {
      console.log(error);
      Alert.alert("Ocorreu um erro", error.message);
    }
  }
  async function editarProduto(item) {
    try {
      // Validação se item foi selecionado
      if (!item) {
        Alert.alert("Atencão", "Selecione uma categoria para editar");
        return;
      }

      // Navega para tela de edição passando o item
      navigation.navigate("ProdutoScreenEditar", {
        id: item.id,
        nome: item.nome,
        valor: item.valor,
        idCategoria: item.idCategorias,
      });
    } catch (error) {
      // Tratamento de erro (mensagem reaproveitada)
      if (error?.message?.includes("FOREIGN KEY constraint failed")) {
        Alert.alert(
          "Exclusão bloqueada",
          "Essa categoria possui produtos vinculados.",
        );
      } else {
        Alert.alert("Erro", "Não foi possível excluir a categoria.");
      }
    }
  }
  // Renderização da tela
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Cabeçalho da tela */}
      <View style={styles.header}>
        <Text style={styles.titleScreen}>Gestão de produtos</Text>

        {/* Botão para adicionar novo produto */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("ProdutoScreenIncluir")}
        >
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de produtos */}
      <FlatList
        data={produtos}
        keyExtractor={item => String(item.id)} // Define chave única
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Barra lateral decorativa */}
            <View style={styles.sideBar} />

            <View style={styles.cardInner}>
              <View style={styles.cardContent}>
                {/* Exibição dos dados do produto */}
                <Text style={styles.title}>ID: {item.id}</Text>
                <Text style={styles.title}>Produto: {item.nome}</Text>
                <Text style={styles.title}>Valor R$: {item.valor}</Text>
                <Text style={styles.title}>
                  Categoria: {NomeCategoria(item.idCategorias)}
                </Text>
              </View>

              {/* Área de ações */}
              <View style={styles.actions}>
                {/* Botão de editar */}
                <TouchableOpacity
                  style={[styles.iconButton]}
                  onPress={() => editarProduto(item)} // Função não definida neste trecho
                >
                  <Text style={styles.iconText}>✏️ Editar</Text>
                </TouchableOpacity>

                {/* Botão de excluir */}
                <TouchableOpacity
                  style={[styles.iconButton]}
                  onPress={() => deletarCategoria(item.id)} // Função não definida neste trecho
                >
                  <Text style={styles.iconText}>🗑️ Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Barra lateral laranja decorativa
  sideBar: {
    width: 6,
    backgroundColor: "#FF9800",
  },

  conteudo: {
    flex: 1,
    padding: 5,
    flexDirection: "column",
  },

  cardInner: {
    flex: 1,
    padding: 16,
  },

  // Cabeçalho da tela
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  titleScreen: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
  },

  // Botão de adicionar
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 25,
  },

  addButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 20,
  },

  // Card de cada item da lista
  card: {
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#ffffff",
    borderRadius: 6,
    marginTop: 12,
    marginHorizontal: 10,
    overflow: "hidden",

    // Sombra iOS
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    // Sombra Android
    elevation: 2,
  },

  cardContent: {
    marginBottom: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  // Área dos botões
  actions: {
    flexDirection: "row",
  },

  iconButton: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    marginEnd: 5,
  },

  iconText: {
    fontWeight: "600",
  },
});
