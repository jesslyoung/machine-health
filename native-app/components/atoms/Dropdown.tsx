import React, {useEffect, useState} from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import machineMetadata from '../../data/machineData.json';
import {useSQLiteContext} from "expo-sqlite/next";

const SelectMachine = ({onValueChange, inline}) => {
    const db = useSQLiteContext();
    const [machine, setMachine] = useState(null);
    const [measurement, setMeasurement] = useState(null);
    const [machineList, setMachineList] = useState([]);
    const [mesurementsList, setMesurementsList] = useState([]);

    useEffect(() => {
        async function fetchValues() {

            const result = await db.getAllAsync(
                `SELECT DISTINCT machine FROM data`,
            );
            setMachineList(result.map(m => ({value: m.machine, label: m.machine})));
        }
        fetchValues();
    }, []);

    useEffect(() => {
        async function fetchMeasurementForMachineList() {
            const result = await db.getAllAsync(
                'SELECT DISTINCT measurement FROM data WHERE machine = ?', [machine]
            );
            let list = result.map(m => ({value: m.measurement, label: m.measurement}));
            setMesurementsList(list);
        }
        fetchMeasurementForMachineList();
    }, [machine]);

    let styles = inline ? sideBySide : large;

    return (
        <View style={styles.container}>
            <Dropdown
                style={ styles.dropdown}
                selectedTextStyle={styles.selectedTextStyle}
                itemTextStyle={styles.itemStyle}
                placeholderStyle={styles.placeholderStyle}
                iconStyle={styles.iconStyle}
                maxHeight={200}
                value={machine}
                data={machineList}
                valueField="value"
                labelField="label"
                placeholder="Select machine"
                onChange={e => {
                    setMachine(e.value);
                    onValueChange({machine: e.value, measurement: null});
                    // getSecondDropdown(e.value)
                }}
            />
            {mesurementsList && mesurementsList.length > 0 && (
                <Dropdown
                    style={styles.dropdown}
                    selectedTextStyle={styles.selectedTextStyle}
                    itemTextStyle={styles.itemStyle}
                    placeholderStyle={styles.placeholderStyle}
                    iconStyle={styles.iconStyle}
                    maxHeight={200}
                    value={measurement}
                    data={mesurementsList}
                    valueField="value"
                    labelField="label"
                    placeholder="Select measurement"
                    onChange={e => {
                        setMeasurement(e.value);
                        onValueChange({measurement: e.value, machine});
                    }}
                />
                )
            }
        </View>
    );
};

export default SelectMachine;

const large = StyleSheet.create({
    container: {},
    dropdown: {
        margin: 16,
        height: 50,
        width: 250,
        backgroundColor: '#EEEEEE',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        marginLeft: 8,
    },
    itemStyle: {},
    iconStyle: {
        width: 20,
        height: 20,
    },
});

const sideBySide = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dropdown: {
        margin: 11.5,
        height: 45,
        minWidth: '40%',
        backgroundColor: '#EEEEEE',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    placeholderStyle: {
        fontSize: 11.5,
    },
    selectedTextStyle: {
        fontSize: 11.5,
        marginLeft: 8,
    },
    itemStyle: {
        fontSize: 11.5,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
})