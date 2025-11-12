import { NextResponse } from 'next/server';
import axios from 'axios';
import { getRandomProxy } from '../../../../lib/proxies';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const proxy = getRandomProxy();
    const userAgent = generateUserAgent();

    const config = {
      method: 'GET',
      url: url,
      timeout: 10000,
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      },
      proxy: {
        protocol: 'http',
        host: proxy.ip,
        port: parseInt(proxy.port)
      },
      validateStatus: function (status) {
        return status >= 200 && status < 600;
      }
    };

    const startTime = Date.now();
    const response = await axios(config);
    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      status: response.status,
      responseTime,
      proxy: {
        ip: proxy.ip,
        port: proxy.port,
        country: proxy.country,
        type: proxy.type
      },
      userAgent: userAgent
    });

  } catch (error) {
    console.error('Proxy request failed:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      retry: true 
    }, { status: 500 });
  }
}

function generateUserAgent() {
  const agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  ];
  return agents[Math.floor(Math.random() * agents.length)];
}
