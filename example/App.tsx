import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";

import { BasicCalendarList } from "./src/BasicCalendarList";

export default function App() {
  return (
    <SafeAreaView style={styles.sfeAreaView}>
      <BasicCalendarList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sfeAreaView: {
    flex: 1,
    paddingVertical: 24,
    marginHorizontal: 20,
  },
});
