import React, { useEffect, useState, useRef } from 'react'
import Client from './Client'
import Editor from './Editor'
import { initSocket } from '../Socket'
import { useLocation, useParams, useNavigate, Navigate } from 'react-router-dom'
import { toast } from "react-hot-toast";
import { FaSignOutAlt } from "react-icons/fa";
import { FaRegClipboard } from "react-icons/fa";

const EditorPage = () => {
    const [members, setMembers] = useState([])

    const { roomId } = useParams();

    const socketRef = useRef(null);
    const location = useLocation()
    const navigate = useNavigate();
    const codeRef = useRef(null);

    useEffect(() => {
        console.log("editor page")
        const init = async () => {
            socketRef.current = await initSocket()
            socketRef.current.on("connect_error", (err) => handleErrors(err));
            socketRef.current.on("connect_failed", (err) => handleErrors(err));

            const handleErrors = (err) => {
                console.log("Error", err);
                toast.error("Socket connection failed, Try again later");
                navigate("/");
            };
            socketRef.current.emit('join', {
                roomId,
                username: location.state?.username
            })

            socketRef.current.on(
                "joined",
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                    }
                    setMembers(clients)
                    socketRef.current.emit("sync-code", {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );
            socketRef.current.on("disconnected", ({ socketId, username }) => {
                toast.success(`${username} left the room`);
                setMembers((prev) => {
                    return prev.filter((client) => client.socketId !== socketId);
                });
            });

        }
        init()
        return () => {
            socketRef.current && socketRef.current.disconnect();
            socketRef.current.off("joined");
            socketRef.current.off("disconnected");
        };
    }, [])

    if (!location.state) {
        return <Navigate to="/" />;
    }

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success(`Room ID is copied`);
        } catch (error) {
            console.log(error);
            toast.error("Unable to copy the room ID");
        }
    };

    const leaveRoom = async () => {
        navigate("/");
    };

    return (
        <div
            className="container-fluid vh-100 d-flex flex-column"
            style={{ backgroundColor: "#2e3440", color: "#eceff4" }}
        >
            <div className="row flex-grow-1">
                {/* Sidebar */}
                <div
                    className="col-md-2 d-flex flex-column"
                    style={{ backgroundColor: "#3b4252", color: "#eceff4" }}
                >
                    <img
                        src="/images/codecast.png"
                        alt="Logo"
                        className="img-fluid mx-auto mt-3"
                        style={{ maxWidth: "100px" }}
                    />
                    <hr style={{ borderColor: "#4c566a", marginTop: "0.5rem" }} />
                    <div className="d-flex flex-column flex-grow-1 overflow-auto px-2">
                        <span className="mb-2" style={{ fontWeight: "500" }}>
                            Members
                        </span>
                        {members.map((member) => (
                            <Client key={member.socketId} username={member.username} />
                        ))}
                    </div>
                    <hr style={{ borderColor: "#4c566a" }} />
                    <div className="mt-auto mb-3 px-2">
                        <button
                            className="btn w-100 mb-2 d-flex align-items-center justify-content-center"
                            onClick={copyRoomId}
                            style={{
                                backgroundColor: "#88c0d0",
                                border: "none",
                                color: "#2e3440",
                                fontWeight: "bold",
                            }}
                        >
                            <FaRegClipboard size={18} style={{ marginRight: "8px" }} />
                            Room ID
                        </button>
                        <button
                            className="btn w-100 d-flex align-items-center justify-content-center"
                            onClick={leaveRoom}
                            style={{
                                backgroundColor: "#bf616a",
                                border: "none",
                                color: "#eceff4",
                                fontWeight: "bold",
                            }}
                        >
                            <FaSignOutAlt size={18} style={{ marginRight: "8px" }} />
                            Leave
                        </button>
                    </div>
                </div>

                {/* Main Editor */}
                <div
                    className="col-md-10 d-flex flex-column"
                    style={{ backgroundColor: "#2e3440", color: "#eceff4" }}
                >
                    <Editor
                        socketRef={socketRef}
                        roomId={roomId}
                        onCodeChange={(code) => {
                            codeRef.current = code;
                        }}
                    />
                </div>
            </div>
        </div>
    )


}

export default EditorPage