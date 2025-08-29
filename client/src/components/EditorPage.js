import React, { useEffect, useState, useRef } from 'react'
import Client from './Client'
import Editor from './Editor'
import { initSocket } from '../Socket'
import { useLocation, useParams, useNavigate, Navigate } from 'react-router-dom'
import { toast } from "react-hot-toast";

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
        <div className="container-fluid vh-100 d-flex flex-column">
            <div className="row flex-grow-1">
                <div className="col-md-2 bg-dark text-light d-flex flex-column">
                    <img
                        src="/images/codecast.png"
                        alt="Logo"
                        className="img-fluid mx-auto"
                        style={{ maxWidth: "150px", marginTop: "-43px" }}
                    />
                    <hr style={{ marginTop: "-3rem" }} />
                    <div className="d-flex flex-column flex-grow-1 overflow-auto">
                        <span className="mb-2">Members</span>
                        {members.map((member) => (
                            <Client key={member.socketId} username={member.username} />
                        ))}
                    </div>
                    <hr />
                    <div className="mt-auto mb-3">
                        <button className="btn btn-success w-100 mb-2" onClick={copyRoomId}>
                            Copy Room ID
                        </button>
                        <button className="btn btn-danger w-100" onClick={leaveRoom}>
                            Leave Room
                        </button>
                    </div>
                </div>
                <div className="col-md-10 text-light d-flex flex-column">
                    <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => {
                        codeRef.current = code;
                    }} />
                </div>
            </div>
        </div>
    )


}

export default EditorPage