import { StatusBar } from "expo-status-bar";
// Hook para navegação entre telas
import { useNavigation, useRoute } from "@react-navigation/native";
// Hooks de estado e ciclo de vida
import { useState, useEffect } from "react";
// Componentes básicos do React Native
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import api from "../../api/api";

export default function CategoriaScreenEditar() {
  // Hook para acessar os parâmetros recebidos pela navegação
  const route = useRoute();

  // Hook para controlar navegação (voltar, ir para outra tela, etc)
  const navigation = useNavigation();

  // Estado para armazenar o nome da categoria
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [descricaoCategoria, setDescricaoCategoria] = useState("");
  // Estado para armazenar o ID da categoria
  const [idCategoria, setIdCategoria] = useState(null);

  useEffect(() => {
    if (route.params) {
      setIdCategoria(route.params.id);
      setNomeCategoria(route.params.nome);
      setDescricaoCategoria(route.params.descricao);
    }
  }, [route.params]);
  // Função para salvar (editar) a categoria
  async function salvar() {
    // Validação do nome
    if (!nomeCategoria || nomeCategoria.trim().length < 3) {
      Alert.alert("Atencão", "Informe corretamente o nome da categoria");
      return;
    }

    // Validação do ID
    if (!idCategoria || idCategoria <= 0) {
      Alert.alert("Atencão", "Verifique o ID da categoria");
      return;
    }
    const body = {
      nome: nomeCategoria,
      descricao: descricaoCategoria,
    };
    const params = {
      params: {
        id: idCategoria,
      },
    };

    try {
      await api.put("/categorias", body, params);
      console.log(navigation.canGoBack());
      navigation.goBack();
    } catch (error) {
      console.log(error);
      console.log(navigation.canGoBack());
      Alert.alert("Erro", "Não foi possível alterar o produto");
    }
  }

  return (
    <View style={styles.container}>
      {/* Título da tela */}
      <Text style={styles.titulo}>Alterar Categoria</Text>

      {/* Barra de status do sistema */}
      <StatusBar style="auto" />

      {/* Input do nome da categoria */}
      <TextInput
        placeholder="Digite o nome da categoria"
        value={nomeCategoria}
        onChangeText={setNomeCategoria}
        style={styles.input}
      />
      {/* Input do ID (convertido para string para exibir corretamente) */}

      <TextInput
        placeholder="Digite a descricao da categoria"
        value={descricaoCategoria}
        onChangeText={setDescricaoCategoria}
        style={styles.input}
      />

      {/* Área dos botões */}
      <View style={styles.actions}>
        {/* Botão cancelar */}
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text>Cancelar</Text>
        </TouchableOpacity>

        {/* Botão salvar */}
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={salvar}
        >
          <Text style={{ color: "#fff" }}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: 'center',
  },
  titulo: {
    marginTop: 25,
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    width: "95%",
  },
  actions: {
    flexDirection: "row", // botões lado a lado
    justifyContent: "flex-end", // alinhados à direita
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
  },

  cancelButton: {
    backgroundColor: "#eee", // cinza claro
  },
  saveButton: {
    backgroundColor: "#4CAF50", // verde
  },
});
