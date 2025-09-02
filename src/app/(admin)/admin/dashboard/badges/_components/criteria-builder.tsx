"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useState } from "react";

type Criteria = {
  rule: string; // e.g., XP_EARNED, COURSES_COMPLETED, LESSONS_COMPLETED, QUIZZES_COMPLETED, STREAK_DAYS, ACTIVITY
  activityType?: string; // when rule === ACTIVITY, use ActivityType
  threshold?: number; // minimum number to achieve
};

export default function CriteriaBuilder({
  initialCriteria,
  inputName = "criteria",
}: {
  initialCriteria?: unknown;
  inputName?: string;
}) {
  const parsedInit: Criteria = useMemo(() => {
    try {
      if (typeof initialCriteria === "string")
        return JSON.parse(initialCriteria);
      if (typeof initialCriteria === "object" && initialCriteria)
        return initialCriteria as Criteria;
    } catch {}
    return { rule: "XP_EARNED", threshold: 100 };
  }, [initialCriteria]);

  const [rule, setRule] = useState<string>(parsedInit.rule || "XP_EARNED");
  const [activityType, setActivityType] = useState<string | undefined>(
    parsedInit.activityType
  );
  const [threshold, setThreshold] = useState<number | undefined>(
    parsedInit.threshold ?? 100
  );

  useEffect(() => {
    if (rule !== "ACTIVITY") setActivityType(undefined);
  }, [rule]);

  const activityTypes = [
    "COURSE_VIEW",
    "COURSE_ENROLLMENT",
    "COURSE_COMPLETION",
    "LESSON_VIEW",
    "LESSON_COMPLETION",
    "QUIZ_ATTEMPT",
    "QUIZ_COMPLETION",
    "ASSIGNMENT_SUBMISSION",
    "REVIEW_POSTED",
    "CERTIFICATE_EARNED",
    "MENTOR_SESSION",
    "RESOURCE_DOWNLOAD",
    "POST_CREATED",
    "COMMENT_POSTED",
    "REACTION_ADDED",
    "BADGE_EARNED",
    "LOGIN",
    "LOGOUT",
    "PROFILE_UPDATE",
    "SETTINGS_CHANGE",
  ];

  const rules = [
    { value: "XP_EARNED", label: "XP acumulado" },
    { value: "COURSES_COMPLETED", label: "Cursos concluídos" },
    { value: "LESSONS_COMPLETED", label: "Lições concluídas" },
    { value: "QUIZZES_COMPLETED", label: "Quizzes concluídos" },
    { value: "STREAK_DAYS", label: "Dias de streak" },
    { value: "ACTIVITY", label: "Atividade específica" },
  ];

  const thresholdLabel = useMemo(() => {
    switch (rule) {
      case "XP_EARNED":
        return "XP mínimo";
      case "COURSES_COMPLETED":
        return "Cursos concluídos (mínimo)";
      case "LESSONS_COMPLETED":
        return "Lições concluídas (mínimo)";
      case "QUIZZES_COMPLETED":
        return "Quizzes concluídos (mínimo)";
      case "STREAK_DAYS":
        return "Dias de streak (mínimo)";
      case "ACTIVITY":
        return "Ocorrências (mínimo)";
      default:
        return "Valor mínimo";
    }
  }, [rule]);

  const thresholdStep = rule === "XP_EARNED" ? 10 : 1;

  const json = useMemo(() => {
    const base: Criteria = { rule };
    if (rule === "ACTIVITY" && activityType) base.activityType = activityType;
    if (threshold !== undefined) base.threshold = threshold;
    return JSON.stringify(base);
  }, [rule, activityType, threshold]);

  return (
    <div className="space-y-3">
      <input type="hidden" name={inputName} value={json} readOnly />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Select value={rule} onValueChange={setRule}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {rules.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {rule === "ACTIVITY" ? (
          <div className="space-y-2">
            <Label>Atividade</Label>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
        <div className="space-y-2">
          <Label>{thresholdLabel}</Label>
          <Input
            type="number"
            min={0}
            step={thresholdStep}
            value={threshold ?? 0}
            onChange={(e) => {
              const n = Number(e.target.value);
              setThreshold(
                Number.isFinite(n)
                  ? rule === "XP_EARNED"
                    ? Math.max(0, Math.round(n))
                    : Math.max(0, Math.floor(n))
                  : 0
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
