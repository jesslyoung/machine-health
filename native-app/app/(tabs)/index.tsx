import React, {useCallback, useEffect, useState} from 'react';
import {Platform, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import useStore from '../../data/store';
import {View} from '../../components/Themed';
import DataNumber from '../../components/atoms/DataNumber';

let apiUrl: string =
  'https://fancy-dolphin-65b07b.netlify.app/api/machine-health';

if (__DEV__) {
  apiUrl = `http://${
    Platform?.OS === 'android' ? '10.0.2.2' : 'localhost'
  }:3001/machine-health`;
}

export default function DashboardScreen() {
  const [machineData , setMachineData] = useState(null);

  const getLatestHealth = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/machine-health`);
      const data = await response.json();
      console.log('data', {machines: data.machineScores, factory: data.factory})
      setMachineData({machines: data.machineScores, factory: data.factory});
    } catch (error) {
      console.error(error);
      console.log(
          `There was an error calculating health. ${
              error.toString() === 'AxiosError: Network Error'
                  ? 'Is the api server started?'
                  : error
          }`,
      );
    }
  }, []);

  useEffect(() => {
    getLatestHealth();
  }, []);


  const [refreshing, setRefreshing] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getLatestHealth} />
          }
          >
      {machineData && (
        <>
          <View
              style={styles.factoryScore}
          >
            {machineData?.factory ?
                <DataNumber
                    isHeader
                    number={machineData.factory}
                    label="Factory Health Score"
                />
                : 'Not yet calculated'}
          </View>
          <View style={styles.tiles}>
            <DataNumber
                label={'Welding Robot'}
                number={machineData?.machines?.weldingRobot}
            />
            <DataNumber
                label={'Assembly Line'}
                number={machineData?.machines?.assemblyLine}
            />
            <DataNumber
                label={'Painting Station'}
              number={machineData?.machines?.paintingStation}
            />
            <DataNumber
                number={machineData?.machines?.qualityControlStation}
                label="Quality Control Station"
            />
          </View>
        </>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    maxWidth: '100%',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title2: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  text: {},
  link: {
    paddingBottom: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  tiles: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: '30%',
  },
  factoryScore: {
    display: 'flex',
    alignItems: 'center',
  }
});
