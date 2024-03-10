import React from 'react';
import './App.css';
import {GameSessionRunner, GameSessionRunningResult} from "./core/gameSessionRunner";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-enterprise";

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import {GetDetailRowDataParams, ValueGetterParams} from "ag-grid-community";
import {GameSessionResult} from "./core/gameSession"; // Optional Theme applied to the grid

const App = () => {
    const results: GameSessionRunningResult [] = []
    //FOR 1 to 7 cards to draw
    for (let cardsToDraw = 3; cardsToDraw <= 3; cardsToDraw++) {
        for (let maxNumberOfGambles: number = 0; maxNumberOfGambles <= 5; maxNumberOfGambles++) {
            const numberOfGames = 3000;
            for (let stoppingAt = 2; stoppingAt <= 7; stoppingAt++) {
                results.push(new GameSessionRunner().run(numberOfGames, cardsToDraw, 0, stoppingAt, maxNumberOfGambles));
            }
            // FOR 0 to 7 resetting from
            for (let resettingFrom = 2; resettingFrom <= 7; resettingFrom++) {
                //FOR 7 to 10 stopping at
                for (let stoppingAt = 2; stoppingAt <= 7; stoppingAt++) {
                    results.push(new GameSessionRunner().run(numberOfGames, cardsToDraw, resettingFrom, stoppingAt, maxNumberOfGambles));
                }
            }
        }

    }


    return (<div style={{height: '100%', width: '100%'}} className="ag-theme-quartz">
        {/*{results.map(result => (<Result result={result}/>))}*/}
        <AgGridReact<GameSessionRunningResult>
            enableRangeSelection={true}
            statusBar={{
                statusPanels: [
                    {
                        statusPanel: 'agTotalAndFilteredRowCountComponent',
                        align: 'left',
                    }
                ]
            }}
            rowData={results}
            columnDefs={[
                {
                    field: 'resettingFrom', cellStyle: (params) => ({
                        backgroundColor: params.value < 4 ? 'green' : params.value < 6 ? 'orange' : 'red'
                    })
                },
                {
                    field: 'stoppingAt', cellStyle: (params) => ({
                        backgroundColor: params.value < 4 ? 'green' : params.value < 6 ? 'orange' : 'red'
                    })
                },
                {
                    field: 'maxNumberOfGambles', cellStyle: (params) => ({
                        backgroundColor: params.value < 3 ? 'green' : params.value < 4 ? 'orange' : 'red'
                    })
                },
                {field: 'cardsToDraw'},
                {field: 'sessionsToRun', cellRenderer: 'agGroupCellRenderer'},
                {field: 'averageScore'},
                {field: 'deviation'},
                {field: 'maxScore'},
                {field: 'avgCardsCount'},
            ]}
            defaultColDef={{
                filter: true,
                flex: 1
            }}
            detailRowHeight={800}
            masterDetail={true}
            detailCellRendererParams={{
                detailGridOptions: {
                    detailRowHeight: 500,
                    masterDetail: true,
                    detailCellRendererParams: {
                        detailGridOptions: {
                            columnDefs: [{
                                headerName: 'card',
                                valueGetter: (params: ValueGetterParams) => params.data.card.toString()
                            }, {
                                field: 'source'
                            },
                                {field: 'result'},
                                {field: 'gamblesTaken'},
                            ]
                        },
                        getDetailRowData: (params: GetDetailRowDataParams<GameSessionResult>) => {
                            params.successCallback(params.data.playedCards);
                        },
                    },
                    columnDefs: [
                        {
                            valueGetter: (params: ValueGetterParams) => {
                                if (params.node!.group) return params.node!.key;
                                return params.data.playedCards.length
                            },
                            rowGroup: true,
                            aggFunc: 'count',
                            sort: 'desc',
                            hide: true
                        },
                        {field: 'score', aggFunc: 'avg',}
                    ],
                    autoGroupColumnDef: {
                        headerName: 'Played cards'
                    },
                    defaultColDef: {
                        flex: 1,
                        filter: true,
                    },
                },
                getDetailRowData: (params: GetDetailRowDataParams<GameSessionRunningResult>) => {
                    params.successCallback(params.data.results);

                },

            }}
        />
    </div>);
};

export interface ResultProps {
    result: GameSessionRunningResult
}

const Result = ({result}: ResultProps) => {
    return <div className="App" style={{display: 'flex', justifyContent: 'space-around'}}>
        <div>
            <h2>Games played</h2>
            <h2>{result.sessionsToRun}</h2>
        </div>
        <div>
            <h2>Cards drawn</h2>
            <h2>{result.cardsToDraw}</h2>
        </div>
        <div>
            <h2>Resetting from</h2>
            <h2>{result.resettingFrom}</h2>
        </div>
        <div>
            <h2>Stopping at</h2>
            <h2>{result.stoppingAt}</h2>
        </div>
        <div>
            <h2>Avg Score</h2>
            <h2>{result.averageScore.toFixed(1)}</h2>
        </div>
        <div>
            <h2>Max Score</h2>
            <h2>{result.maxScore}</h2>
        </div>
        <div>
            <h2>Deviation</h2>
            <h2>{result.deviation.toFixed(1)}</h2>
        </div>
    </div>
}

export default App;
