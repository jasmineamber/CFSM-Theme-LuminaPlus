import { createContext } from "react";

export interface CardPriceRatesState {
  rates: Record<string, number> | null;
  isLoading: boolean;
}

/** 首页汇率查询通过 context 共享给所有节点卡片，避免每张卡都创建查询观察者。 */
export const CardPriceRatesContext = createContext<CardPriceRatesState>({
  rates: null,
  isLoading: false,
});
