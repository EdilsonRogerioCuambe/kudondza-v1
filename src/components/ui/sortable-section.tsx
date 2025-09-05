"use client";

import { BookOpen } from "lucide-react";
import { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SortableItem, SortableList } from "./sortable-list";

export interface SortableSectionProps<T extends SortableItem> {
  title: string;
  subtitle?: string;
  items: T[];
  onReorder: (items: T[]) => void;
  onEdit?: (item: T) => void;
  editUrl?: (item: T) => string;
  onDelete?: (item: T) => void;
  onDuplicate?: (item: T) => void;
  onView?: (item: T) => void;
  viewUrl?: (item: T) => string;
  renderItem?: (item: T, index: number) => ReactNode;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
  headerActions?: ReactNode;
}

export function SortableSection<T extends SortableItem>({
  title,
  subtitle,
  items,
  onReorder,
  onEdit,
  editUrl,
  onDelete,
  onDuplicate,
  onView,
  viewUrl,
  renderItem,
  emptyMessage,
  loading = false,
  className,
  headerActions,
}: SortableSectionProps<T>) {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">
                {title} ({items.length})
              </CardTitle>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          {headerActions}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <SortableList
          items={items}
          onReorder={onReorder}
          onEdit={onEdit}
          editUrl={editUrl}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onView={onView}
          viewUrl={viewUrl}
          renderItem={renderItem}
          emptyMessage={emptyMessage}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}
