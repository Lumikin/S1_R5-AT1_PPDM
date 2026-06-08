// Importa a barra de status do Expo
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
// Hook para navegação entre telas
import api from "../../api/api";
// Hooks de estado e ciclo de vida
import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

// Componentes de interface do React Native
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

// Componente de seleção (dropdown)
import { Picker } from "@react-native-picker/picker";

export default function ProdutoScreenEditar() {
  // Hook de navegação
  const navigation = useNavigation();
  const route = useRoute();
  // Estados do formulário
  const [nomeProduto, setNomeProduto] = useState(); // Nome do produto
  const [idProduto, setIdProduto] = useState(); // Nome do produto
  const [valorProduto, setValorProduto] = useState(); // Valor do produto
  const [categorias, setCategorias] = useState([]); // Lista de categorias
  const [categoriaId, setCategoriaId] = useState(null); // Categoria selecionada
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (route.params) {
      setIdProduto(route.params.id);
      setNomeProduto(route.params.nome);
      setValorProduto(route.params.valor);
      setCategoriaId(route.params.idCategoria);
    }
  }, [route.params]);

  async function loadDataCategorias() {
    try {
      const response = await api.get("/categorias");
      console.log(response.data.result);
      return response.data.result; // Atualiza o estado com os dados
    } catch (error) {
      console.log(error);
      Alert.alert("Ocorreu um erro", error.message);
    }
  }

  useEffect(() => {
    try {
      const setup = async () => {
        // Busca todas as categorias do banco
        const result = await loadDataCategorias();

        // Armazena no estado
        setCategorias(result);
      };
      setup();
    } catch (error) {
      console.log(error);
      Alert.alert("Ocorreu um erro");
    }
  }, []);

  // Função responsável por salvar o produto
  async function salvar() {
    const formData = new FormData();
    // Validação do nome
    if (!nomeProduto || nomeProduto.trim().length < 3) {
      Alert.alert("Atencão", "Informe corretamente o nome do produto");
      return;
    }

    // Validação da categoria
    if (!categoriaId) {
      Alert.alert("Atenção", "Selecione uma categoria");
      return;
    }

    // Validação do valor
    if (!valorProduto || valorProduto <= 0) {
      Alert.alert("Atenção", "Informe um valor");
      return;
    }
    try {
      const body = {
        nome: nomeProduto,
        valor: valorProduto,
        idCategoria: categoriaId,
      };
      const params = {
        params: {
          id: idProduto,
        },
      };
      await api.put("/produtos", body, params);
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível cadastrar o produto");
    }
    // Volta para a tela anterior
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Incluir Produto</Text>
      <StatusBar style="auto" />

      {/* Campo para nome do produto */}
      <TextInput
        placeholder="Digite o nome do produto"
        value={nomeProduto}
        onChangeText={setNomeProduto}
        style={styles.input}
      />

      {/* Campo para valor do produto */}
      <TextInput
        placeholder="Digite valor do produto"
        value={valorProduto}
        style={styles.input}
        keyboardType="numeric"
        onChangeText={text => {
          // Remove tudo que não for número ou ponto decimal
          const cleaned = text.replace(/[^0-9.]/g, "");

          // Evita mais de um ponto decimal (ex: 10.5.3)
          const parts = cleaned.split(".");
          if (parts.length > 2) return;

          // Atualiza o estado com valor válido
          setValorProduto(cleaned);
        }}
      />
      {/* Container do seletor de categoria */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoriaId}
          onValueChange={itemValue => setCategoriaId(itemValue)}
          style={styles.picker}
        >
          {/* Opção padrão */}
          <Picker.Item label="Selecione uma categoria" value={null} />

          {/* Lista dinâmica de categorias */}
          {categorias.map(cat => (
            <Picker.Item key={cat.id} label={cat.Nome} value={cat.id} />
          ))}
        </Picker>
      </View>
      {/* Botão de cancelar */}
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textButton}>Cancelar</Text>
      </TouchableOpacity>

      {/* Botão de salvar */}
      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={salvar}
      >
        <Text style={[styles.textButton, { color: "#fff" }]}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  // Título da tela
  titulo: {
    marginTop: 25,
    marginBottom: 25,
    fontSize: 16,
    fontWeight: "bold",
  },
  imageButton: {
    width: "95%",
    height: 80,
    borderWidth: 2,
    borderColor: "#4CAF50",
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#F8FFF8",
  },

  imageButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
  },
  // Estilo dos inputs
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    width: "95%",
    height: 50,
  },

  // Área de ações (não usada diretamente aqui)
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  // Estilo base dos botões
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
    width: "95%",
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  // Botão cancelar
  cancelButton: {
    backgroundColor: "#eee",
  },

  // Botão salvar
  saveButton: {
    backgroundColor: "#4CAF50",
  },

  // Container do Picker (dropdown)
  pickerContainer: {
    width: "95%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 16,
  },

  // Texto dos botões
  textButton: {
    fontSize: 16,
  },
});
