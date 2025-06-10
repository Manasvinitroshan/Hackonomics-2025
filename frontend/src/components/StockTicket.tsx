// src/components/StockTicker.tsx
import React, { FC } from "react";
import "../styles/StockTicker.css";

interface StockItem {
  symbol: string;
  price: number;
  change: number;
}

const stockData: StockItem[] = [
  { symbol: "AAPL",   price: 187.32, change:  1.25 },
  { symbol: "MSFT",   price: 412.65, change: -2.01 },
  { symbol: "AMZN",   price: 178.45, change:  0.67 },
  { symbol: "GOOGL",  price: 165.89, change: -0.35 },
  { symbol: "META",   price: 475.12, change:  5.23 },
  { symbol: "TSLA",   price: 218.75, change: -1.89 },
  { symbol: "NVDA",   price: 894.23, change: 12.45 },
  { symbol: "JPM",    price: 192.34, change: -0.23 },
  { symbol: "V",      price: 274.56, change:  1.12 },
  { symbol: "WMT",    price:  61.32, change:  0.48 },
  { symbol: "JNJ",    price: 152.19, change: -0.75 },
  { symbol: "PG",     price: 165.87, change:  0.29 },
  { symbol: "XOM",    price: 114.32, change: -1.05 },
  { symbol: "BAC",    price:  37.45, change:  0.38 },
  { symbol: "MA",     price: 453.28, change: -2.37 },
  { symbol: "ADBE",   price: 484.19, change:  4.12 },
  { symbol: "CRM",    price: 275.63, change: -1.23 },
  { symbol: "DIS",    price: 118.92, change:  0.87 },
  { symbol: "NFLX",   price: 592.45, change:  8.23 },
  { symbol: "PYPL",   price:  64.52, change: -0.34 },
];

// Now with four rows instead of three
const tickerRows: StockItem[][] = [
  stockData, 
  stockData, 
  stockData, 
  stockData
];

const StockTicker: FC = () => (
  <div className="ticker-container">
    {tickerRows.map((row, idx) => (
      <div
        key={idx}
        // alternate direction on every other row
        className={`ticker-row${idx % 2 === 1 ? " reverse" : ""}`}
      >
        <div className="ticker-content">
          {/* Duplicate the array so it’s row+row → seamless infinite scroll */}
          {[...row, ...row].map((item, i) => (
            <div
              className="ticker-item"
              key={`${idx}-${i}`}
              style={{ color: "#FFFFFF" }} // force white text
            >
              <span className="symbol">{item.symbol}</span>
              <span className="price">${item.price.toFixed(2)}</span>
              <span className={item.change >= 0 ? "change positive" : "change negative"}
  style={{
    color: item.change >= 0 ? "#4caf50" : "#f44336",
  }}
              >
                {item.change >= 0 ? "+" : ""}
                {item.change.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default StockTicker;
