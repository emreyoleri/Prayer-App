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
  Keyboard,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Colors from "../Colors";

const TodoModal = ({ list, closeModal, updateList }) => {
  const { name, color, todos } = list;
  const [newTodo, setNewTodo] = React.useState("");

  const taskCount = list.todos.length;
  const completedCount = list.todos.filter((todos) => todos.completed).length;

  const toogleTodoCompleted = (index) => {
    list.todos[index].completed = !list.todos[index].completed;
    updateList(list);
  };

  const addTodo = () => {
    if (!list.todos.some((todo) => todo.title === newTodo)) {
      list.todos.push({ title: newTodo, completed: false });
      updateList(list);
    }

    setNewTodo("");
    Keyboard.dismiss();
  };

  const deleteTodo = (index) => {
    list.todos.splice(index, 1);
    updateList(list);
  };
  const renderTodo = (todo, index) => {
    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity onPress={() => toogleTodoCompleted(index)}>
          <Ionicons
            name={todo.completed ? "square" : "square-outline"}
            size={24}
            color={Colors.gray}
            style={{ width: 32 }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 1,
            paddingRight: 20,
          }}
        >
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
          <TouchableOpacity onPress={() => deleteTodo(index)}>
            <Ionicons
              name="trash-outline"
              size={24}
              color={Colors.gray}
              style={{ width: 32 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
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
            renderItem={({ item, index }) => renderTodo(item, index)}
            keyExtractor={(item) => item.title}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={[styles.section, styles.footer]}>
          <TextInput
            style={[styles.input, { borderColor: color }]}
            value={newTodo}
            onChangeText={(text) => setNewTodo(text)}
          />
          <TouchableOpacity
            style={[styles.addTodo, { backgroundColor: color }]}
            onPress={addTodo}
          >
            <AntDesign name="plus" size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    paddingVertical: 16,
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
    paddingLeft: 32,
  },
  todo: {
    color: Colors.black,
    fontWeight: "700",
    fontSize: 16,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: Colors.red,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
});
