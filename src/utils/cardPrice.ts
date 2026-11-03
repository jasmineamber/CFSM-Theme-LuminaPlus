import { t } from "@/i18n";
import type { NodeInfo } from "@/types/cfsm";
import { formatRenewalPrice } from "@/utils/billing";
import { convertToCny, isCnyCurrency } from "@/utils/cost";
import type { CardPriceMode } from "@/utils/themeSettings";

type CardPriceNode = Pick<
  NodeInfo,
  "price" | "currency" | "billing_cycle" | "expired_at"
>;

/** 依价格模式格式化一个节点的账单价格；换算目标与资产统计一致，为人民币。 */
export function formatCardRenewalPrice(
  node: CardPriceNode,
  mode: CardPriceMode,
  rates: Record<string, number> | null,
  isLoading: boolean,
): string | null {
  const originalPrice = formatRenewalPrice(node);
  if (!originalPrice || mode === "original" || node.price <= 0) return originalPrice;

  // 人民币节点直接复用原金额，不等待汇率；单价模式规范成 ¥，双价模式避免重复。
  if (isCnyCurrency(node.currency)) {
    return mode === "converted"
      ? formatRenewalPrice({ ...node, currency: "¥" })
      : originalPrice;
  }

  const converted = rates ? convertToCny(node.price, node.currency, rates) : null;
  const convertedPrice =
    converted != null && Number.isFinite(converted)
      ? formatRenewalPrice({ ...node, price: converted, currency: "¥" })
      : isLoading
        ? t("home.assetsCalculating")
        : t("cost.noteMissingRate");

  return mode === "both" ? `${originalPrice} · ${convertedPrice}` : convertedPrice;
}
