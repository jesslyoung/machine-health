import {useState} from 'react';
import {StyleSheet} from 'react-native';
import {View} from '../../components/Themed';
import Dropdown from "../../components/atoms/Dropdown";
import AnalyticsChart from "../../components/sections/analytics/AnalyticsChart";

export default function ChartScreen() {
    const [measurement, setMeasurement] = useState<string>(null)
    const [machine, setMachine] = useState<string>(null)
    return (
        <View style={styles.container}>
            <View style={styles.machineSelectors}>
                <Dropdown
                    onValueChange={v => {
                        setMeasurement(v.measurement)
                        setMachine(v.machine)
                    }}
                    inline
                />
            </View>
            <AnalyticsChart machine={machine} measurement={measurement} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 20,
        height: 1,
        width: '80%',
    },
    machineSelectors: {
        minHeight: 75,
    }
});
