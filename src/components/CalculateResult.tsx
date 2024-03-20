import React from "react";
import { Cell } from "./layout/layout/Cell";
import { Layout } from "./layout/layout/Layout";
import { Text } from "./typography/Text";

export interface CalculateResultProps {
  totalProfits: string[];
  totalWinRates: string[];
  totalCount: number;
}

export const CalculateResult = ({
  totalProfits,
  totalWinRates,
  totalCount
}: CalculateResultProps) => {

  return (
    <Layout gap="10px">
      <Cell span={2}></Cell>
      <Cell span={5}>
        <Text size="small" weight="bold" align="center">평균 수익률</Text>
      </Cell>

      <Cell span={5}>
        <Text size="small" weight="bold" align="center">승률</Text>
      </Cell>

      {totalProfits.map((profit, index) =>
        <React.Fragment key={`result${index}`}>
          <Cell span={2}>
            <Text size="small" weight="bold" align="right">{index + 1}일</Text>
          </Cell>
          <Cell span={5}>
            <Text align="center">{profit}</Text>
          </Cell>

          <Cell span={5}>
            <Text align="center">{totalWinRates[index]}</Text>
          </Cell>
        </React.Fragment>
      )}

      <Cell span={2}></Cell>
      <Cell span={5}>
        <Text size="small" weight="bold" align="center">총 사례</Text>
      </Cell>

      <Cell span={5}>
        <Text size="small" weight="bold" align="center">{totalCount} 회</Text>
      </Cell>
    </Layout>
  )
}