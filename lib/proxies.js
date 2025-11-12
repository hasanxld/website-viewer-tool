// Free proxy list - You can expand this list
export const proxyList = [
  {
    ip: '191.101.39.27',
    port: '80',
    country: 'US',
    type: 'HTTP'
  },
  {
    ip: '45.95.147.373',
    port: '8080',
    country: 'DE',
    type: 'HTTP'
  },
  {
    ip: '185.199.229.156',
    port: '7492',
    country: 'US',
    type: 'HTTP'
  },
  {
    ip: '185.199.228.220',
    port: '7300',
    country: 'US',
    type: 'HTTP'
  },
  {
    ip: '185.199.231.45',
    port: '8382',
    country: 'US',
    type: 'HTTPS'
  },
  {
    ip: '188.74.210.207',
    port: '6072',
    country: 'NL',
    type: 'HTTP'
  },
  {
    ip: '188.74.183.10',
    port: '8279',
    country: 'DE',
    type: 'HTTP'
  },
  {
    ip: '45.155.68.129',
    port: '8133',
    country: 'DE',
    type: 'HTTP'
  },
  {
    ip: '154.95.36.199',
    port: '689',
    country: 'US',
    type: 'HTTP'
  },
  {
    ip: '45.94.47.18',
    port: '8110',
    country: 'DE',
    type: 'HTTP'
  }
];

export const getRandomProxy = () => {
  const randomIndex = Math.floor(Math.random() * proxyList.length);
  return proxyList[randomIndex];
};

export const formatProxyUrl = (proxy) => {
  return `http://${proxy.ip}:${proxy.port}`;
};
