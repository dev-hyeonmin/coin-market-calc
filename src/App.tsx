import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Coin } from "./type";

type FormProps = {
  coin: number;
  day: number;
  percent: number;
  period: string;
}

function App() {
  const [_, setTopCoins] = useState<Coin[]>([]);

  useEffect(() => {
    // 상위 200위의 코인 불러오기
    const fetchTopCoinsData = async () => {
      // const coins = await fetchTopCoins();
      // console.log(coins);
      // setTopCoins(coins);
    };

    fetchTopCoinsData();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormProps>()
  const onSubmit: SubmitHandler<FormProps> = (data) => console.log(data)

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <select {...register("coin")}>
          <option value={74}>Dogecoin</option>
        </select>

        <input {...register("day")} defaultValue={1}/>
        <input {...register("percent")} defaultValue={20}/>
        <input {...register("period")} />

        <button type="submit">계산하기</button>
      </form>
    </div>
  )
}

export default App