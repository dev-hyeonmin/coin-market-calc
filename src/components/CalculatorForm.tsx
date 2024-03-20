import { useFormContext } from "react-hook-form";
import { Coin } from "../type";
import { Cell } from "./layout/layout/Cell";
import { Layout } from "./layout/layout/Layout";

export interface CalculatorFormProps {
  topCoins: Coin[];
}

export const CalculatorForm = ({
  topCoins
}: CalculatorFormProps) => {
  const { register } = useFormContext();

  return (
    <>
      <Layout>
        <Cell span={6}>
          티커
        </Cell>
        <Cell span={6}>
          <select {...register("coin")} defaultValue={5426}>
            {topCoins.map(coin =>
              <option key={`coin${coin.id}`} value={coin.id}>
                {coin.name}
              </option>
            )}
          </select>
        </Cell>

        <Cell span={6}>
          과거 수익률 (일)
        </Cell>
        <Cell span={6}>
          <input {...register("day")} defaultValue={7} />
        </Cell>

        <Cell span={6}>
          필터링 기준
        </Cell>
        <Cell span={6}>
          <input {...register("yValue")} defaultValue={40} />
          <select {...register("yValueCondition")}>
            <option value={1}>이상</option>
            <option value={2}>이하</option>
          </select>
        </Cell>

        <Cell span={6}>
          구간
        </Cell>
        <Cell span={6}>
          <input {...register("startDate")} placeholder="startDate" defaultValue={'2021-03-14'} />
          <input {...register("endDate")} placeholder="endDate" defaultValue={'2024-03-11'} />
        </Cell>
      </Layout>

      <button type="submit">계산하기</button>
    </>
  )
}