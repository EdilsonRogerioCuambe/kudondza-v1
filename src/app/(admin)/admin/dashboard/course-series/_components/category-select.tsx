"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useId, useState } from "react";

type Category = {
  id: string;
  name: string;
};

export default function CategorySelect({
  categories,
  initialId,
  name = "categoryId",
  label = "Categoria",
}: {
  categories: Category[];
  initialId?: string;
  name?: string;
  label?: string;
}) {
  const [value, setValue] = useState<string>(initialId ?? "");
  const inputId = useId();

  useEffect(() => {
    setValue(initialId ?? "");
  }, [initialId]);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input id={inputId} type="hidden" name={name} value={value} readOnly />
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
