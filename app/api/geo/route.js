import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const ip = await getIp()
  const geoData = await getGeoData(ip)
  
  return NextResponse.json(geoData)
}

async function getIp() {
  const allHeaders = await headers();
  
  const forwardedFor = allHeaders?.get('x-forwarded-for')?.split(', ')?.[0]?.trim()
  const realIp = allHeaders?.get('x-real-ip')?.trim()
  
  return forwardedFor ?? realIp ?? null
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