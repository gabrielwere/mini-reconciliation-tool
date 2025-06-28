import { parse } from "papaparse"
import { useState,useEffect } from "react"
import Table from "./Table";
import Results from "./Results";
import { FaTimes } from "react-icons/fa";

function Dashboard(){


    const [internalFileData,setInternalFileData] = useState([]);
    const [providerFileData,setProviderFileData] = useState([]);
    const [matchedTransactions,setMatchedTransactions] = useState([])
    const [internalOnlyTransactions,setInternalOnlyTransactions] = useState([])
    const [providerOnlyTransactions,setProviderOnlyTransactions] = useState([])
    const [showResultsTable,setShowResultsTable] = useState(false)
    const [showInputSection,setShowInputSection] = useState(true)

    useEffect(()=>{
        window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})
    },[providerFileData])

    const internalDataUpload = (event)=>{

        parse(event.target.files[0],{
            header:true,
            skipEmptyLines:true,
            complete:function(results){
                setInternalFileData(results.data)
            }
        })
    }

    const providerDataUpload = (event)=>{
        
        parse(event.target.files[0],{
            header:true,
            skipEmptyLines:true,
            complete:function(results){
                setProviderFileData(results.data)
            }
        })
    }

    const reconcileTransactions = ()=>{
        if(internalFileData.length === 0 || providerFileData.length === 0){
            window.alert("Give 2 CSV files to Reconcile")            
        }else{
            //transactions that appear in both the internal system export file
            //and the provider statement file
            const both = internalFileData.filter((obj1)=>{
                return providerFileData.find((obj2)=>{
                    return obj1.transaction_reference === obj2.transaction_reference
                })
            })

            setMatchedTransactions(both)

            //transactions that appear only in the internal system export file
            const internal = internalFileData.filter((obj1)=>{
                return !both.find((obj2)=>{
                    return obj1.transaction_reference === obj2.transaction_reference
                })
            })
            setInternalOnlyTransactions(internal)

             //transactions that appear only in the provider statement file
            const provider = providerFileData.filter((obj1)=>{
                return !both.find((obj2)=>{
                    return obj1.transaction_reference === obj2.transaction_reference
                })
            })
            setProviderOnlyTransactions(provider)

            setShowResultsTable(true)
            setShowInputSection(false)
        }
    }

    const hideResults = ()=>{
        setShowResultsTable(false)
        setShowInputSection(true)
    }

    return (

        <div>
            {
                showInputSection === false ? ' ' :

                <>
                    <h2>Mini Reconciliation Tool</h2>
                    <table id="input-table">
                        <tbody>
                            <tr>
                                <td>Internal System Export File : </td>
                                <td><input type="file" accept=".csv" name="internal-file" onChange={internalDataUpload}/></td>
                            </tr>

                            <tr>
                                <td>Provider Statement File : </td>
                                <td><input type="file" accept=".csv" name="provider-file" onChange={providerDataUpload}/></td>
                            </tr>

                        </tbody>
                    </table>

                    <div>
                        {
                            internalFileData.length === 0 ? ' ' :
                            <Table data={internalFileData} title={"Internal System Export File"} download={false}/>
                        }
                    </div>
                   
                    <div>
                            {
                                providerFileData.length === 0 ? ' ' :
                                <Table data={providerFileData} title={"Provider Statement File"} download={false}/>
                            }
                    </div>
                    

                    {
                        internalFileData.length === 0 || providerFileData.length === 0 ? '' :
                        <div style={{textAlign:"center"}}>
                            <button onClick={reconcileTransactions} className="reconcile">
                                Reconcile Transactions
                            </button>
                        </div>
                    }

                </>

            }
            
            {
                showResultsTable === true && (
                matchedTransactions.length > 0 ||
                internalOnlyTransactions.length > 0 ||
                providerOnlyTransactions.length > 0) ?
                 <>
                    <FaTimes onClick={hideResults} cursor={"pointer"} className="close-icon" size={"30px"} title="Close Results Table"/>
                    <Results matched={matchedTransactions} internalOnly={internalOnlyTransactions} providerOnly={providerOnlyTransactions}/>
                </>
                : ' '

            }
        </div>
    )
}

export default Dashboard