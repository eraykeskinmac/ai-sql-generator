import { Table, TableBody, TableHead, TableRow } from '@/components/ui/table';

const DynamicTable = ({ data }: { data: any[] }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {Object.keys(data[0]).map((key) => (
            <TableHead key={key}>{key}</TableHead>
          ))}
        </TableRow>
        <TableBody>
          {data.slice(1).map((row: any, index: number) => (
            <TableRow key={index}>
              {Object.values(row).map((value: any, index: number) => (
                <TableBody key={index}>{value}</TableBody>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableHead>
    </Table>
  );
};

export default DynamicTable;
