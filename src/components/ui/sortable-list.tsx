"use client";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface SortableItem {
  id: string;
  title: string;
  slug?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface SortableListProps<T extends SortableItem> {
  items: T[];
  onReorder: (items: T[]) => void;
  onEdit?: (item: T) => void;
  editUrl?: (item: T) => string;
  onDelete?: (item: T) => void;
  onDuplicate?: (item: T) => void;
  onView?: (item: T) => void;
  viewUrl?: (item: T) => string;
  renderItem?: (item: T, index: number) => ReactNode;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
}

function SortableItemComponent<T extends SortableItem>({
  item,
  index,
  onEdit,
  editUrl,
  onDelete,
  onDuplicate,
  onView,
  viewUrl,
  renderItem,
}: {
  item: T;
  index: number;
  onEdit?: (item: T) => void;
  editUrl?: (item: T) => string;
  onDelete?: (item: T) => void;
  onDuplicate?: (item: T) => void;
  onView?: (item: T) => void;
  viewUrl?: (item: T) => string;
  renderItem?: (item: T, index: number) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;

  const _hasActions = onEdit || onDelete || onDuplicate || onView;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between rounded-md border bg-card px-3 py-2 transition-all duration-200",
        isDragging && "ring-2 ring-primary shadow-lg z-50"
      )}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
          aria-label="Arrastar"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        {renderItem ? (
          renderItem(item, index)
        ) : (
          <span className="font-medium text-sm truncate">
            {index + 1}. {item.title}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Ícone de lápis direto para editar */}
        {(onEdit || editUrl) &&
          (editUrl ? (
            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
              <Link href={editUrl(item)}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onEdit?.(item)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
          ))}

        {/* Menu dropdown para outras ações */}
        {(onView || onDuplicate || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              {(onView || viewUrl) &&
                (viewUrl ? (
                  <DropdownMenuItem asChild>
                    <Link href={viewUrl(item)}>
                      <span className="mr-2">👁️</span>
                      Visualizar
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onView?.(item)}>
                    <span className="mr-2">👁️</span>
                    Visualizar
                  </DropdownMenuItem>
                ))}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(item)}>
                  <span className="mr-2">📋</span>
                  Duplicar
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  {(onView || onDuplicate) && <hr className="my-1" />}
                  <DropdownMenuItem
                    onClick={() => onDelete(item)}
                    className="text-destructive focus:text-destructive"
                  >
                    <span className="mr-2">🗑️</span>
                    Excluir
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

export function SortableList<T extends SortableItem>({
  items,
  onReorder,
  onEdit,
  editUrl,
  onDelete,
  onDuplicate,
  onView,
  viewUrl,
  renderItem,
  className,
  emptyMessage = "Nenhum item cadastrado ainda.",
  loading = false,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === String(active.id));
    const newIndex = items.findIndex((item) => item.id === String(over.id));

    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove(items, oldIndex, newIndex);
    onReorder(newItems);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={cn("flex flex-col gap-2", className)}>
          {items.map((item, index) => (
            <SortableItemComponent
              key={item.id}
              item={item}
              index={index}
              onEdit={onEdit}
              editUrl={editUrl}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onView={onView}
              viewUrl={viewUrl}
              renderItem={renderItem}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
