import { NextRequest, NextResponse } from 'next/server';

const getBackendUrl = () => {
    let url = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    if (!url.startsWith('http') && !url.startsWith('/')) {
        url = `https://${url}`;
    }
    return url;
};

const BACKEND_URL = getBackendUrl();

async function handleProxy(request: NextRequest, pathSegments: string[]) {
    const path = pathSegments.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `${BACKEND_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;

    const headers = new Headers(request.headers);
    // Xóa host header để tránh lỗi mismatch host ở backend
    headers.delete('host');

    try {
        const response = await fetch(targetUrl, {
            method: request.method,
            headers: headers,
            body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : undefined,
            cache: 'no-store',
        });

        const data = await response.blob();

        // Tạo headers mới để tránh xung đột mã hóa dữ liệu
        const responseHeaders = new Headers(response.headers);
        responseHeaders.delete('content-encoding');
        responseHeaders.delete('content-length');

        return new NextResponse(data, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (error) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: 'Proxy failed to reach backend' }, { status: 502 });
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleProxy(request, (await params).path);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleProxy(request, (await params).path);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleProxy(request, (await params).path);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleProxy(request, (await params).path);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleProxy(request, (await params).path);
}
