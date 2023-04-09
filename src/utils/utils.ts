function serializeBigInt(_key: string, value: any) {
  return typeof value === 'bigint' ? value.toString() : value;
}

export function asJson(message: unknown): string {
  return JSON.stringify(message, serializeBigInt, 2);
}
