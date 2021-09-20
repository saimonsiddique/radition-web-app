import React, { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:8000/api";
const maxData = 50;
let interval = null;

export default function App() {
    const [rows, setRows] = useState([]);
    const [map, setMap] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let prevInterval = localStorage.getItem("interval");
        if (prevInterval) {
            clearInterval(prevInterval);
        }
        interval = setInterval(() => {
            fetch(`${API}/radiation`, {
                method: "GET",
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    if (data.hasChanged) {
                        setRows(data.results);
                    }
                })
                .catch(err => console.log(err));
        }, 15000);

        if (typeof window !== "undefined") {
            localStorage.setItem("interval", interval);
        }
    }, []);

    const loadData = () => {
        setLoading(true);
        fetch(`${API}/generate`, {
            method: "GET",
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                setLoading(false);
                console.log(data);
            })
            .catch(err => console.log(err));
    };

    const loadMap = () => {
        fetch(`${API}/map`, {
            method: "GET",
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (data.hasChanged) {
                    // setHasChanged(true);
                    setMap(data.map);
                } else {
                    // setHasChanged(false);
                    // clearInterval(interval);
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='container'>
            <h1
                className='stylish text-center mt-3 px-0'
                style={{
                    textTransform: "uppercase",
                    textShadow: "2px 2px 5px #343A40",
                }}
            >
                Radiation Detection Project
            </h1>

            <div className='row mt-5'>
                <div className='col-md-5 col-sm-12 px-0 mb-5'>
                    <div
                        className='px-0 table-responsive review'
                        style={{
                            height: "475px",
                            overflowY: "scroll",
                            textAlign: "center",
                        }}
                    >
                        {rows.length > 0 ? (
                            <table className='table table-striped table-bordered mx-auto'>
                                <thead className='thead-dark'>
                                    <tr>
                                        {Object.keys(rows[0])
                                            .slice(1)
                                            .map(column => (
                                                <th key={column} scope='col'>
                                                    {column}
                                                </th>
                                            ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map(row => {
                                        return (
                                            <tr key={row.Time}>
                                                <td>
                                                    {Number(row.Lat).toFixed(5)}
                                                </td>
                                                <td>
                                                    {Number(row.Long).toFixed(
                                                        5
                                                    )}
                                                </td>
                                                <td>
                                                    {Number(row.Rad).toFixed(3)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <p>
                                <strong>"Please Load Data First"</strong>
                            </p>
                        )}
                    </div>
                    <div className='px-0 mt-3'>
                        <button
                            type='button'
                            className='btn btn-primary btn-block'
                            style={{
                                fontSize: "120%",
                                textTransform: "uppercase",
                            }}
                            disabled={loading}
                            onClick={loadData}
                        >
                            <b>Load Data</b>
                        </button>
                    </div>
                </div>

                <div className='col-md-2 col-sm-0'></div>

                {/* 4:3 aspect ratio */}
                <div
                    className='col-md-5 col-sm-12 px-0 mb-5'
                    style={{ height: "475px" }}
                >
                    <div className='px-0 review embed-responsive embed-responsive-1by1'>
                        {map ? (
                            <iframe
                                className='embed-responsive-item'
                                srcDoc={map}
                                title='Iframe Example'
                            ></iframe>
                        ) : null}
                    </div>
                    <div className='px-0 mt-3'>
                        <button
                            type='button'
                            className='btn btn-success btn-block'
                            style={{
                                fontSize: "120%",
                                textTransform: "uppercase",
                            }}
                            disabled={loading || rows.length < maxData}
                            onClick={loadMap}
                        >
                            <b>View Map</b>
                        </button>
                    </div>
                </div>
                {/* <iframe
                src={process.env.PUBLIC_URL + "my_map.html"}
                style={{ height: "200px", width: "300px" }}
                title='Iframe Example'
            ></iframe> */}
            </div>
        </div>
    );
}