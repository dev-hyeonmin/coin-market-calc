export interface Coin {
  id: string;
  name: string;
  symbol: string;
  date_added: string;
}

export interface Ohlcv {
  close: string;
  open: string;
  high: string;
  low: string;
  market_cap: string;
  timestamp: string;
}

export interface Quote {
  USD: Ohlcv;
}

export interface Quotes {
  quote: Quote;
  time_close: string;
}

export interface Historical {
  id: string;
  name: string;
  symbol: string;
  quotes: Quotes[];
}