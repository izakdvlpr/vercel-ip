import { headers } from 'next/headers';

export async function GET() {
  const allHeaders = await headers();
  
  const forwardedFor = allHeaders?.get('x-forwarded-for')?.split(', ')?.[0]?.trim()
  const realIp = allHeaders?.get('x-real-ip')?.trim()
  
  if (forwardedFor) {
    const geoData = await getGeoData(realIp)
    
    return { ip: forwardedFor, type: 'forwardedFor', geoData }
  }
  
  if (realIp) { 
    const geoData = await getGeoData(realIp)
    
    return { ip: realIp, type: 'realIp', geoData }
  }
  
  return { ip: null, type: 'unknown' }
}

async function getGeoData(ip) {
  const response = await fetch(`http://ip-api.com/json/${ip}`)
  const data = await response.json()
  
  return data
}