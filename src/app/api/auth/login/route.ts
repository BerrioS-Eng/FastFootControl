import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://fast-food-back-uh35.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Login request received:', body);
    
    // Try different endpoints and formats based on common Spring Boot patterns
    const endpoints = ['/auth/login', '/api/auth/login', '/login', '/api/login'];
    const formats = [
      body, // Original format
      { username: body.userName || body.username, password: body.password }, // username format
      { userName: body.userName || body.username, password: body.password }, // userName format
      { email: body.userName || body.username, password: body.password } // email format
    ];
    
    for (let e = 0; e < endpoints.length; e++) {
      const endpoint = endpoints[e];
      
      for (let i = 0; i < formats.length; i++) {
        const currentFormat = formats[i];
        console.log(`Trying endpoint ${endpoint} with format ${i + 1}:`, currentFormat);
        
        try {
          const response = await fetch(`${BACKEND_URL}${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(currentFormat),
          });
        
          console.log(`Backend response status for endpoint ${endpoint} format ${i + 1}:`, response.status);
          
          let data;
          const responseText = await response.text();
          console.log(`Backend raw response for endpoint ${endpoint} format ${i + 1}:`, responseText);
          
          try {
            data = JSON.parse(responseText);
          } catch {
            data = { message: responseText };
          }

          if (response.ok) {
            console.log(`Login successful with endpoint ${endpoint} format ${i + 1}:`, data);
            return NextResponse.json(data, { status: 200 });
          } else if (response.status !== 400 && response.status !== 404) {
            // If it's not a bad request or not found, return the error immediately
            console.error(`🔴 Backend returned error with endpoint ${endpoint} format ${i + 1}:`, response.status, data);
            return NextResponse.json(
              { error: data.message || `Backend error: ${response.status}` },
              { status: response.status }
            );
          }
          
          console.log(`Endpoint ${endpoint} format ${i + 1} failed with ${response.status}, trying next...`);
        } catch (formatError) {
          console.error(`🔴 Error with endpoint ${endpoint} format ${i + 1}:`, formatError);
        }
      }
    }
    
    // If all combinations failed
    return NextResponse.json(
      { error: 'All login combinations failed. Please check credentials and backend configuration.' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('🔴 Auth API Error:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}