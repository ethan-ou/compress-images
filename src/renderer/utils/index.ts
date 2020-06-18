import { getDroppedOrSelectedFiles } from './fileSelector';

export { getDroppedOrSelectedFiles };

export function* range(num1: number, num2: number): Generator<number, void, unknown> {
  const start = num1 <= num2 ? num1 : num2;
  const end = num2 >= num1 ? num2 : num1;

  for (let i = start; i <= end; i += 1) {
    yield i;
  }
}
