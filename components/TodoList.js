import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "../Colors";

const TodoList = ({ list }) => {
  const completedCount = list.todos.filter((todo) => todo.completed).length;
  const remainingCount = list.todos.length - completedCount;
  return (
    <View style={[styles.listContainer, { backgroundColor: list.color }]}>
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
