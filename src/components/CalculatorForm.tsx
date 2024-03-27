import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { fetchTopCoins } from "../api";
import { Coin } from "../type";
import { TOP_COINS, TOP_COINS_RELOADDATE, formattedDate } from "../utils";
import { Box } from "./layout/box/Box";
import { Cell } from "./layout/layout/Cell";
import { Layout } from "./layout/layout/Layout";
import { Text } from "./typography/Text";

export interface CalculatorFormProps { }

export const CalculatorForm = ({

}: CalculatorFormProps) => {
  const { register, watch, getValues, setValue } = useFormContext();
  const [topCoinsDate, setTopCoinsDate] = useState<string>('-');
  const [topCoins, setTopCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);

  // 상위 200위의 코인 불러오기
  const fetchTopCoinsData = async () => {
    setLoading(true);

    let coins: any = localStorage.getItem(TOP_COINS);
    // if (!coins) {
    coins = await fetchTopCoins();
    localStorage.setItem(TOP_COINS, JSON.stringify(coins));
    // } else {
    //   coins = JSON.parse(coins);
    // }

    setTopCoins(() => coins);
    setLoading(false);
  };

  const reloadTopCoinData = () => {
    const today = formattedDate(new Date(), true);
    localStorage.setItem(TOP_COINS_RELOADDATE, today);
    setTopCoinsDate(today);

    fetchTopCoinsData();
  }

  useEffect(() => {
    let reloadDate: any = localStorage.getItem(TOP_COINS_RELOADDATE);

    if (reloadDate) {
      setTopCoinsDate(reloadDate);
    }
  }, []);

  useEffect(() => {
    const selectedTickerId = getValues('coin');
    const selectedTicker = topCoins.find(coin => coin.id == selectedTickerId);

    if (selectedTicker) {
      setValue('startDate', selectedTicker?.date_added.substring(0, 10));
    }
  }, [watch('coin')])

  return (
    <dl>
      <dd>
        <Layout gap="3px">
          <Cell span={9}>
            <select {...register("coin", { required: 'Ticker is required.' })}>
              <option value={0}>티커를 선택해주세요.</option>
              {topCoins.map(coin =>
                <option key={`coin${coin.id}`} value={coin.id}>
                  {coin.name}
                </option>
              )}
            </select>
          </Cell>
          <Cell span={3}>
            <button type='button' className="btn-reload" disabled={loading} onClick={() => reloadTopCoinData()}>
              {loading ? `갱신중` : '갱신'}
            </button>
          </Cell>
          <Cell>
            <Text size="tiny">갱신일: {topCoinsDate}</Text>
          </Cell>
        </Layout>
      </dd>

      <dt>
        과거 수익률 (일)
      </dt>
      <dd>
        <input {...register("day", { required: 'This is required.' })} defaultValue={7} />
      </dd>

      <dt>
        필터링 기준 (%)
      </dt>
      <dd>
        <Box gap="5px">
          <input {...register("yValue", { required: 'This is required.' })} defaultValue={40} />
          <select {...register("yValueCondition")}>
            <option value={1}>이상</option>
            <option value={2}>이하</option>
          </select>
        </Box>
      </dd>

      <dt>
        구간
        <div className="notice">
          <Text size="tiny" skin="primary">티커 선택시 자동으로 전체 범위가 선택됩니다.</Text>
        </div>
      </dt>
      <dd>
        <Box gap="5px">
          <input {...register("startDate", { required: 'Start date is required.' })} placeholder="시작일(과거)" />
          <input {...register("endDate")} placeholder="종료일(최근)" defaultValue={formattedDate(new Date())} />
        </Box>
      </dd>
    </dl>
  )
}