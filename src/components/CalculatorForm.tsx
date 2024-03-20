import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Coin } from "../type";
import { formattedDate } from "../utils";
import { Box } from "./layout/box/Box";
import { Text } from "./typography/Text";

export interface CalculatorFormProps {
  topCoins: Coin[];
}

export const CalculatorForm = ({
  topCoins
}: CalculatorFormProps) => {
  const { register, watch, getValues, setValue } = useFormContext();
  
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
        <select {...register("coin", { required: 'Ticker is required.' })}>
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