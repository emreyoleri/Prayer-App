import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import {
  JosefinSans_300Light,
  JosefinSans_700Bold,
} from "@expo-google-fonts/josefin-sans";
import { useFonts } from "expo-font";

import React from "react";
import Colors from "../Colors";
import TodoModal from "./TodoModal";

const TodoList = ({ list, updateList }) => {
  let [fontsLoaded, error] = useFonts({
    JosefinSans_300Light, //
    JosefinSans_700Bold, //
  });

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
        style={[
          styles.listContainer,
          { backgroundColor: list.color, borderRadius: 6 },
        ]}
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
    width: 200,
    marginHorizontal: 12,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
  },
  listTitle: {
    fontFamily: "JosefinSans_700Bold",
    fontSize: 24,
    color: Colors.white,
    marginBottom: 5,
    letterSpacing: 1,
    textTransform: "capitalize",
  },
  count: {
    fontFamily: "JosefinSans_300Light",
    fontSize: 48,
    color: Colors.white,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "JosefinSans_700Bold",
    color: Colors.white,
  },
});
