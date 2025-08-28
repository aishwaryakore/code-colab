import React, { useState } from 'react'
import Client from './Client'
import Editor from './Editor'

const EditorPage = () => {
    const [members, setMembers] = useState([
        { socketId: 1, username: "Aishwarya" },
        { socketId: 2, username: "Kore" }
    ])
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
                        <button className="btn btn-success w-100 mb-2">
                            Copy Room ID
                        </button>
                        <button className="btn btn-danger w-100">
                            Leave Room
                        </button>
                    </div>
                </div>
                <div className="col-md-10 text-light d-flex flex-column">
                    <Editor />
                </div>
            </div>
        </div>
    )


}

export default EditorPage