import {useEffect, useMemo, useState} from "react";
import {useSQLiteContext} from "expo-sqlite/next";
import {StyleSheet, Text, Dimensions, View} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import {LineChart} from "react-native-chart-kit";
import { LineChart as LineChart2 } from "react-native-gifted-charts";
import machineData from '../../../data/machineData.json';
import useStore from "../../../data/store";

function getFormattedDate(datetime) {
    const date = new Date(datetime);
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;

}

const AnalyticsChart = ({machine, measurement}) => {
    const db = useSQLiteContext();
    const [data, setData] = useState([0,0,0,0,0,0,0]);
    const [labels, setLabels] = useState([]);
    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([2, 3, 4]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[0]
    );
    const [maxValue, setMaxValue] = useState<number>(10);
    const {dataLastUpdated} = useStore();

    const getData = async () => {
        console.log('analytics:getData');
        if (!measurement) return;
        try {
            let data = [];
            let labels = [];
            const result = await db.getAllAsync(`SELECT * FROM data WHERE measurement='${measurement}' ORDER BY timestamp ASC;`);
    console.log('sorted', result)
            let maxValue = 0;

            result.map(d => {
                const value = (typeof d.value != "number") ? parseFloat(d.value) : d.value;
                // data.push({value, label: getFormattedDate(d.timestamp)});
                if (value > maxValue) maxValue = value;
                // labels.push();

                console.log('data', d);
                data.push(value);
                labels.push(getFormattedDate(d.timestamp));
            });
            setData(data.sort((a,b) => a.timestamp - b.timestamp));
            setLabels(labels);
            setMaxValue(maxValue);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getData();
    }, [measurement, dataLastUpdated]);

    useEffect(() => {
        getData();
    }, [ dataLastUpdated]);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    const chart = useMemo(() => {
        return(
            <LineChart
                data={{
                    labels,
                    datasets: [
                        {
                            data
                        }
                    ]
                }}
                width={Dimensions.get("window").width} // from react-native
                height={Dimensions.get("window").height - 100 }
                withInnerLines={false}
                chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#ececec",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(41, 180, 245, ${opacity*3})`,
                    labelColor: (opacity = 1) => `#00000060`,
                    style: {
                        borderRadius: 0,
                    },
                    propsForDots: {
                        r: "6",
                        // strokeWidth: "2",
                        // stroke: "#88b0cc"
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 0,
                    marginBottom: 0,
                }}
            />
        )
    }, [data, maxValue]);

    // const chart2 = useMemo(() => {
    //     return(
    //         <LineChart2
    //             isAnimated
    //             dataSet={[{
    //                 data,
    //                 color: '#29b4f5',
    //                 thickness: 5,
    //                 dataPointsColor: '#127bac',
    //                 curved: true,
    //                 curvature: 0.2,
    //             }]}
    //             width={Dimensions.get("window").width - 80} // from react-native
    //             height={Dimensions.get("window").height - 320}
    //             yAxisThickness={0}
    //             xAxisThickness={0}
    //             yAxisColor={'#000'}
    //             showFractionalValues={true}
    //             maxValue={ maxValue + maxValue * .3 }
    //             yAxisLabelWidth={45}
    //             roundToDigits={2}
    //             textColor={'#00000090'}
    //             rulesType={'solid'}
    //             yAxisTextStyle={{color: '#00000060', paddingLeft: 14, fontSize: 11}}
    //             xAxisLabelTextStyle={{color: '#000000', fontSize: 14, marginTop: -10}}
    //             rulesColor={'rgba(211,211,211,0.56)'}
    //             showReferenceLine1={showReferenceLines}
    //             showReferenceLine2={showReferenceLines}
    //             referenceLine1Config={{thickness: 1.5, color: 'rgb(136,213,111)'}}
    //             referenceLine2Config={{thickness: 1.5, color: 'rgb(136,213,111)'}}
    //             referenceLine1Position={showReferenceLines ? referenceLine1 : null}
    //             referenceLine2Position={showReferenceLines ? referenceLine2 : null}
    //         />
    //     )
    // }, [data, maxValue]);

    if (!machine) return;
    if (!measurement) return;
    if (!data) return;

    if (measurement == 'softwareVersion') return <Text>No chart available</Text>

    let showReferenceLines = false;
    const referenceLine1 = machineData[machine][measurement].normalRange[0];
    const referenceLine2 = machineData[machine][measurement].normalRange[1];

    try {
        if (
            referenceLine1 >= 0 &&
            referenceLine2 >= 0
        ) {
            showReferenceLines = true;
        }
    } catch (e) {}

    console.log('render', dataLastUpdated);


    return (
        <View style={styles.container}>
                {chart}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        minWidth: "100%",
        marginBottom: 20,
        // background:
    }
})

export default AnalyticsChart;