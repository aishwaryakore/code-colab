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
        <div className="container-fluid">
            <div className="row justify-content-center align-items-center min-vh-100">
                <div className="col-12 col-md-6">
                    <div className="card shadow-sm p-2 mb-5 bg-secondary rounded">
                        <div className="card-body text-center bg-dark">
                            <img
                                src="/images/codecast.png"
                                alt="Logo"
                                className="img-fluid mx-auto d-block"
                                style={{ maxWidth: "150px" }}
                            />
                            <h4 className="card-title text-light mb-4">Enter the ROOM ID</h4>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="ROOM ID"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="USERNAME"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-success btn-lg btn-block" onClick={joinRoom}>
                                JOIN
                            </button>
                            <p className="mt-3 text-light">
                                Don't have a room ID? create{" "}
                                <span
                                    className=" text-success p-2"
                                    style={{ cursor: "pointer" }}
                                    onClick={generateRoomId}
                                >
                                    {" "}
                                    New Room
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