import React from "react";
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../Colors";

const AddListModal = ({ closeModal, addList }) => {
  const buttonColors = [
    "#5CD859",
    "#24A6D9",
    "#595BD9",
    "#8022D9",
    "#D159D8",
    "#D85963",
    "#D88559",
  ];

  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState(buttonColors[0]);

  const createTodo = () => {
    const list = { name, color };

    addList(list);
    setName("");
    closeModal();
  };

  const renderColors = () => {
    return buttonColors.map((color) => (
      <TouchableOpacity
        key={color}
        style={[styles.colorSelect, { backgroundColor: color }]}
        onPress={() => setColor(color)}
      />
    ));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableOpacity
        style={{ position: "absolute", top: 32, right: 32 }}
        onPress={closeModal}
      >
        <AntDesign name="close" size={24} color={Colors.black} />
      </TouchableOpacity>

      <View style={{ alignSelf: "stretch", marginHorizontal: 32 }}>
        <Text style={styles.title}>Create Todo List</Text>
        <TextInput
          style={styles.input}
          placeholder="List Name.."
          onChangeText={(text) => setName(text)}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 24,
          }}
        >
          {renderColors()}
        </View>
        <TouchableOpacity
          style={[styles.create, { backgroundColor: color, zIndex: 1 }]}
          onPress={createTodo}
        >
          <Text
            style={{
              color: Colors.white,
              fontWeight: "bold",
              letterSpacing: 1.2,
              fontSize: 15,
            }}
          >
            Create !
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddListModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.black,
    alignSelf: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.blue,
    borderRadius: 6,
    height: 50,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  create: {
    marginTop: 24,
    height: 50,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSelect: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
});
