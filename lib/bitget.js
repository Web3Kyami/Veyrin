const API = 'https://api.bitget.com';
const INSTRUMENT_PATH = '/api/v3/market/instruments';
const CANDLE_PATH = '/api/v3/market/history-candles';

async function bitgetJson(path, params) {
  const url = new URL(path, API);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, String(value));
  const response = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(9000) });
  if (!response.ok) throw new Error(`BITGET_HTTP_${response.status}`);
  const body = await response.json();
  if (!body || body.code !== '00000' || !Array.isArray(body.data)) throw new Error('BITGET_INVALID_RESPONSE');
  return body;
}

function selectNvdaRealityInstrument(items) {
  const candidates = items.filter(item => {
    const identity = `${item.symbol || ''} ${item.baseCoin || ''}`.toUpperCase();
    const rwaFlagAbsent = item.isRwa === undefined || item.isRwa === null;
    const rwaFlagAffirmed = ['yes', 'true', '1'].includes(String(item.isRwa).toLowerCase());
    return item.category === 'SPOT' &&
      (rwaFlagAbsent || rwaFlagAffirmed) &&
      String(item.isReality).toLowerCase() === 'yes' &&
      String(item.symbolType).toLowerCase() === 'stock' &&
      String(item.quoteCoin).toUpperCase() === 'USDT' &&
      identity.includes('NVDA') &&
      String(item.status).toLowerCase() === 'online';
  });
  if (candidates.length !== 1) throw new Error(candidates.length ? 'BITGET_AMBIGUOUS_INSTRUMENT' : 'BITGET_INSTRUMENT_NOT_FOUND');
  return candidates[0];
}

async function findNvdaRealityInstrument() {
  const body = await bitgetJson(INSTRUMENT_PATH, { category: 'SPOT' });
  return selectNvdaRealityInstrument(body.data);
}

async function fetchExactCandle(instrument, window) {
  const startTime = Date.parse(window.startAt);
  const endTime = Date.parse(window.endAt);
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime - startTime !== 15 * 60 * 1000) {
    throw new Error('BITGET_INVALID_WINDOW');
  }
  const body = await bitgetJson(CANDLE_PATH, {
    category: 'SPOT',
    symbol: instrument.symbol,
    interval: '15m',
    startTime,
    endTime,
    type: 'market',
    limit: 10
  });
  const row = body.data.find(value => Array.isArray(value) && Number(value[0]) === startTime);
  if (!row || row.length < 7) throw new Error('BITGET_CANDLE_MISSING');
  const [ts, open, high, low, close, baseVolume, quoteTurnover] = row;
  const numbers = [open, high, low, close, baseVolume, quoteTurnover].map(Number);
  if (!numbers.every(Number.isFinite) || numbers[0] <= 0 || numbers[3] <= 0 || numbers[4] <= 0 || numbers[5] <= 0) {
    throw new Error('BITGET_CANDLE_INVALID_OR_NO_TRADE');
  }
  return {
    symbol: instrument.symbol,
    category: 'SPOT',
    isRwa: instrument.isRwa ?? null,
    isReality: instrument.isReality,
    symbolType: instrument.symbolType,
    status: instrument.status,
    baseCoin: instrument.baseCoin,
    quoteCoin: instrument.quoteCoin,
    interval: '15m',
    startAt: new Date(Number(ts)).toISOString(),
    endAt: new Date(Number(ts) + 15 * 60 * 1000).toISOString(),
    open: numbers[0],
    high: numbers[1],
    low: numbers[2],
    close: numbers[3],
    baseVolume: numbers[4],
    quoteTurnover: numbers[5],
    source: 'Bitget public SPOT historical market candle',
    retrievedAt: new Date().toISOString()
  };
}

async function getPreMarketObservation(window) {
  const instrument = await findNvdaRealityInstrument();
  const candle = await fetchExactCandle(instrument, window);
  if (Date.parse(candle.endAt) > Date.parse(window.endAt)) throw new Error('BITGET_PRE_CANDLE_CROSSES_CUTOFF');
  return candle;
}

async function getPostMarketObservation(window, expectedSymbol) {
  const instrument = await findNvdaRealityInstrument();
  if (instrument.symbol !== expectedSymbol) throw new Error('BITGET_INSTRUMENT_CHANGED_SINCE_SEAL');
  return fetchExactCandle(instrument, window);
}

module.exports = { selectNvdaRealityInstrument, findNvdaRealityInstrument, getPreMarketObservation, getPostMarketObservation };
