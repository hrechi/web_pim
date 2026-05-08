import { ChevronDown, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFieldStore } from '@/stores/field-store';
import { useFieldsQuery } from '@/hooks/queries/use-fields';
import { useEffect } from 'react';

export function FieldSwitcher() {
  const { data: fields } = useFieldsQuery();
  const fieldList = Array.isArray(fields) ? fields : [];
  const selectedField = useFieldStore((s) => s.selectedField);
  const selectedFieldId = useFieldStore((s) => s.selectedFieldId);
  const setField = useFieldStore((s) => s.setField);

  // Auto-select first field on first load
  useEffect(() => {
    if (!selectedFieldId && fieldList.length > 0) {
      setField(fieldList[0]);
    }
  }, [fieldList, selectedFieldId, setField]);

  // Only show if there are fields
  if (fieldList.length === 0) return null;

  const label = selectedField?.name ?? 'All fields';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-surface px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-muted/50 focus-ring">
          <MapPin className="size-3.5 text-primary shrink-0" />
          <span className="max-w-[120px] truncate">{label}</span>
          <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Switch field</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {fieldList.map((f) => (
          <DropdownMenuItem
            key={f.id}
            onSelect={() => setField(f)}
            className={selectedFieldId === f.id ? 'bg-primary/10 text-primary font-medium' : ''}
          >
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{f.name}</span>
            {selectedFieldId === f.id && (
              <span className="ml-auto text-[10px] font-semibold text-primary">Active</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
