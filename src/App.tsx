import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { fetchHistoricalData, fetchTopCoins } from "./api";
import { CalculateResult } from "./components/CalculateResult";
import { Box } from "./components/layout/box/Box";
import { Cell } from "./components/layout/layout/Cell";
import { Text } from "./components/typography/Text";
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

  const {
    register,
    handleSubmit
  } = useForm<FormProps>()
  const onSubmit: SubmitHandler<FormProps> = async (data) => {
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
      console.log(`⚠️ ${selectedCoinId} : Coin Not Found.`);
      return;
    }

    // 구간이 전체 기간인지, 특정 날짜 기간인지 확인
    if (data.startDate === "전체기간") {
      startDate = new Date(selectedCoin.date_added);
      startDate = new Date('2020-04-10');
    }

    let date = startDate;
    do {
      // await new Promise((resolve) => setTimeout(resolve, 1000)); // delay
      const dateFormat = formattedDate(startDate);
      const historicalList = await fetchHistoricalData(selectedCoinId, dateFormat, COUNT);
      const quotes = historicalList?.quotes;

      console.log(`Fetch Coin / ${selectedCoinId} : ${dateFormat}`);

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
  }

  return (
    <Box width="100%" height="100%" align="center" verticalAlign="middle" direction="vertical">
      <Box width="fit-content" align="center" verticalAlign="middle" direction="vertical" className="calc-box">
        <Box gap="80px">
          <Cell span={4}>
            <h1>Coin Market Cap<br />Calculator</h1>

            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <dl>
                <dd>
                  <select {...register("coin", {required: 'Ticker is required.'})}>
                    <option value={0}>티커를 선택해주세요.</option>
                    {topCoins.map(coin =>
                      <option key={`coin${coin.id}`} value={coin.id}>
                        {coin.name}
                      </option>
                    )}
                  </select>
                </dd>

                <dt>
                  과거 수익률 (일)
                </dt>
                <dd>
                  <input {...register("day", {required: 'This is required.'})} defaultValue={7} />
                </dd>

                <dt>
                  필터링 기준 (%)
                </dt>
                <dd>
                  <Box gap="5px">
                    <input {...register("yValue", {required: 'This is required.'})} defaultValue={40} />
                    <select {...register("yValueCondition")}>
                      <option value={1}>이상</option>
                      <option value={2}>이하</option>
                    </select>
                  </Box>
                </dd>

                <dt>
                  구간
                  <div className="notice">
                    <Text size="tiny" skin="error">전체기간 탐색을 원할 시 첫번째칸에 '전체기간'으로 입력해주세요.</Text>
                  </div>
                </dt>
                <dd>
                  <Box gap="5px">
                    <input {...register("startDate", {required: 'Start date is required.'})} placeholder="시작일(과거)" />
                    <input {...register("endDate")} placeholder="종료일(최근)" defaultValue={formattedDate(new Date())} />
                  </Box>
                </dd>
              </dl>

              <button type="submit">계산하기</button>
            </form>
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