import {Text} from "react-native-paper";
import React from "react";
import {Dimensions, StyleSheet, View} from "react-native";

function DataNumber({number, label, isHeader}) {
    let color = '';
    if (number > 75) color = "rgb(64,194,22)";
    else if (number > 60) color = "rgb(234,129,20)";
    else color = "rgb(248,64,64)";

    return (
        <View style={styles.tile}>
            <Text
                variant={isHeader ? "labelLarge" : 'bodyMedium'}
                >
                {label}
            </Text>
            <Text
                variant={isHeader ? "displayMedium" : 'headlineMedium'}
                style={{color}}>
                {number}
            </Text>
        </View>)
}

const styles = StyleSheet.create({
    tile: {
        width: (Dimensions.get("window").width / 2 ) -30,
        marginVertical: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 5,
        // borderColor: '#efefef',
        // borderWidth: 1,
        paddingVertical: 30,
        marginHorizontal: 10,
        backgroundColor: 'white',
    },
});

export default DataNumber;