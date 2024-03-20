import { useEffect, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { fetchHistoricalData, fetchTopCoins } from "./api";
import { CalculateResult } from "./components/CalculateResult";
import { CalculatorForm } from "./components/CalculatorForm";
import { Box } from "./components/layout/box/Box";
import { Cell } from "./components/layout/layout/Cell";
import { Coin, Quotes } from "./type";
import { TOP_COINS, formattedDate } from "./utils";

export type FormProps = {
  coin: string;
  day: number;
  yValue: number;
  yValueCondition: number;
  startDate: string;
  endDate: string;
}

function App() {
  const [topCoins, setTopCoins] = useState<Coin[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalProfits, setTotalProfits] = useState<string[]>(Array.from({ length: 14 }, () => '-'));
  const [totalWinRates, setTotalWinRates] = useState<string[]>(Array.from({ length: 14 }, () => '-'));
  const [calcState, setCalcState] = useState(false);
  const [calcYear, setCalcYear] = useState('');

  useEffect(() => {
    fetchTopCoinsData();
  }, []);

  // 상위 200위의 코인 불러오기
  const fetchTopCoinsData = async () => {
    let coins: any = localStorage.getItem(TOP_COINS);
    if (!coins) {
      coins = await fetchTopCoins();
      localStorage.setItem(TOP_COINS, JSON.stringify(coins));
    } else {
      coins = JSON.parse(coins);
    }

    setTopCoins(coins);
  };

  const methods = useForm<FormProps>();
  const onSubmit: SubmitHandler<FormProps> = async (data) => {
    setCalcState(true);

    const COUNT = 365;
    const selectedCoinId = data.coin;
    const yValue = Number(data.yValue) * 0.01;
    const condition = Number(data.yValueCondition); // 1 이상, 2 이하
    const xDaysAgo = Number(data.day);

    let startDate = new Date(data.startDate);
    let endDate = new Date(data.endDate);

    let allQuotes: Quotes[] = []; // 종가 리스트
    let caseCount = 0;
    let futureProfitsArray: number[][] = Array.from({ length: 14 }, () => []); // 평균 수익률
    let winRates: number[][] = Array.from({ length: 14 }, () => []); // 승률

    const selectedCoin = topCoins.find(coin => {
      return coin.id == selectedCoinId;
    });

    if (!selectedCoin) {
      alert(`⚠️ ${selectedCoinId} : Coin Not Found.`);
      setCalcState(false);
      return;
    }

    // 구간이 전체 기간인지, 특정 날짜 기간인지 확인
    if (data.startDate === "전체기간") {
      startDate = new Date(selectedCoin.date_added);
    }

    let date = startDate;
    do {
      // await new Promise((resolve) => setTimeout(resolve, 1000)); // delay
      const dateFormat = formattedDate(startDate);
      const historicalList = await fetchHistoricalData(selectedCoinId, dateFormat, COUNT);
      const quotes = historicalList?.quotes;

      console.log(`Fetch Coin / ${selectedCoinId} : ${dateFormat}`);
      setCalcYear(dateFormat.substring(0, 4));

      if (quotes) {
        allQuotes = [...allQuotes, ...quotes];
      }

      startDate.setDate(date.getDate() + 365); // next date
      // break;
    } while (startDate < endDate)


    allQuotes?.map((data, index) => {
      if (index - xDaysAgo < 0) {
        return;
      }

      // const todayDate = data.time_close.substring(0, 10);
      const todayClose = Number(data.quote.USD.close);
      const xDaysAgoClose = Number(allQuotes[index - xDaysAgo]?.quote.USD.close);

      const profit = (todayClose / xDaysAgoClose) - 1; // 과거 수익률

      if ((condition === 1 && profit >= yValue) || (condition === 2 && profit <= yValue)) {
        caseCount++;

        // 1일 - 14일 이후의 과거 수익률 계산
        for (let j = 1; j <= 14; j++) {
          if ((index + j) > allQuotes.length - 1) {
            return;
          }

          const futureClose = Number(allQuotes[index + j]?.quote.USD.close);
          const futureProfit = (futureClose / todayClose) - 1;

          futureProfitsArray[j - 1].push(futureProfit);
          winRates[j - 1].push(futureProfit > 0 ? 1 : 0);
        }
      }
    });

    setTotalCount(caseCount);

    const profitResult = futureProfitsArray.map(innerArray =>
      (innerArray.reduce((acc, currentValue) => acc + currentValue, 0) / caseCount * 100).toFixed(2) + "%"
    );

    const winRateResult = winRates.map(innerArray =>
      (innerArray.reduce((acc, currentValue) => acc + currentValue, 0) / caseCount * 100).toFixed(2) + "%"
    );


    setTotalProfits(profitResult);
    setTotalWinRates(winRateResult);
    setCalcState(false);
  }

  return (
    <Box width="100%" height="100%" align="center" verticalAlign="middle" direction="vertical">
      <Box width="fit-content" align="center" verticalAlign="middle" direction="vertical" className="calc-box">
        <Box gap="80px">
          <Cell span={4}>
            <h1>CoinMarketCap<br />Calculator</h1>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} autoComplete="off">
                <CalculatorForm topCoins={topCoins} />
                <button type="submit" disabled={calcState}>
                  {calcState ? `${calcYear ? `${calcYear}년을 ` : ''}열심히 계산중이에요 🙆‍♀️` : '계산하기'}
                </button>
              </form>
            </FormProvider>
          </Cell>

          <Cell span={3}>
            <CalculateResult
              totalProfits={totalProfits}
              totalWinRates={totalWinRates}
              totalCount={totalCount} />
          </Cell>
        </Box>
      </Box>
    </Box>
  )
}

export default App