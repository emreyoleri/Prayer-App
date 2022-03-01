import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import React from "react";
import Colors from "../Colors";
import TodoModal from "./TodoModal";

const TodoList = ({ list, updateList }) => {
  const [showListVisible, setShowListVisible] = React.useState(false);

  const toogleListModal = () => setShowListVisible(!showListVisible);

  const completedCount = list.todos.filter((todo) => todo.completed).length;
  const remainingCount = list.todos.length - completedCount;
  return (
    <View>
      <Modal
        animationType="slide"
        visible={showListVisible}
        onRequestClose={toogleListModal}
      >
        <TodoModal
          list={list}
          closeModal={toogleListModal}
          updateList={updateList}
        />
      </Modal>
      <TouchableOpacity
        style={[styles.listContainer, { backgroundColor: list.color }]}
        onPress={toogleListModal}
      >
        <Text style={styles.listTitle} numberOfLines={1}>
          {list.name}
        </Text>
        <View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.count}>{remainingCount}</Text>
            <Text style={styles.subtitle}>Remaining</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.count}>{completedCount}</Text>
            <Text style={styles.subtitle}>Completed</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TodoList;

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 12,
    alignItems: "center",
    width: 200,
  },
  listTitle: {
    fontSize: 24,
    color: Colors.white,
    marginBottom: 5,
    letterSpacing: 1,
  },
  count: {
    fontSize: 48,
    fontWeight: "100",
    color: Colors.white,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.white,
  },
});
