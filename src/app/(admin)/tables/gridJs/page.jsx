import AllDataTable from './components/AllDataTable';
import { getAllDataTableRecords } from '@/helpers/data';
export const metadata = {
  title: 'Grid Js Tables'
};
const GridJs = async () => {
  const dataTableRecords = await getAllDataTableRecords();
  return <>
      <AllDataTable dataTableRecords={dataTableRecords} />
    </>;
};
export default GridJs;