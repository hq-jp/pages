interface GoogleError {
  code: number;
  message: string;
}

export default (e: unknown): e is GoogleError => {
  const err = e as Partial<Record<keyof GoogleError, unknown>> | null;
  return (
    typeof err === "object" &&
    err !== null &&
    typeof err.code === "number" &&
    typeof err.message === "string"
  );
};
