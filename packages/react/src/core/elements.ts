/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEmptyValue } from "../utils";
import { VNode } from "./types";
import { Fragment, TEXT_ELEMENT } from "./constants";

/**
 * 주어진 노드를 VNode 형식으로 정규화합니다.
 * null, undefined, boolean, 배열, 원시 타입 등을 처리하여 일관된 VNode 구조를 보장합니다.
 */
export const normalizeNode = (node: any): VNode | null => {
  // 여기를 구현하세요.
  if (isEmptyValue(node)) return null;
  if (typeof node === "string" || typeof node === "number") {
    return createTextElement(node);
  }
  if (Array.isArray(node)) {
    return {
      type: Fragment,
      key: null,
      props: { children: node.map(normalizeNode).filter(Boolean) as VNode[] },
    };
  }
  return node as VNode;
};

/**
 * 텍스트 노드를 위한 VNode를 생성합니다.
 */
const createTextElement = (value: string | number): VNode => {
  // 여기를 구현하세요.
  return {
    type: TEXT_ELEMENT,
    key: null,
    props: {
      children: [],
      nodeValue: String(value),
    },
  } as VNode;
};

/**
 * JSX로부터 전달된 인자를 VNode 객체로 변환합니다.
 * 이 함수는 JSX 변환기에 의해 호출됩니다. (예: Babel, TypeScript)
 */
export const createElement = (
  type: string | symbol | React.ComponentType<any>,
  originProps?: Record<string, any> | null,
  ...rawChildren: any[]
) => {
  // 여기를 구현하세요.
  const { key, ...rest } = originProps ?? {};

  const flatten = (children: any[]): any[] => {
    return children.flatMap((child) => {
      if (Array.isArray(child)) {
        return flatten(child);
      }
      return child;
    });
  };

  const children = flatten(rawChildren).map(normalizeNode).filter(Boolean) as VNode[];
  const props = children.length > 0 ? { ...rest, children } : { ...rest };

  return {
    type: type,
    key: key ?? null,
    props: {
      ...props,
    },
  };
};

/**
 * 부모 경로와 자식의 key/index를 기반으로 고유한 경로를 생성합니다.
 * 이는 훅의 상태를 유지하고 Reconciliation에서 컴포넌트를 식별하는 데 사용됩니다.
 */
export const createChildPath = (
  parentPath: string,
  key: string | null,
  index: number,
  nodeType?: string | symbol | React.ComponentType,
  siblings?: VNode[],
): string => {
  // 여기를 구현하세요.
  // 고유 식별자 문자열을 만드는 규칙 함수
  if (key !== null) return parentPath ? `${parentPath}.k${key}` : `k${key}`;

  if (typeof nodeType === "function") {
    const name = (nodeType as any).displayName || nodeType.name || "Component";
    // 같은 타입의 siblings 체크
    const sameTypeCount = (siblings?.slice(0, index) ?? []).filter((sibling) => sibling.type === nodeType).length;
    const segment = `c${name}_${sameTypeCount}`;

    return parentPath ? `${parentPath}.${segment}` : segment;
  }

  const segment = `i${index}`;
  return parentPath ? `${parentPath}.${segment}` : segment;
};
