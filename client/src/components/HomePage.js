import React, { useState } from 'react'
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

    const navigate = useNavigate();

    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");

    const generateRoomId = (e) => {
        e.preventDefault();
        const Id = uuid();
        setRoomId(Id);
        toast.success("Room Id is generated");
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error("Both the field is requried");
            return;
        }
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
        toast.success("room is created");
    };

    return (
        <div
            className="container-fluid"
            style={{ backgroundColor: "#2e3440", minHeight: "100vh" }}
        >
            <div className="row justify-content-center align-items-center min-vh-100">
                <div className="col-12 col-md-6">
                    <div
                        className="card shadow-lg p-4 mb-5 rounded"
                        style={{ backgroundColor: "#3b4252", border: "none" }}
                    >
                        <div className="card-body text-center">
                            <img
                                src="/images/codecast.png"
                                alt="Logo"
                                className="img-fluid mx-auto d-block mb-3"
                                style={{ maxWidth: "150px" }}
                            />
                            <h4 className="card-title mb-4" style={{ color: "#eceff4" }}>
                                Enter Room ID
                            </h4>

                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Room ID"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    style={{
                                        backgroundColor: "#434c5e",
                                        color: "#eceff4",
                                        border: "1px solid #4c566a",
                                    }}
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{
                                        backgroundColor: "#434c5e",
                                        color: "#eceff4",
                                        border: "1px solid #4c566a",
                                    }}
                                />
                            </div>

                            <button
                                className="btn btn-lg w-100"
                                onClick={joinRoom}
                                style={{
                                    backgroundColor: "#88c0d0",
                                    border: "none",
                                    color: "#2e3440",
                                    fontWeight: "bold",
                                }}
                            >
                                Join
                            </button>

                            <p className="mt-3">
                                <span
                                    style={{
                                        cursor: "pointer",
                                        color: "#a3be8c",
                                        fontWeight: "500",
                                    }}
                                    onClick={generateRoomId}
                                >
                                    Generate Room ID
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )


}

export default HomePage