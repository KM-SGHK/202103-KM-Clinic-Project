import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  useColorScheme,
  Appearance,
} from "react-native";
import { Input, Text, Button, Overlay } from "react-native-elements";
import { Context } from "../context/AuthContext";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from "react-native-table-component";

export default function App() {
  const { state, signout } = useContext(Context);
  const [visible, setVisible] = useState(false);
  const [dateMarks, setDateMarks] = useState({});
  const [fetchedTableData, setFetchedTableData] = useState([]);
  const [singleDateTableData, setSingleDateTableData] = useState([]);
  const [daySelected, setDaySelected] = useState("");
  let tableHead = [
    "Doctor Name",
    "Patient Name",
    "Diagnosis",
    "Medication",
    "Consultation Fee",
    "Date",
    "Time",
    "Follow-up",
  ];
  let tableData = singleDateTableData;
  const processingTableData = (fetchedData, day) => {
    let eachRowData = [];
    let allTableData = [];
    for (let item of fetchedData) {
      eachRowData = Object.values(item);
      eachRowData.splice(0, 2);
      allTableData.push(eachRowData);
      eachRowData = [];
    }
    console.log("testing allTableData in function, ", allTableData);
    let singleDateData = [];
    for (let item of allTableData) {
      console.log("testing item in for loop, ", item);
      console.log("testing day in for loop, ", day);
      if (item[5] == day.dateString) {
        item[7] = item[7].toString();
        singleDateData.push(item);
        console.log("testing singleDateTableData, ", singleDateData);
      }
    }
    console.log("testing singleDateData after for loop, ", singleDateData);
    setSingleDateTableData(singleDateData);
  };
  const fetchMySQLData = async (c, t) => {
    try {
      const res = await fetch(`http://localhost:8080/record/${c}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
      });
      if (res.status === 200) {
        const json = await res.json();
        console.log("testing json after fetching, ", json);
        let dates = json.tableData.map((ele) => ele.Date);
        console.log("testing Dates, ", dates);
        let editedDate = {};
        for (let item of dates) {
          editedDate[item] = {
            selected: true,
            marked: true,
            selectedColor: "red",
          };
        }
        console.log("testing edited Date, ", editedDate);
        setDateMarks(editedDate);
        setFetchedTableData(json.tableData);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log("testing state from Context, ", state);
    fetchMySQLData(state.user.Email, state.token);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 25 }}>Clinic Record</Text>
      <Calendar
        style={styles.calendar}
        markedDates={dateMarks}
        markingType={"multi-dot"}
        onDayPress={(day) => {
          setDaySelected(day.dateString);
          processingTableData(fetchedTableData, day);
          setVisible(!visible);
          console.log("testing visible, ", visible);
        }}
        showWeekNumbers={true}
      />

      <Overlay isVisible={visible} overlayStyle={styles.overlay}>
        <Button
          title="Back"
          type="solid"
          buttonStyle={styles.overlayButton}
          onPress={() => setVisible(!visible)}
        />
        <Text h3 style={styles.overlayText}>
         Record(s) from {daySelected}
        </Text>
        <Text style={styles.overlaySubtitle}>
          Record Number of the Day: {singleDateTableData.length}
        </Text>
        <View style={styles.table}>
          <Table borderStyle={styles.tableBorder}>
            <Row
              style={styles.tableHead}
              textStyle={styles.tableText}
              data={tableHead}
            />
            <Rows
              style={styles.row}
              textStyle={styles.tableText}
              data={singleDateTableData}
            />
          </Table>
        </View>
      </Overlay>
      <Button
        title="Logout"
        type="solid"
        buttonStyle={styles.button}
        onPress={() => signout()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
    paddingLeft: 25,
    paddingRight: 25,
  },
  button: {
    width: 400,
    marginTop: 40,
  },
  calendar: {
    marginTop: 80,
    marginBottom: 50,
    marginLeft: 15,
    marginRight: 15,
    width: 700,
    height: 400,
  },
  overlay: {
    width: 900,
    height: 700,
  },
  overlayButton: {
    marginLeft: 340,
    marginRight: 20,
    width: 200,
    marginTop: 20,
    backgroundColor: "#bdf50a",
  },
  overlayText: {
    marginLeft: 220,
    marginRight: 20,
    marginTop: 80,
  },
  overlaySubtitle: {
    marginLeft: 360,
    marginRight: 20,
    marginTop: 30,
  },
  rowStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  table: {
    flex: 1,
    padding: 35.5,
  },
  tableBorder: {
    borderWidth: 2,
    borderColor: "green",
  },
  tableHead: {
    height: 50,
    marginRight: 3,
    width: 808,
    textAlign: "center",
  },
  tableText: {
    textAlign: "center",
  },
  row: {
    height: 40,
  },
});
