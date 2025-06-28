import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { usePagination } from "@table-library/react-table-library/pagination";
import { FaFileDownload } from "react-icons/fa";

function Table({data,title,download}){

    const nodes = data;

    const tableData = {nodes}

    const pagination = usePagination(tableData, {
        state: {
        page: 0,
        size: 5,
        },
    });

     const theme = useTheme([
        getTheme(),
        {

            Cell:`
                border:0.1px dotted black;
            `,
            HeaderCell:`
                border:0.1px solid black;
                background-color: #eaf5fd;
                text-align:center;
                letter-spacing:0.04em;
            `,

            Row: `
            &:nth-of-type(odd) {
                background-color: #d2e9fb;
                color: #333333;
                text-align:center;
            }

            &:nth-of-type(even) {
                background-color: #eaf5fd;
                color: #333333;
                text-align:center;
            }
            `
        },
    ]);

    const COLUMNS = [
        {
            label:'Transaction Reference',
            renderCell:(item)=>item.transaction_reference,
            resize:true,
        },
        {
            label:'Debit',
            renderCell:(item)=>item.debit,
            resize:true,
        },
        {
            label:'Credit',
            renderCell:(item)=>item.credit,
            resize:true
        }
    ]

    const handleDownloadCsv = ()=>{
        const columns = [
            { accessor: (item) => item.transaction_reference, name: "Transaction Reference" },
            { accessor: (item) => item.debit, name: "Debit" },
            { accessor :(item) => item.credit, name:"Credit"},
        ];

        downloadAsCsv(columns, tableData.nodes,title);
    }

    const downloadAsCsv = (columns,data,filename)=>{

        const csvData = makeCsvData(columns, data);
        const csvFile = new Blob([csvData], { type: "text/csv" });
        const downloadLink = document.createElement("a");

        downloadLink.display = "none";
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

    }

     const makeCsvData = (columns, data) => {
        return data.reduce((csvString, rowItem) => {
            return (
                csvString +
                columns
                .map(({ accessor }) => escapeCsvCell(accessor(rowItem)))
                .join(",") +
                "\r\n"
            );
        }, columns.map(({ name }) => escapeCsvCell(name)).join(",") + "\r\n");
    };

    const escapeCsvCell = (cell) => {
        if (cell == null) {
            return "";
        }
        const sc = cell.toString().trim();
        if (sc === "" || sc === '""') {
            return sc;
        }
        if (sc.includes('"') || sc.includes(",") || sc.includes("\n") || sc.includes("\r")) {
            return '"' + sc.replace(/"/g, '""') + '"';
        }
        return sc;
    };

    return (
        <div className='table-area'>
            <h4>{title} {download ? <FaFileDownload className="downloadIcon" onClick={handleDownloadCsv} title={"Download as CSV"} cursor={"pointer"}/> : ''}</h4>
            <CompactTable columns = {COLUMNS} data={tableData} theme={theme} pagination={pagination}/>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{fontSize:"16px"}}>Total Pages: {pagination.state.getTotalPages(tableData.nodes)}</span>

                <span style={{fontSize:"16px"}}>
                Page:{" "}
                {pagination.state.getPages(tableData.nodes).map((_, index) => (
                    <button
                    key={index}
                    type="button"
                    style={{
                        fontSize:"14px",
                        fontWeight: pagination.state.page === index ? "bold" : "normal",
                    }}
                    onClick={() => pagination.fns.onSetPage(index)}
                    >
                    {index + 1}
                    </button>
                ))}
                </span>
            </div>
        </div>
        
    )
       
}

export default Table