import React, { useState, useEffect } from "react";

const Terminal = ({ socketRef, roomId, codeRef }) => {
    const [output, setOutput] = useState("");
    const [language, setLanguage] = useState("javascript");

    const runCode = () => {
        if (!socketRef.current || !codeRef.current) return;
        
        socketRef.current.emit("execute-code", {
            roomId,
            code: codeRef.current,
            language,
        });
    };

    useEffect(() => {
        if (!socketRef.current) return;
        console.log("soxket: ", socketRef.current)

        const handleOutput = ({ result, error }) => {
            setOutput(result || error || "");
        };

        socketRef.current.on("code-output", handleOutput);

        return () => {
            socketRef.current.off("code-output", handleOutput);
        };
    }, [socketRef]);

    return (
        <div
            style={{
                backgroundColor: "#1e1e1e",
                color: "#d4d4d4",
                padding: "1rem",
                minHeight: "150px",
                fontFamily: "monospace",
                overflowY: "auto",
                marginTop: "8px",
            }}
        >
            <div style={{ marginBottom: "0.5rem" }}>Terminal Output:</div>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{output}</pre>

            <div className="d-flex align-items-center mt-2">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={{ marginRight: "8px", padding: "0.3rem" }}
                >
                    <option value="javascript">JavaScript</option>
                    <option value="python3">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    {/* Add more languages as needed */}
                </select>

                <button
                    onClick={runCode}
                    style={{
                        backgroundColor: "#88c0d0",
                        border: "none",
                        color: "#2e3440",
                        fontWeight: "bold",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                    }}
                >
                    Run
                </button>
            </div>
        </div>
    );
};

export default Terminal;
