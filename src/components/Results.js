import Table from "./Table"
import { useEffect } from "react";

function Results({matched,internalOnly,providerOnly}){

    useEffect(() => {

       window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

    }, []);

    
    return(
        <div>
            {matched.length > 0 ? <Table data={matched} title = {"Matched Transactions"} download={true}/> : ' '}
            {internalOnly.length > 0 ? <Table data={internalOnly} title = {"Transactions Present only in Internal File"} download={true}/> : ' '}
            {providerOnly.length > 0 ? <Table data={providerOnly} title = {"Transactions Present only in Provider File"} download={true}/> : ' '}
        </div>
    )
}

export default Results