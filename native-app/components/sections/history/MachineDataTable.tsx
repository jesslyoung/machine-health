import {useSQLiteContext} from 'expo-sqlite/next';
import {useEffect, useState} from 'react';
import {DataTable} from 'react-native-paper';
import useStore from '../../../data/store';

function getFormattedDateTime(datetime) {
    const date = new Date(datetime);
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()} ${date.getHours()}:${date.getMinutes()}`;

}

const MachineDataTable = ({measurement}) => {
    const db = useSQLiteContext();
    const [page, setPage] = useState<number>(0);
    const [numberOfItemsPerPageList] = useState([2, 8]);
    const [itemsPerPage, onItemsPerPageChange] = useState(
        numberOfItemsPerPageList[1]
    );
    const {dataLastUpdated} = useStore();

    async function getData() {
        try {
            const result = await db.getAllAsync("SELECT * FROM data WHERE measurement = ?;", [measurement]);
            setItems(result);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getData();
    }, [measurement]);

    useEffect(() => {
        getData();
    }, [dataLastUpdated]);

    const [items, setItems] = useState([]);

    const from = page * itemsPerPage;
    const to = Math.min((page + 1) * itemsPerPage, items.length);

    useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    return (
        <DataTable>
            <DataTable.Header>
                <DataTable.Title>Timestamp</DataTable.Title>
                <DataTable.Title numeric>Value</DataTable.Title>
            </DataTable.Header>

            {items.slice(from, to).map((item) => (
                <DataTable.Row key={item.id}>
                    <DataTable.Cell>{getFormattedDateTime(item.timestamp)}</DataTable.Cell>
                    <DataTable.Cell numeric>{item.value}</DataTable.Cell>
                </DataTable.Row>
            ))}

            <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(items.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} of ${items.length}`}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={itemsPerPage}
                onItemsPerPageChange={onItemsPerPageChange}
                showFastPaginationControls
                selectPageDropdownLabel={'Rows per page'}
            />
        </DataTable>
    );
};

export default MachineDataTable;