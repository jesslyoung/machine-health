import {useState} from 'react';
import {StyleSheet} from 'react-native';
import {View} from '../../components/Themed';
import Dropdown from '../../components/atoms/Dropdown';
import MachineDataTable from '../../components/sections/history/MachineDataTable';


export default function HistoryScreen() {
    const [measurement, setMeasurement] = useState<string>(null)
    return (
        <View style={styles.container}>
            <View style={styles.machineSelectors}>
                <Dropdown onValueChange={v=>setMeasurement(v.measurement)} inline />
            </View>
            <MachineDataTable measurement={measurement} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
