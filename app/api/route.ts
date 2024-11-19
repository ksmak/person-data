import { Server } from 'socket.io';

export const dynamic = 'force-static';

export async function GET() {


    return Response.json({ hello: 'Hello world' })
}