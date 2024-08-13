import React from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import { Auth0Provider } from 'react-native-auth0';
import { PaperProvider } from 'react-native-paper';
import { Stack } from 'expo-router';
import { SQLiteProvider, } from 'expo-sqlite/next';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';

// initilize app
    // appwide state,  range = [today, today-7d], activeViews = []
    // need fetch?
        // query range of available data
        // verify against server checksum
        // if ? fetchData
        // else ? continue

// fetchData
    // GET fetch('/data', {rangeList})
        // insert all data
            // replace any matching machine, measurement, timestamp


const App = () => {
    const colorScheme = useColorScheme();

    return (
        <Auth0Provider domain={"dev-u5muta0c57x8pmx5.us.auth0.com"} clientId={"oKcXmLGjpSqRSSd6MY96VIeHoVWhauF6"}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <SQLiteProvider databaseName="machines.db" useSuspense>
                    <PaperProvider>
                        <Stack>
                            <Stack.Screen name="index" options={{ headerShown: false }} />
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                        </Stack>
                    </PaperProvider>
                </SQLiteProvider>
            </ThemeProvider>
        </Auth0Provider>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 25,
        fontWeight: '500',
    },
});

export default App;