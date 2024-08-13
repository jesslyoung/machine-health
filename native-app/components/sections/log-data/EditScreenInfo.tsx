import React, {useCallback, useState} from 'react';
import {Button, Platform, StyleSheet, TextInput} from 'react-native';
import {useFocusEffect} from 'expo-router';
import {useSQLiteContext} from 'expo-sqlite/next';
import {Text, View} from '../../Themed';
import Dropdown from './../../atoms/Dropdown';
import useStore from '../../../data/store';
import {MachineType} from '../../../data/types';
import {useMachineData} from './useMachineData';

export default function EditScreenInfo({path}: {path: string}) {
  const [machineName, setMachineName] = useState('');
  const [partName, setPartName] = useState('');
  const [partValue, setPartValue] = useState('');
  const [tolerenceText, setTolerenceText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const {machineData, updateMachineData, loadMachineData} = useMachineData();
  const db = useSQLiteContext();
  const {onDataUpdated} = useStore();


  const machineNames = [
    {label: 'Welding Robot', value: MachineType.WeldingRobot},
    {label: 'PaintingStation', value: MachineType.PaintingStation},
    {label: 'Assembly Line', value: MachineType.AssemblyLine},
    {
      label: 'Quality Control Station',
      value: MachineType.QualityControlStation,
    },
  ];

  function determineRange(number, ranges) {
    const { normalRange, abnormalRange, optimalRange } = ranges;

    if (number >= optimalRange[0] && number <= optimalRange[1]) {
      return 'optimal';
    } else if (number >= normalRange[0] && number <= normalRange[1]) {
      return 'normal';
    } else if (number >= abnormalRange[0] && number <= abnormalRange[1]) {
      return 'abnormal';
    } else {
      return 'outOfRange'; // Optional: For values outside all defined ranges
    }
  }

  const partNames = [
    {value: 'arcStability', label: 'Arc Stability'},
    {
      value: 'coolingEfficiency',
      label: 'Cooling Efficiency',
    },
    {value: 'electrodeWear', label: 'Electrode Wear'},
    {value: 'seamWidth', label: 'Seam Width'},
    {
      value: 'shieldingPressure',
      label: 'Shielding Pressure',
    },
    {value: 'vibrationLevel', label: 'Vibration Level'},
    {value: 'wireFeedRate', label: 'Wire Feed Rate'},
    {
      value: 'colorConsistency',
      label: 'Color Consistency',
    },
    {value: 'flowRate', label: 'Flow Rate'},
    {
      value: 'nozzleCondition',
      label: 'Nozzle Condition',
    },
    {value: 'pressure', label: 'Pressure'},
    {
      value: 'alignmentAccuracy',
      label: 'Alignment Accuracy',
    },
    {value: 'beltSpeed', label: 'Belt Speed'},
    {
      value: 'fittingTolerance',
      label: 'Fitting Tolerance',
    },
    {value: 'speed', label: 'Speed'},
    {
      value: 'cameraCalibration',
      label: 'Camera Calibration',
    },
    {
      value: 'criteriaSettings',
      label: 'Criteria Settings',
    },
    {
      value: 'lightIntensity',
      label: 'Light Intensity',
    },
    {
      value: 'softwareVersion',
      label: 'Software Version',
    },
  ];

  const apiUrl: string = `http://${
    Platform?.OS === 'android' ? '10.0.2.2' : 'localhost'
  }:3001/machine-health`;

  const savePart = useCallback(async () => {
    const timestamp = (new Date()).toISOString()
    try {
      const response =  fetch(`http://localhost:3001/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          machine: machineName,
          measurement: partName,
          value: partValue,
          timestamp,
        }),
      }).then((response) => {
        console.log('pushed to express', response);
      });


      await db.runAsync(
          'INSERT OR IGNORE INTO data (measurement, machine, value, timestamp) VALUES (?, ?, ?, ?);',
          [partName, machineName, partValue, timestamp]
      );

      console.log('insert rows complete');
      onDataUpdated();
      setIsSaved(true);
      setTimeout(() => { setIsSaved(false) }, 2000);
    } catch (error) {
      console.error(error);
      throw error; // Handle API errors appropriately
    }
  }, [machineData, updateMachineData, machineName, partName, partValue]);

  //Doing this because we're not using central state like redux
  useFocusEffect(
    useCallback(() => {
      loadMachineData();
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.machineSelectors}>
        <Dropdown onValueChange={ v => {
          if (!v) return;
          if (!v.machine) return;
          setMachineName(v.machine);
          if (!v.measurement) {
            setPartName(null);
            return;
          };
          setPartName(v.measurement)
        }} />
      </View>

      {
        partName && (
            <>
              <TextInput
                  style={styles.input}
                  value={partValue}
                  onChangeText={(text) => setPartValue(text)}
                  placeholder='Enter part value'
              />
              <Button title='Save' onPress={savePart} />
            </>
          )
      }

      {isSaved && <Text style={styles.healthScore}>Saved ✔️</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'top',
    marginTop: 240,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    minWidth: '60%',
    border: 'none',
    borderRadius: 5,
    minHeight: 50,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 15,
    paddingHorizontal: 10,
    backgroundColor: '#EEEEEE',
  },
  healthScore: {
    minWidth: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  machineSelectors: {
    minHeight: 175,
  }
});
