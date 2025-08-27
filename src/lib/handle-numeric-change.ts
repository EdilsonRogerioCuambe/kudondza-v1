export const handleNumericChange = (
  onChange: (value: number | undefined) => void,
  allowUndefined = false
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (allowUndefined && raw === "") {
      onChange(undefined);
      return;
    }
    const num = Number(raw);
    onChange(Number.isFinite(num) ? num : 0);
  };
};
