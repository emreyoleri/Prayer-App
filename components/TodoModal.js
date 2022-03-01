import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "../Colors";

const TodoModal = ({ list, closeModal }) => {
  const [name, setName] = React.useState(list.name);
  const [color, setColor] = React.useState(list.color);
  const [todos, setTodos] = React.useState(list.todos);

  const taskCount = list.todos.length;
  const completedCount = list.todos.filter((todos) => todos.completed).length;

  const renderTodo = (todo) => {
    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity>
          <Ionicons
            name={todo.completed ? "square" : "square-outline"}
            size={24}
            color={Colors.gray}
            style={{ width: 32 }}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.todo,
            {
              textDecorationLine: todo.completed ? "line-through" : "none",
              color: todo.completed ? Colors.gray : Colors.black,
            },
          ]}
        >
          {todo.title}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{ position: "absolute", top: 32, right: 32, zIndex: 1 }}
        onPress={closeModal}
      >
        <AntDesign name="close" size={24} color={Colors.black} />
      </TouchableOpacity>
      <View
        style={[styles.section, styles.header, { borderBottomColor: color }]}
      >
        <View>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.taskCount}>
            {completedCount} of {taskCount} tasks
          </Text>
        </View>
      </View>

      <View style={[styles.section, { flex: 3 }]}>
        <FlatList
          data={todos}
          renderItem={({ item }) => renderTodo(item)}
          keyExtractor={(item) => item.title}
          contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <KeyboardAvoidingView
        style={[styles.section, styles.footer]}
        behavior="padding"
      >
        <TextInput style={[styles.input, { borderColor: color }]} />
        <TouchableOpacity style={[styles.addTodo, { backgroundColor: color }]}>
          <AntDesign name="plus" size={16} color={Colors.white} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TodoModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    flex: 1,
    alignSelf: "stretch",
    marginBottom: 20,
  },
  header: {
    justifyContent: "flex-end",
    marginLeft: 64,
    borderBottomWidth: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.black,
  },
  taskCount: {
    marginTop: 4,
    marginBottom: 16,
    color: Colors.gray,
    fontWeight: "bold",
  },
  footer: {
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 45,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  addTodo: {
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  todoContainer: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  todo: {
    color: Colors.black,
    fontWeight: "700",
    fontSize: 16,
  },
});
