import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const allHeaders = await headers();
  
  const forwardedFor = allHeaders?.get('x-forwarded-for')?.split(', ')?.[0]?.trim()
  const realIp = allHeaders?.get('x-real-ip')?.trim()
  
  if (forwardedFor) {
    const geoData = await getGeoData(realIp)
    
    return NextResponse.json({ ip: forwardedFor, type: 'forwardedFor', geoData })
  }
  
  if (realIp) { 
    const geoData = await getGeoData(realIp)
    
    return NextResponse.json({ ip: realIp, type: 'realIp', geoData })
  }
  
  return NextResponse.json({ message: 'No IP found' })
}

async function getGeoData(ip) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`)
    const data = await response.json()
    
    return data
  } catch (err) {
    console.error('Error fetching geo data:', err)
    
    return null
  }
}