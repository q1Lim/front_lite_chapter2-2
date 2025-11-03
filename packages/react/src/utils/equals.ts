/**
 * 두 값의 얕은 동등성을 비교합니다.
 * 객체와 배열은 1단계 깊이까지만 비교합니다.
 */
export const shallowEquals = (a: unknown, b: unknown): boolean => {
  // 여기를 구현하세요.
  // Object.is(), Array.isArray(), Object.keys() 등을 활용하여 1단계 깊이의 비교를 구현합니다.

  if (Object.is(a, b)) return true;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;

  const objectA = a as Record<string, unknown>;
  const objectB = b as Record<string, unknown>;

  const keysA = Object.keys(objectA);
  const keysB = Object.keys(objectB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.is(objectA[key], objectB[key])) return false;
  }
  return true;
};

/**
 * 두 값의 깊은 동등성을 비교합니다.
 * 객체와 배열의 모든 중첩된 속성을 재귀적으로 비교합니다.
 */
export const deepEquals = (a: unknown, b: unknown): boolean => {
  // 여기를 구현하세요.
  // 재귀적으로 deepEquals를 호출하여 중첩된 구조를 비교해야 합니다.

  if (Object.is(a, b)) return true;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (const [index, value] of a.entries()) {
      if (!deepEquals(value, b[index])) return false;
    }
  }

  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);

  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!deepEquals((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) return false;
  }
  return true;
};
