'use client'

import io from 'socket.io-client';
import { useEffect } from "react";

export function SocketClient() {
    useEffect(() => {
        const socket = io("http://localhost:3001");

        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>

        </div>
    )
}