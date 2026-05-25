import { StatusBar } from 'expo-status-bar';
// Hook para navegação entre telas
import { useNavigation } from '@react-navigation/native';
// Hooks de estado e ciclo de vida
import { useState, useEffect } from 'react';
// Componentes básicos do React Native
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';


export default function CategoriaScreenIncluir() {
  // Hook para controlar navegação (ex: voltar para tela anterior)
  const navigation = useNavigation();

  // Estado para armazenar o nome da categoria digitado
  const [nomeCategoria, setNomeCategoria] = useState();

  // Função responsável por salvar a nova categoria
  async function salvar() {
    // console.log(nomeCategoria);

    // Validação: campo obrigatório e mínimo de 3 caracteres
    if (!nomeCategoria || nomeCategoria.trim().length < 3) {
      Alert.alert('Atencão', 'Informe corretamente o nome da categoria');
      return
    }

    // Insere nova categoria no banco
    // await categoriaRep.create(nomeCategoria);

    // Busca lista atualizada (usado aqui apenas para debug)
    const lista = await categoriaRep.findAll();
    console.log(lista);

    // Volta para a tela anterior após salvar
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      {/* Título da tela */}
      <Text style={styles.titulo}>Incluir Categoria</Text>

      {/* Barra de status do sistema */}
      <StatusBar style="auto" />

      {/* Input para digitar o nome da categoria */}
      <TextInput
        placeholder="Digite o nome da categoria"
        value={nomeCategoria}
        onChangeText={setNomeCategoria} // atualiza estado conforme digitação
        style={styles.input}
      />

      {/* Área dos botões */}
      <View style={styles.actions}>
        
        {/* Botão cancelar: volta sem salvar */}
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text>Cancelar</Text>
        </TouchableOpacity>

        {/* Botão salvar: executa função salvar */}
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
    backgroundColor: '#fff',
    alignItems: 'center',
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
    width: '95%'
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
    backgroundColor: "#eee", // botão neutro
  },
  saveButton: {
    backgroundColor: "#4CAF50", // botão de ação (salvar)
  },
});