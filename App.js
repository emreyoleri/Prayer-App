import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
  LogBox,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Colors from "./Colors";
import TodoList from "./components/TodoList";
import AddListModal from "./components/AddListModal";
import Fire from "./Firebase";

export default function App() {
  LogBox.ignoreAllLogs();
  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [lists, setLists] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let firebase = new Fire((error, user) => {
      if (error) {
        return Alert.alert("error");
      }

      firebase.getLists((lists) => {
        setLists(lists),
          setUser(user),
          () => {
            setLoading(false);
          };
      });

      setUser(user), setLoading(false);
    });
    return () => firebase.detach();
  }, []);

  const toogleAddTodoVisible = () => setAddTodoVisible(!addTodoVisible);

  const toogleAddTodoModal = () => setAddTodoVisible(false);

  const renderList = (list) => <TodoList list={list} updateList={updateList} />;

  const addList = (list) => {
    new Fire().addList({
      name: list.name,
      color: list.color,
      todos: [],
    });
  };

  const updateList = (list) => {
    new Fire().updateList(list);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.blue} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        visible={addTodoVisible}
        onRequestClose={toogleAddTodoModal}
      >
        <AddListModal closeModal={toogleAddTodoModal} addList={addList} />
      </Modal>

      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View style={styles.divider} />
        <Text style={styles.title}>
          Todo
          <Text style={{ fontWeight: "300", color: Colors.blue }}> Lists</Text>
        </Text>
        <View style={styles.divider} />
      </View>

      <View style={{ marginVertical: 48 }}>
        <TouchableOpacity style={styles.addList} onPress={toogleAddTodoVisible}>
          <AntDesign name="plus" size={16} color={Colors.blue} />
        </TouchableOpacity>
        <Text style={styles.add}>Add List</Text>
      </View>
      {lists.length === 0 && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 250,
            marginTop: -50,
          }}
        >
          <Image source={require("./assets/no.jpg")} style={styles.image} />
        </View>
      )}
      <View
        style={{
          height: lists.length > 0 ? 275 : 0,
        }}
      >
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => renderList(item)}
          keyboardShouldPersistTaps="always"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    backgroundColor: Colors.lightBlue,
    height: 1,
    flex: 1,
    alignSelf: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: Colors.black,
    paddingHorizontal: 64,
  },
  addList: {
    borderWidth: 2,
    borderColor: Colors.lightBlue,
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    color: Colors.blue,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
  },
  image: {
    width: 200,
    height: 150,
  },
});
