import React, {useEffect, useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import {Divider, List, Text, Button} from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite/next';
import {Redirect} from 'expo-router';
import useStore from '../data/store';

const IndexScreen = () => {
    const { authorize, clearSession, user, isLoading, error } = useAuth0();
    const db = useSQLiteContext();
    const [lastRecord, setLastRecord] = useState(null);

    const { setFetching, setDbLoaded, setIsDataLoaded, isDataLoaded } = useStore();

    useEffect(()=> {
        async function initDb() {
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                measurement TEXT,
                machine TEXT,
                value REAL,
                timestamp INTEGER,
                UNIQUE(measurement, machine, timestamp)
                );`,
            );

            // get date and hash list
            // set needed time window based on T-7d
            // send requested dates and hashes

            setFetching(true)
            const endDate = new Date().toISOString();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            const formattedStartDate = startDate.toISOString();

            try {
                // Fetch data from the API
                const response = await fetch(`http://localhost:3001/data?startDate=${formattedStartDate}&endDate=${endDate}`);
                const data = await response.json();

                data.forEach(async row => {
                    const { measurement, machine, timestamp, value } = row;
                    const result = await db.runAsync(
                        'INSERT OR IGNORE INTO data (measurement, machine, value, timestamp) VALUES (?, ?, ?, ?);',
                        [measurement, machine, value, timestamp]
                    );
                });
                console.log('insert rows complete');

                console.log('db on index', db)
                try {
                    const result = await db.getAllAsync("SELECT name FROM sqlite_master WHERE type='table' AND name='data';");
                    console.log('Table Check:', result);
                } catch (e) {
                    console.error(e);
                }

                console.log('runEffect index', isDataLoaded);
                try {
                    const record = await db.getAllAsync('SELECT * FROM data ORDER BY timestamp DESC LIMIT 1;')
                    console.log('last',record);
                    setLastRecord(record[0]);
                } catch (e) {
                    console.error(e);
                }

            } catch (error) {
                console.error('Error fetching or storing data:', error);
            }
            setDbLoaded(true);
            setFetching(false);
            setIsDataLoaded(true);
        }

        initDb();

    }, [])

    const onLogin = async () => {
        try {
            await authorize();
        } catch (e) {
            console.log(e);
        }
    };


    if (isLoading) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }

    if (user && isDataLoaded)  return <Redirect href="/(tabs)" />

    if (!user) {
        return (
            <View style={styles.container}>
                <Text variant="headlineMedium">Machine Health</Text>
                <Divider />
                <View style={styles.login}>
                        <Button
                            mode="contained"
                            onPress={onLogin}
                            icon="google"
                        >
                            Sign in with Google
                        </Button>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {error && <Text>{error.message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    text: {
        fontSize: 13,
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    login: {
        minWidth: '50%',
        marginTop: '60%',
        marginHorizontal: 'auto',
        textAlign: 'center',
    }
});

export default IndexScreen;
