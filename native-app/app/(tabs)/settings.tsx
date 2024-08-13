import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useAuth0} from 'react-native-auth0';
import {useSQLiteContext} from 'expo-sqlite/next';
import {Text, List, Divider} from 'react-native-paper';
import RNExitApp from 'react-native-exit-app';

function Settings() {
    const { clearSession, user, authorize } = useAuth0();
    const db = useSQLiteContext();

    const onLogout = async () => {
        try {
            await clearSession();
        } catch (e) {
            console.log('Log out cancelled');
        }
    };

    const clearAllData = async () =>{
        const result = await db.getAllAsync(
            `DELETE FROM data`,
        );
        RNExitApp.exitApp();
    }

    const onLogin = async () => {
        try {
            await authorize();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.name}>
                <Text variant="headlineSmall">{user.name}</Text>
            </View>
            <View style={styles.list}>
                <List.Section>
                    <List.Item
                        title="Clear data"
                        onPress={clearAllData}
                        left={props => <List.Icon {...props} icon="database-remove" />}
                    />
                </List.Section>
            </View>
            <View style={styles.logout}>
                <List.Section>
                    <Divider />
                    <List.Item
                        title="Log Out"
                        titleStyle={{color: 'red'}}
                        onPress={onLogout}
                        left={props => <List.Icon {...props} icon="logout" color="red" />}
                    />
                </List.Section>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'left',
        paddingHorizontal: 20,
    },
    name: {
        marginTop: 60,
        marginBottom: 300,
        textAlign: 'left',
        paddingLeft: 40,
    },
    header: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    list: {
        marginTop: 10,
    },
    logout: {
        minWidth: '100%',
        marginBottom: 20,
    }
});

export default Settings;