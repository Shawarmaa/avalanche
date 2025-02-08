import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartProps {
    inputToken: string;
    targetToken: string;
    amount: string;
  }

const Chart: React.FC<ChartProps> = ({ inputToken, targetToken, amount }) => {
  const [chartData, setChartData] = useState<ChartData<"line"> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (inputToken && targetToken) {
      fetchChartData(inputToken, targetToken, amount);
    }
  }, [inputToken, targetToken, amount]);

  const tokenIdMapping: { [key: string]: string } = {
    BTC: "bitcoin",
    ETH: "ethereum",
    XRP: "ripple",
    // Add other token mappings as needed
  };

  const fetchChartData = async (inputToken: string, targetToken: string, amount: string) => {
    const inputId = tokenIdMapping[inputToken.toUpperCase()] || inputToken;
    const targetId = tokenIdMapping[targetToken.toUpperCase()] || targetToken;
    console.log(inputId)
    console.log(targetId)

    setLoading(true);
    try {
        
    const [inputResponse, targetResponse] = await Promise.all([
        axios.get(`https://api.coingecko.com/api/v3/coins/${inputId}/market_chart`, {
            params: {
            vs_currency: "usd",  // Change this to the desired currency
            days: 30,
            },
        }),
        axios.get(`https://api.coingecko.com/api/v3/coins/${targetId}/market_chart`, {
            params: {
            vs_currency: "usd",
            days: 30,
            },
        }),
        ]);

      const inputPrices = inputResponse.data.prices.map((item: [number, number]) => item[1]);
      const targetPrices = targetResponse.data.prices.map((item: [number, number]) => item[1]);
      const labels = inputResponse.data.prices.map((item: [number, number]) =>
        new Date(item[0]).toLocaleDateString()
      );

      setChartData({
        labels,
        datasets: [
          {
            label: `${inputToken.toUpperCase()} Price (${amount.toUpperCase()})`,
            data: inputPrices,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
          },
          {
            label: `${targetToken.toUpperCase()} Price (${amount.toUpperCase()})`,
            data: targetPrices,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">{`${inputToken.toUpperCase()} vs ${targetToken.toUpperCase()} Price Chart`}</h2>
      {loading ? (
        <p>Loading data...</p>
      ) : chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "30-Day Price Trend" },
            },
          }}
        />
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default Chart;